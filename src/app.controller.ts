import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('plb')
export class AppController {
  constructor() {}

  @Get('mathieu')
  getHello(): string {
    return 'Formation Nest';
  }

  @Get()
  getHello2(): string {
    return 'Formation Angular';
  }

  @Get('jp')
  getJP(@Req() request: Request, @Res() reponse: Response) {
    console.log(request);
    return reponse.send('<H1>Bienvenue chez PLB</h1>');
  }
}
