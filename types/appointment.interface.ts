import { AppointmentStatusEnum } from "$root/enums/AppointmentStatusEnum";
import { Types } from "mongoose";

export interface IAppointment {
  therapistId: Types.ObjectId;
  customerId: Types.ObjectId;
  slotsId: Types.ObjectId;
  serviceId: Types.ObjectId;
  checkInImage: string;
  checkOutImage: string;
  notes: string;
  amount: number;
  status: AppointmentStatusEnum;
}
