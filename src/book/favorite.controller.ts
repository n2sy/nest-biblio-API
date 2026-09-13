import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { Cron } from '@nestjs/schedule';

// Les favoris appartiennent à l'utilisateur authentifié : l'id du user vient
// TOUJOURS du token (request.user), jamais d'un paramètre de la requête.
@Controller('favorite')
@ApiTags('Favoris')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  @Inject(FavoriteService) favSer: FavoriteService;

  @Get('all')
  async getMyFavorites(@Req() request: Request) {
    let result = await this.favSer.chercherFavorisDeUser(request.user['id']);
    return result;
  }

  @Post('add/:bookId')
  async addFavorite(
    @Req() request: Request,
    @Param('bookId', ParseIntPipe) bookId,
  ) {
    let result = await this.favSer.ajouterFavori(request.user['id'], bookId);
    return { message: 'Livre ajouté aux favoris', result };
  }

  @Delete('delete')
  async removeAllFavorite(@Req() request: Request) {
    let result = await this.favSer.supprimerTousLesFavori(request.user['id']);
    return { message: 'Tous les livres retirés des favoris', result };
  }

  @Delete('delete/:bookId')
  async removeFavorite(
    @Req() request: Request,
    @Param('bookId', ParseIntPipe) bookId,
  ) {
    let result = await this.favSer.supprimerFavori(request.user['id'], bookId);
    return { message: 'Livre retiré des favoris', result };
  }
}
