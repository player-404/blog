import { Controller, Post, Body } from '@nestjs/common';
import { UserDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signIn')
  async signIn(@Body() user: UserDto) {
    return await this.authService.signIn(user.username, user.password);
  }
}
