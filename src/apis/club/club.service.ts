import { Injectable } from '@nestjs/common';

@Injectable()
export class ClubService {
  // test api
  // 실제로 코드 짤때는 이거 삭제.
  getHello(): string {
    return 'Hello World!';
  }
}
