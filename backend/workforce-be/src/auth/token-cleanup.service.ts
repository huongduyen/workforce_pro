import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class TokenCleanupService {
  constructor(private readonly authService: AuthService) {}

  // Manual cleanup method that can be called via API or scheduled externally
  async cleanupExpiredTokens() {
    console.log('Running token cleanup task...');
    try {
      await this.authService.cleanupExpiredTokens();
      console.log('Token cleanup completed successfully');
      return { success: true, message: 'Token cleanup completed successfully' };
    } catch (error) {
      console.error('Token cleanup failed:', error);
      return { success: false, message: 'Token cleanup failed' };
    }
  }
}
