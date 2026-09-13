import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private jwtSer: JwtService) {}
  use(req: any, res: any, next: () => void) {
    let headers = req.get('Authorization');
    if (!headers) throw new UnauthorizedException('Veuillez vous authentifier');

    let t = headers.split(' ');
    try {
      let decodedToken = this.jwtSer.verify(t[1]);
      next();
    } catch (err) {
      console.log(err);

      throw new UnauthorizedException('Token non valide');
    }
  }
}
