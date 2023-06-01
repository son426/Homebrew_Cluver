import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClubStatus } from './club-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateClubDto } from './dto/create-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/entity/club.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Manager } from 'src/entity/manager.entity';
import { Attendance } from 'src/entity/attendance.entity';
import { ClubAttendance } from 'src/entity/club_attendance.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,

    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async getAllClubs(): Promise<Club[]> {
    const found = await this.clubRepository.find({ order: { name: 'ASC' } });
    const test = await this.attendanceRepository.find({ order: { id: 'ASC' } });

    for (const attendance of test) {
      console.log(attendance.club_attendance.date);
    }

    return found;
  }

  async getClubsByManager(manager: Manager): Promise<Club[]> {
    return manager.clubs;
  }

  async getClubById(id: number): Promise<Club> {
    const club = await this.clubRepository
      .createQueryBuilder('club')
      .leftJoinAndSelect('club.club_attendances', 'club_attendance')
      .leftJoinAndSelect('club.users', 'user')
      .leftJoinAndSelect('user.attendances', 'attendance')
      .leftJoinAndSelect(
        'attendance.club_attendance',
        'attendance_club_attendance',
      )
      .leftJoinAndSelect('club.posts', 'post')
      .where('club.id = :clubId', { clubId: id })
      .andWhere('attendance.clubId = :clubId', { clubId: id }) // Filter attendances by clubId
      .orderBy('user.id', 'ASC')
      .addOrderBy('attendance.id', 'ASC')
      .addOrderBy('club_attendance.id', 'ASC')
      .getOne();

    const test = await this.clubRepository.findOne({
      where: { id },
    });

    for (const user of club.users) {
      for (const attendance of user.attendances) {
        console.log(attendance);
      }
    }

    console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡ');

    for (const user of test.users) {
      for (const attendance of user.attendances) {
        console.log(attendance);
      }
    }

    if (!club) {
      throw new NotFoundException(`Can't found Club with id ${id}`);
    }

    return club;
  }

  async getClubsByName(name: string) {
    const clubs = await this.clubRepository.find({
      where: { name: ILike(`%${name}%`) },
    });
    console.log('name : ', name);
    return clubs;
  }

  async createClub(
    createClubDto: CreateClubDto,
    manager: Manager,
  ): Promise<Club> {
    const { name, description, img, is_public, club_code } = createClubDto;
    const clubCode = club_code ? club_code : '기본코드';

    const club = {
      name,
      description,
      status: is_public ? ClubStatus.PUBLIC : ClubStatus.PRIVATE,
      img,
      club_code: clubCode,
    };

    // club Repository에 저장
    const saved_club = await this.clubRepository.save(club);

    // manager Repository에 저장
    manager.clubs.push(saved_club);

    console.log(manager.id, manager.manager_name);

    await this.managerRepository.save(manager);

    return saved_club;
  }

  async deleteClub(id: number, user: User): Promise<string> {
    const result = await this.clubRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Club with id ${id}`);
    } else if (result.affected === 1) {
      return '삭제 완료';
    }
  }

  async updateClub(createClubDto, id: number): Promise<Club> {
    const club = await this.getClubById(id);
    const { name, description, img, is_public, club_code } = createClubDto;

    club.name = name;
    club.description = description;
    club.img = img;
    club.club_code = club_code;
    club.status = is_public ? ClubStatus.PUBLIC : ClubStatus.PRIVATE;

    return await this.clubRepository.save(club);
  }
}
