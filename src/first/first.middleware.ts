import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class FirstMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    //console.log(req);
    //res['prenom'] = 'nidhal';

    console.log('Je suis le First Middleware');

    next();
  }
}
