import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorator/my.decoator';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('a')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
