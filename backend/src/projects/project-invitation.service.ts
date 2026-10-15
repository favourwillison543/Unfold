import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  import { randomBytes } from 'crypto';
  
  import { EmailService } from '../email/email.service';
  import { Project } from './project.entity';
  import { ProjectInvitation } from './project-invitation.entity';
  import { ProjectMember } from './project-member.entity';
  
  @Injectable()
  export class ProjectInvitationService {
    constructor(
      private readonly emailService: EmailService,
  
      @InjectRepository(Project)
      private readonly projectRepository: Repository<Project>,
  
      @InjectRepository(ProjectMember)
      private readonly projectMemberRepository: Repository<ProjectMember>,
  
      @InjectRepository(ProjectInvitation)
      private readonly projectInvitationRepository: Repository<ProjectInvitation>,
    ) {}
  
    async createInvitation(
      projectId: number,
      email: string,
      role: 'editor' | 'viewer',
      userId: number,
    ) {
      const project = await this.projectRepository.findOneBy({
        id: projectId,
      });
  
      if (!project) {
        throw new NotFoundException('Project not found');
      }
  
      if (project.createdById !== userId) {
        throw new BadRequestException(
          'Only the project owner can invite members',
        );
      }
  
      const normalizedEmail = email.trim().toLowerCase();
  
      const existingInvitation =
        await this.projectInvitationRepository.findOne({
          where: {
            projectId,
            email: normalizedEmail,
          },
        });
  
      if (existingInvitation) {
        if (
          existingInvitation.acceptedAt === null &&
          existingInvitation.expiresAt > new Date()
        ) {
          throw new ConflictException(
            'An invitation has already been sent to this email',
          );
        }
  
        await this.projectInvitationRepository.remove(
          existingInvitation,
        );
      }
  
      const token = randomBytes(32).toString('hex');
  
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      );
  
      const invitation =
        this.projectInvitationRepository.create({
          projectId,
          email: normalizedEmail,
          role,
          token,
          expiresAt,
          acceptedAt: null,
        });
  
      const savedInvitation =
        await this.projectInvitationRepository.save(
          invitation,
        );
  
      const invitationUrl =
        `${process.env.FRONTEND_URL}/invitations/${savedInvitation.token}`;
  
      await this.emailService.sendProjectInvitation(
        normalizedEmail,
        project.name,
        'The project owner',
        role,
        invitationUrl,
      );
  
      return savedInvitation;
    }
  
    async acceptInvitation(
      token: string,
      userId: number,
      userEmail: string,
    ) {
      const invitation =
        await this.projectInvitationRepository.findOne({
          where: {
            token,
          },
        });
  
      if (!invitation) {
        throw new NotFoundException(
          'Invitation not found',
        );
      }
  
      if (invitation.acceptedAt) {
        throw new BadRequestException(
          'This invitation has already been accepted',
        );
      }
  
      if (invitation.expiresAt < new Date()) {
        throw new BadRequestException(
          'This invitation has expired',
        );
      }
  
      const normalizedUserEmail =
        userEmail.trim().toLowerCase();
  
      if (
        normalizedUserEmail !== invitation.email
      ) {
        throw new BadRequestException(
          'This invitation was sent to a different email address',
        );
      }
  
      const project =
        await this.projectRepository.findOneBy({
          id: invitation.projectId,
        });
  
      if (!project) {
        throw new NotFoundException(
          'Project not found',
        );
      }
  
      if (project.createdById === userId) {
        throw new BadRequestException(
          'You are already the owner of this project',
        );
      }
  
      const existingMember =
        await this.projectMemberRepository.findOne({
          where: {
            projectId: invitation.projectId,
            userId,
          },
        });
  
      if (!existingMember) {
        await this.projectMemberRepository.save(
          this.projectMemberRepository.create({
            projectId: invitation.projectId,
            userId,
            role: invitation.role,
          }),
        );
      }
  
      invitation.acceptedAt = new Date();
  
      await this.projectInvitationRepository.save(
        invitation,
      );
  
      return {
        message: 'Invitation accepted successfully',
        projectId: invitation.projectId,
        role: invitation.role,
      };
    }
  }