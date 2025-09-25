import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/entities/user.entity';
import { BlacklistedToken } from './entities/blacklisted-token.entity';
import { TokenCleanupService } from './token-cleanup.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BlacklistedToken]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-here',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, TokenCleanupService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
