import mongoose, { Schema } from "mongoose";
import { IScoreband } from "$types/scoreband.interface";

const ScorebandSchema = new Schema<IScoreband>({
  roadmapId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  minPoint: {
    type: Number,
    required: true,
  },
  maxPoint: {
    type: Number,
    required: true,
  },
  typeOfSkin: {
    type: String,
    required: true,
  },
  skinExplanation: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IScoreband>("Scoreband", ScorebandSchema);
