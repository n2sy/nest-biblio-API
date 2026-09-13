import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from './generics/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRep: Repository<UserEntity>,
    private jwtSer: JwtService,
  ) {}

  async inscription(identifiants) {
    // 1. Compter le nombre d'utilisateurs existants dans la table
    const usersCount = await this.userRep.count();

    // 2. Assigner le rôle (Admin si 0 utilisateur, User pour les suivants)
    const assignedRole =
      usersCount === 0 ? RoleEnum.ROLE_ADMIN : RoleEnum.ROLE_USER;
    let newUser = this.userRep.create({
      email: identifiants.email,
      username: identifiants.username,
      //   password : identifiants.password,
      salt: await bcrypt.genSalt(),
      role: assignedRole,
    });

    newUser.password = await bcrypt.hash(identifiants.password, newUser.salt);

    try {
      // ⚠️ TRÈS IMPORTANT : Il faut mettre le "await" ici pour que le catch puisse intercepter l'erreur de TypeORM
      return await this.userRep.save(newUser);
    } catch (error) {
      // On intercepte l'erreur MySQL de duplication (Code ER_DUP_ENTRY ou 1062)
      if (error['code'] === 'ER_DUP_ENTRY')
        throw new ConflictException(
          'Un compte existe déjà avec cette adresse email.',
        );

      // Si c'est une autre erreur de base de données, on renvoie une erreur 500 classique
      console.error(error); // Pour toi dans la console
      throw new InternalServerErrorException(
        "Une erreur serveur est survenue lors de l'inscription.",
      );
    }
  }

  async seConnecter(body) {
    // let identifiant = body.identifiant;
    // let password = body.password
    let { identifiant, password } = body;
    let qb = this.userRep.createQueryBuilder('user');
    let u = await qb
      .select('user')
      .where('user.username = :ident OR user.email = :ident', {
        ident: identifiant,
      })
      .getOne();

    if (!u) throw new NotFoundException('Username ou Email inexistant');

    const result = await bcrypt.compare(password, u.password);

    if (!result) throw new NotFoundException('Mot de passe erroné');
    else {
      const token = this.jwtSer.sign({
        id: u.id,
        role: u.role,
        email: u.email,
        username: u.username,
      });
      return {
        access_token: token,
      };
    }
  }
}
