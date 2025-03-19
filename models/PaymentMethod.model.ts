import mongoose, { Schema } from "mongoose";
import { IPaymentMethod } from "$types/paymentmethod.interface";

const paymentMethodSchema = new Schema<IPaymentMethod>({
  method: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model<IPaymentMethod>("PaymentMethod", paymentMethodSchema);
