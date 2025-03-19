import { PaymentMethodEnum } from "$root/enums/PaymentMethodEnum";
import { Types } from "mongoose";

export interface ITransaction {
  customerId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  paymentMethod: PaymentMethodEnum;
  status: string;
}
