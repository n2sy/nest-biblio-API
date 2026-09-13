import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../generics/role.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 30,
  })
  email: string;

  @Column({
    unique: true,
    length: 30,
  })
  username: string;

  @Column({
    default: '',
  })
  password: string;

  @Column()
  salt: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    //default : RoleEnum.ROLE_USER
  })
  role;
}
