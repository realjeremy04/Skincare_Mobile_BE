import { IRoadmap } from "$root/types/roadmap.interface";
import mongoose, { Schema } from "mongoose";

const roadmapSchema = new Schema<IRoadmap>({
  serviceId: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  estimate: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IRoadmap>("Roadmap", roadmapSchema);
