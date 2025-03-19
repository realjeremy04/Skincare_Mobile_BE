import { Types } from "mongoose";

export interface IShifts {
  therapistId: Types.ObjectId;
  slotsId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  date: Date;
  isAvailable: boolean;
}
