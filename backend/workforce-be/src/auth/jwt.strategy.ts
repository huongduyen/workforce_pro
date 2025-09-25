/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-here',
      passReqToCallback: true, // This allows us to access the request object
    });
  }

  async validate(request: any, payload: JwtPayload) {
    // Extract token from Authorization header
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const token = request.headers.authorization?.replace('Bearer ', '');

    // Check if token is blacklisted
    if (token && (await this.authService.isTokenBlacklisted(token))) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const user = await this.authService.validateToken(payload);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
