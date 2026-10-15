import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';

import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AnalysisModule } from './analysis/analysis.module';
import { AiModule } from './ai/ai.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { ChallengesModule } from './challenges/challenges.module';
import { EmailModule } from './email/email.module';
import { PublicSharingModule } from './public-sharing/public-sharing.module';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserThrottlerGuard } from './auth/user-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        ssl: config.get<string>('DB_SSL') === 'require'
          ? { rejectUnauthorized: false }
          : config.get<string>('DB_SSL') === 'true',
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 70,
      },
      {
        name: 'user',
        ttl: 60_000,
        limit: 50,
      },
    ]),

    ProjectsModule,
    UsersModule,
    AuthModule,
    AnalysisModule,
    AiModule,
    WorkflowsModule,
    ChallengesModule,
    EmailModule,
    PublicSharingModule,
  ],

  controllers: [],

  providers: [
  

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGuard,
    },
  ],
})
export class AppModule {}