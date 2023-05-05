import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  img: string;

  @Column()
  admin: string;

  // join1
  // 동아리원

  // join2
  // 모임일자

  // join3
  // 모임일자 별 참가자
}
