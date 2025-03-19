export interface IQuestion {
  title: string;
  answers: IAnswer[];
}

export interface IAnswer {
  title: string;
  point: Number;
}
