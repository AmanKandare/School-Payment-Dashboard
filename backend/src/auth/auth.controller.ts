import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body) {
    const { username, email, password } = body;
    try {
      const user = await this.authService.register(username, email, password);
      const { password: _, ...result } = user.toObject();
      return { message: 'User created successfully', user: result };
    } catch (error) {
      throw new UnauthorizedException('User creation failed: ' + error.message);
    }
  }
}
