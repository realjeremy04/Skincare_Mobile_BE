import mongoose, { Schema } from "mongoose";
import { IAppointment } from "$types/appointment.interface";
import { AppointmentStatusEnum } from "$root/enums/AppointmentStatusEnum";

const AppointmentSchema = new Schema<IAppointment>(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    slotsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slots",
      required: true,
    },
    checkInImage: {
      type: String,
      default: null,
    },
    checkOutImage: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatusEnum),
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);
