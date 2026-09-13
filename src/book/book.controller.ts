import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { AdminAuthGuard } from 'src/admin-auth/admin-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('books')
@ApiTags('Livres')
// @UseInterceptors(DurationInterceptor)
export class BookController {
  @Inject(BookService) bookSer: BookService;
  @Inject(AuthorService) authSer: AuthorService;

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllBooks() {
    // this.bookSer
    //   .chercherTousLesLivres()
    //   .then((response: BookEntity[]) => {
    //     return response;
    //   })
    //   .catch((err) => {
    //     throw new ConflictException();
    //   });
    let result = await this.bookSer.chercherTousLesLivres();
    return result;
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Post('add')
  async addBook(@Req() request: Request, @Body() body) {
    let myAuthor = await this.authSer.chercherAuteurParId(body.author);
    if (!myAuthor)
      // if(myAuthor == null)
      throw new BadRequestException();
    let result = await this.bookSer.ajouterLivre(body, request.user['id']);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/:id')
  async getBookById(@Req() request: Request, @Param('id', ParseIntPipe) id) {
    let result = await this.bookSer.chercherLivreParId(id);
    console.log('result', result);

    if (!result) {
      throw new NotFoundException(`Le livre avec l'ID ${id} n'existe pas.`);
    }
    return result;
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Put('edit/:id')
  async updateBook(@Body() body, @Param('id', ParseIntPipe) bookId) {
    console.log(typeof bookId);

    let result = await this.bookSer.editerLivre(body, bookId);
    return result;
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete('delete/:id')
  async deleteBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.supprimerLivreV1(bookId);
    return {
      message: result.affected + 'Livre(s) supprimé(s) avec succès',
      result: result,
    };
  }
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete('softdelete/:id')
  async softDeleteBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.softsupprimerLivreV1(bookId);
    return {
      message: result.affected + 'Livre(s) soft supprimé(s) avec succès',
      result: result,
    };
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete('remove/:id')
  async removeBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.supprimerLivreV2(bookId);
    return {
      //   message: result.affected + 'Livre(s) supprimé(s) avec succès',
      result: result,
    };
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete('softremove/:id')
  async softRemoveBook(
    @Req() request: Request,
    @Param('id', ParseIntPipe) bookId,
  ) {
    let result = await this.bookSer.softsupprimerLivreV2(bookId, request.user);
    return {
      //   message: result.affected + 'Livre(s) supprimé(s) avec succès',
      result: result,
    };
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete('restore/:id')
  async restoreBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.restoreLivre(bookId);
    return {
      message: 'Livre restauré',
      result: result,
    };
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Patch('recover/:id')
  async recoverBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.recoverLivre(bookId);
    return {
      message: 'Livre recover',
      result: result,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async nbBooksPerYear() {
    let result = await this.bookSer.nbreLivresParAnnee();
    return result;
  }
  @UseGuards(JwtAuthGuard)
  @Get('stats2')
  async nbBooksBetweenTwoYears(@Query() qp) {
    console.log(qp);

    let result = await this.bookSer.nbreLivresEntreDeuxAnnees(
      qp.year1,
      qp.year2,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName =
            file.originalname.replace(/\s/g, '').substring(0, 3) +
            Date.now() +
            '.' +
            file.originalname.split('.')[1];
          console.log(randomName);

          cb(null, randomName);
        },
      }),
    }),
  )
  uploadFile4(
    @Res() response,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 150000,
            message: "Taille de l'image trop grande",
          }),
          new FileTypeValidator({
            fileType: 'image/(jpg|jpeg|png)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);

    return response.json({
      orginalName: file.originalname,
      fileName: file.filename,
    });
  }

  @Get('images/:filename')
  getFile(@Res() response: Response, @Param('filename') filename) {
    response.sendFile(filename, { root: 'uploads' });
  }
}
