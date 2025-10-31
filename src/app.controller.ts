import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  returnHealth(): object {
    const projectHealth = {
      name: 'BMS',
      version: '1.0.0',
      status: 'healthy',
      message: 'Project is running',
      timestamp: new Date().toISOString(),
    };
    return projectHealth;
  }
}
