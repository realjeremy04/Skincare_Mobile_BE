import mongoose, { Schema } from "mongoose";
import { ISlots } from "$types/slots.interface";

const SlotSchema = new Schema<ISlots>({
  slotNum: {
    type: Number,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ISlots>("Slots", SlotSchema);
