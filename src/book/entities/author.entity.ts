import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Timestamp } from '../timestamp/timestamp';
import { BookEntity } from './book.entity';

@Entity('auteur')
export class AuthorEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id;

  @Column({
    type: 'varchar',
    length: 20,
  })
  prenom;

  @Column({
    type: 'varchar',
    length: 20,
    // update: false,
    // unique: true,
  })
  nom;

  @OneToMany(() => BookEntity, (b) => b.auteur)
  listeLivres: BookEntity[];
}
