import mongoose, { Schema } from "mongoose";
import { IShifts } from "$types/shifts.interface";
import exp = require("constants");

const shiftsSchema = new Schema<IShifts>({
  slotsId: {
    type: Schema.Types.ObjectId,
    ref: "Slots",
    required: true,
  },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  therapistId: {
    type: Schema.Types.ObjectId,
    ref: "Therapist",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const Shifts = mongoose.model<IShifts>("Shifts", shiftsSchema);

export default Shifts;
