/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { BlacklistedToken } from './entities/blacklisted-token.entity';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
}

export interface LoginResult {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistedTokenRepository: Repository<BlacklistedToken>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async validateToken(payload: JwtPayload): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    });
    return user;
  }

  async refreshToken(userId: string): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(token: string, userId: string): Promise<void> {
    try {
      // Decode the token to get expiration time
      const decoded = this.jwtService.decode(token) as any;
      const expiresAt = new Date(decoded.exp * 1000); // Convert unix timestamp to Date

      // Add token to blacklist
      const blacklistedToken = this.blacklistedTokenRepository.create({
        token,
        userId,
        expiresAt,
      });

      await this.blacklistedTokenRepository.save(blacklistedToken);
    } catch (error) {
      // If there's an error decoding the token, we can still consider logout successful
      console.error('Error blacklisting token:', error);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistedTokenRepository.findOne({
      where: { token },
    });

    return !!blacklistedToken;
  }

  // Clean up expired blacklisted tokens (optional - can be run as a cron job)
  async cleanupExpiredTokens(): Promise<void> {
    await this.blacklistedTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}
