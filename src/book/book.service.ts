import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from 'src/auth/generics/role.enum';
import { FavoriteService } from './favorite.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity) private bookRepo: Repository<BookEntity>,
    private FavService: FavoriteService,
  ) {}

  chercherTousLesLivres() {
    return this.bookRepo.find({
      //loadRelationIds: true,
      relations: {
        auteur: true,
      },
    });
  }

  ajouterLivre(nBook, idUser) {
    //nBook.user = idUser;
    let newBook = this.bookRepo.create({
      // title: nBook.title,
      // editor: nBook.editor,
      // year: nBook.year,
      // author: nBook.author,
      ...nBook,
      user: idUser,
    });
    return this.bookRepo.save(newBook);
  }

  async chercherLivreParId(bookId: number) {
    const livre = await this.bookRepo.findOne({
      where: {
        id: bookId,
      },
      relations: {
        auteur: true,
      },
    });

    if (!livre) {
      throw new NotFoundException(`Le livre avec l'ID ${bookId} n'existe pas.`);
    }

    return livre;
  }

  async editerLivre(uBook, bookId) {
    // booid : number
    let b = await this.bookRepo.preload({
      id: bookId,
      titre: uBook.title,
      annee: uBook.year,
      editeur: uBook.editor,
      image: uBook.image,
      description: uBook.summary,
      auteur: uBook.author,
    });
    if (!b) throw new NotFoundException("Ce livre n'existe pas");

    return this.bookRepo.save(b);
  }

  supprimerLivreV1(id) {
    let res = this.bookRepo.delete(id);
    this.FavService.supprimerFavorisDuLivre(id);
    return res;
  }

  async supprimerLivreV2(id) {
    let result = await this.chercherLivreParId(id);
    return this.bookRepo.remove(result);
  }

  softsupprimerLivreV1(id) {
    return this.bookRepo.softDelete(id);
  }

  async softsupprimerLivreV2(bookId, user) {
    let result = await this.chercherLivreParId(bookId);
    console.log(result, user);

    if (result[0]['user'] == user.id || user.role == RoleEnum.ROLE_ADMIN)
      return this.bookRepo.softRemove(result);
    else
      throw new UnauthorizedException(
        "Vous n'êtes pas celui qui a ajouté le livre d'id " + bookId,
      );
  }

  restoreLivre(id) {
    return this.bookRepo.restore(id);
  }

  async recoverLivre(bookId) {
    let result = await this.bookRepo.find({
      withDeleted: true,
      where: {
        id: bookId,
      },
    });
    console.log(result);

    return this.bookRepo.recover(result);
  }

  nbreLivresParAnnee() {
    const qb = this.bookRepo.createQueryBuilder('book');
    return qb
      .select('book.annee, count(book.id) as nbreDeLivres')
      .groupBy('book.annee')
      .getRawMany();
  }

  nbreLivresEntreDeuxAnnees(annee1, annee2) {
    const qb = this.bookRepo.createQueryBuilder('book');
    return (
      qb
        .select('book.annee, count(book.id) as nbreDeLivres')
        // .where('book.annee >= :a1 AND book.annee <= :a2', {a1 : annee1, a2 : annee2})
        .where('book.annee >= :a1 AND book.annee <= :a2')
        .setParameters({ a1: annee1, a2: annee2 })
        .groupBy('book.annee')
        .getRawMany()
    );
  }
}
