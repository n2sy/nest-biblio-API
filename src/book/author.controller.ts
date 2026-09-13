import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/admin-auth/admin-auth.guard';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';

@Controller('authors')
@ApiTags('Auteurs')
export class AuthorController {
  @Inject(AuthorService) private authSer: AuthorService;

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllAuthors() {
    let data = await this.authSer.chercherTousLesAuteurs();
    return data;
  }

  @Post('add')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  async addAuthor(@Body() body) {
    let data = await this.authSer.ajouterAuteur(body);
    return {
      message: 'Auteur créé avec succès',
      data,
    };
  }

  @Get('all/:authorid')
  @UseGuards(JwtAuthGuard)
  async getAuthorById(@Param('authorid') id) {
    let data = await this.authSer.chercherAuteurParId(id);
    return data;
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  async deleteAuthor(@Param('id') id) {
    let data = await this.authSer.supprimerAuteur(id);
    return data;
  }
}
