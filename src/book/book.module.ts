import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { AuthorEntity } from './entities/author.entity';
import { FavoriteEntity } from './entities/favorite.entity';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, AuthorEntity, FavoriteEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [BookService, AuthorService, FavoriteService],
  controllers: [BookController, AuthorController, FavoriteController],
})
export class BookModule {}
