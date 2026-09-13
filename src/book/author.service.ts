import { Injectable } from '@nestjs/common';
import { AuthorEntity } from './entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity) private authRepo: Repository<AuthorEntity>,
  ) {}
  chercherTousLesAuteurs() {
    return this.authRepo.find({
      relations: {
        listeLivres: true,
      },
    });
  }

  ajouterAuteur(body) {
    return this.authRepo.save(body);
  }

  chercherAuteurParId(authorId) {
    return this.authRepo.findOne({
      where: {
        id: authorId,
      },
    });
  }

  supprimerAuteur(id) {
    return this.authRepo.softDelete(id);
  }
}
