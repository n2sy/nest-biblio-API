import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UpperandfusionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    //console.log(value, metadata);
    if (metadata.type == 'body') {
      let tab2 = value.map((element) => element.toUpperCase()).join('--');
      return tab2;
    }
    return value;
  }
}
