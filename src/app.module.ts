import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD, // ''
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    BookModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRETCODE,
      signOptions: {
        expiresIn: '3600s',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(FirstMiddleware).forRoutes('task/search*');

    // consumer.apply(FirstMiddleware).forRoutes(
    //   {
    //     path: 'task*',
    //     method: RequestMethod.GET,
    //   },
    //   {
    //     path: 'task*',
    //     method: RequestMethod.POST,
    //   },
    // );
    // consumer.apply(SecondMiddleware).forRoutes('');
    // consumer.apply(FirstMiddleware).forRoutes('');
    //consumer.apply(TokenMiddleware).forRoutes('book*');
    // MorganMiddleware.configure('dev');
    // consumer.apply(MorganMiddleware).forRoutes('');
    HelmetMiddleware.configure({});
    consumer.apply(HelmetMiddleware).forRoutes('task*');
  }
}
