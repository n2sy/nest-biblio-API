import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BookEntity } from './book.entity';
import { UserEntity } from 'src/auth/entities/user.entity';

// Table de liaison explicite entre un user et un livre.
// On aurait pu utiliser un @ManyToMany + @JoinTable, mais une entité dédiée
// permet la contrainte d'unicité, la date d'ajout, et évite l'import circulaire
// entre user.entity et book.entity.
@Entity('favori')
@Unique(['user', 'book'])
export class FavoriteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;

  // onDelete CASCADE : supprimer un livre nettoie automatiquement les favoris
  // qui le référencent.
  @ManyToOne(() => BookEntity, { onDelete: 'CASCADE' })
  book: BookEntity;

  @CreateDateColumn()
  createdAt;
}
