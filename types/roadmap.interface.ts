import { Types } from "mongoose";

export interface IRoadmap {
  serviceId: Types.ObjectId[];
  estimate: string;
}
