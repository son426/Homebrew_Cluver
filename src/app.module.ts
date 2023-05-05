import { Module } from '@nestjs/common';
import { ClubController } from './apis/club/club.controller';
import { ClubService } from './apis/club/club.service';

@Module({
  imports: [],
  controllers: [ClubController],
  providers: [ClubService],
})
export class AppModule {}
