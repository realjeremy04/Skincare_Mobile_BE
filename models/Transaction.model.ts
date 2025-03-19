import mongoose, { Schema } from "mongoose";
import { ITransaction } from "$types/transaction.interface";
import { PaymentMethodEnum } from "$root/enums/PaymentMethodEnum";
const validStatuses = ["pending", "completed", "failed"];

const transactionSchema = new Schema<ITransaction>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(PaymentMethodEnum),
    },
    status: {
      type: String,
      required: true,
      enum: validStatuses, // Chỉ nhận 3 giá trị hợp lệ
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
