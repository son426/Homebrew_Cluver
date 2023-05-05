import { Controller, Get } from '@nestjs/common';
import { ClubService } from './club.service';

@Controller()
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  getHello(): string {
    return this.clubService.getHello();
  }
}
