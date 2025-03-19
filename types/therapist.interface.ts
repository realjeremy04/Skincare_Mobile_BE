import { Types } from "mongoose";

export interface ITherapist {
  accountId: Types.ObjectId;
  specialization: Array<Types.ObjectId>;
  certification: ICertification[];
  experience: string;
}

interface ICertification {
  name: string;
  issuedBy: string;
  issuedDate: Date;
}
