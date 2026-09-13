export class Task {
  public id: string;
  public title: string;
  public year: number;
  public statut: string;
  public createdAt: Date;

  constructor(id: string, title: string, year: number, statut: string) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.statut = statut;
    this.createdAt = new Date();
  }
}
