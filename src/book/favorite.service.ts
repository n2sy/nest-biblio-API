import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from './entities/favorite.entity';
import { BookEntity } from './entities/book.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private favRepo: Repository<FavoriteEntity>,
    @InjectRepository(BookEntity)
    private bookRepo: Repository<BookEntity>,
  ) {}

  // Les livres favoris d'un user, auteur compris.
  async chercherFavorisDeUser(userId) {
    let favoris = await this.favRepo.find({
      where: { user: { id: userId } },
      relations: { book: { auteur: true } },
    });
    // Un livre soft-supprimé n'est plus chargé par la relation : on écarte
    // ces favoris orphelins au lieu de renvoyer des trous dans la liste.
    return favoris.filter((f) => f.book).map((f) => f.book);
  }

  async ajouterFavori(userId, bookId) {
    let livre = await this.bookRepo.findOne({ where: { id: bookId } });
    if (!livre) throw new NotFoundException("Ce livre n'existe pas");

    let existant = await this.favRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });
    if (existant)
      throw new ConflictException('Ce livre est déjà dans vos favoris');

    let nouveau = this.favRepo.create({ user: userId, book: bookId });
    return this.favRepo.save(nouveau);
  }

  // Appelé quand un livre est supprimé définitivement.
  supprimerFavorisDuLivre(bookId) {
    return this.favRepo.delete({ book: { id: bookId } });
  }

  async supprimerFavori(userId, bookId) {
    console.log('userId', userId, 'bookId', bookId);
    let result = await this.favRepo.delete({
      user: { id: userId },
      book: { id: bookId },
    });
    if (result.affected == 0)
      throw new NotFoundException("Ce livre n'est pas dans vos favoris");
    return result;
  }

  //@Cron('1 * * * * *', { name: 'tendances' })
  async supprimerTousLesFavori(userId) {
    console.log("Suppression de tous les favoris de l'utilisateur", userId);
    let result = await this.favRepo.delete({
      user: { id: userId },
    });
    if (result.affected == 0)
      throw new NotFoundException("Vous n'avez pas de favoris");
    return result;
  }
}
