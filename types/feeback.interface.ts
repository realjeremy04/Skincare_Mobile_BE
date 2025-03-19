import { Types } from "mongoose";

export interface IFeedback {
  accountId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  serviceId: Types.ObjectId;
  therapistId: Types.ObjectId;
  images: string;
  comment: string;
  rating: Number;
}
