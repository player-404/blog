import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { UserDto, Req } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.gurad';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  async signIn(@Body() user: UserDto) {
    return await this.authService.signIn(user.username, user.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: Req) {
    return {
      status: HttpStatus.OK,
      msg: 'ok',
      data: req.user,
    };
  }
}
