import { Types } from "mongoose";

export interface IUserQuiz {
  accountId: Types.ObjectId;
  scoreBandId: Types.ObjectId;
  result: IResult[];
  totalPoint: Number;
}

interface IResult {
  title: string;
  answer: string;
  point: number;
}
