import { Controller, Get } from '@nestjs/common';
import { version } from 'package.json';

@Controller()
export class AppController {
  @Get('/health')
  health(): Record<string, string> {
    return {};
  }

  @Get('getVersion')
  getVersion(): { version: string; timeSystem: Date } {
    return {
      version,
      timeSystem: new Date(),
    };
  }
}
