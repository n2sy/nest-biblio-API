import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DurationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log("Je suis l'intercepteur");
    // let request = context.switchToHttp().getRequest();
    // console.log(request);
    const dateIn = Date.now();

    return next.handle().pipe(
      tap(() => {
        //console.log(context.getHandler().name);
        if (context.getHandler().name == 'getAllBooks') {
          const dateOut = Date.now();
          const diff = dateOut - dateIn;
          console.log('Le temps de traitement est de ' + diff + ' ms');
        } else console.log('Temps non calculée');
      }),
    );
  }
}
