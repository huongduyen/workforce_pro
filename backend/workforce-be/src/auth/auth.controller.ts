/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { TokenCleanupService } from './token-cleanup.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenCleanupService: TokenCleanupService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );
      return {
        success: true,
        ...result,
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {
      success: true,
      user: req.user,
      message: 'Profile retrieved successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    try {
      const result = await this.authService.refreshToken(req.user.userId);
      return {
        success: true,
        ...result,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Token refresh failed',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    // Extract token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    await this.authService.logout(token, req.user.userId);
    return {
      success: true,
      message: 'Logout successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('cleanup-tokens')
  async cleanupExpiredTokens(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      return {
        success: false,
        message: 'Unauthorized: Admin access required',
      };
    }

    return await this.tokenCleanupService.cleanupExpiredTokens();
  }
}
