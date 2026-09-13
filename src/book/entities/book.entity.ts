import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Timestamp } from '../timestamp/timestamp';
import { AuthorEntity } from './author.entity';
import { UserEntity } from 'src/auth/entities/user.entity';

@Entity('livre')
export class BookEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    // name: 'titre',
    length: 30,
    // unique: true,
    // update: false,
  })
  titre: string;

  @Column()
  editeur: string;

  @Column({
    type: 'int',
  })
  annee: number;

  @Column({ nullable: true, length: 500 })
  image: string;

  @Column()
  description: string;

  @ManyToOne(() => AuthorEntity, (a) => a.listeLivres, {
    //cascade: true,
  })
  auteur: AuthorEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
