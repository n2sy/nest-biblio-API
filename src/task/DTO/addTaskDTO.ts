import {
  IsIn,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class addTaskDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Le nbre minimal de caractères pour le title est 6',
  })
  public title: string;

  @IsNotEmpty()
  @Min(2020)
  @Max(2040)
  public year: number;

  @IsIn(['todo', 'in progress', 'aborted'])
  public statut: string;
}
