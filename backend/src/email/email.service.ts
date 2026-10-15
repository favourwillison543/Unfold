import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationOtp(email: string, otp: string) {
    await this.resend.emails.send({
      from: 'Unfold <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your Unfold email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2>Verify your email</h2>

          <p>
            Use the verification code below to verify your Unfold account.
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 24px 0;
          ">
            ${otp}
          </div>

          <p>
            This code expires in 10 minutes.
          </p>

          <p>
            If you did not create an Unfold account, you can ignore this email.
          </p>
        </div>
      `,
    });
  }

  async sendPasswordResetOtp(email: string, otp: string) {
    await this.resend.emails.send({
      from: 'Unfold <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your Unfold password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2>Reset your password</h2>

          <p>
            Use the code below to reset your Unfold password.
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 24px 0;
          ">
            ${otp}
          </div>

          <p>
            This code expires in 10 minutes.
          </p>

          <p>
            If you did not request a password reset, you can ignore this email.
          </p>
        </div>
      `,
    });
  }

  async sendProjectInvitation(
    email: string,
    projectName: string,
    inviterName: string,
    role: 'editor' | 'viewer',
    invitationUrl: string,
  ) {
    await this.resend.emails.send({
      from: 'Unfold <onboarding@resend.dev>',
      to: email,
      subject: `You've been invited to ${projectName} on Unfold`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2>You've been invited to a project</h2>
  
          <p>
            ${inviterName} invited you to collaborate on
            <strong>${projectName}</strong> on Unfold.
          </p>
  
          <p>
            Your role will be:
            <strong>${role}</strong>
          </p>
  
          <div style="margin: 32px 0;">
            <a
              href="${invitationUrl}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background: #C65D3A;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
              "
            >
              Accept invitation
            </a>
          </div>
  
          <p>
            This invitation expires in 7 days.
          </p>
  
          <p>
            If you were not expecting this invitation, you can ignore this email.
          </p>
        </div>
      `,
    });
  }
}