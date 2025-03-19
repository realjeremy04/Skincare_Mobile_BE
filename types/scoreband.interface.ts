import { Types } from "mongoose";

export interface IScoreband {
  roadmapId: Types.ObjectId;
  minPoint: Number;
  maxPoint: Number;
  typeOfSkin: string;
  skinExplanation: string;
}
