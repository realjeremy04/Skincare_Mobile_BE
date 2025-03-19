import mongoose, { Schema } from "mongoose";
import { IQuestion } from "$types/question.interface";

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: true,
  },
  answers: [
    {
      title: {
        type: String,
        required: true,
      },
      point: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default mongoose.model<IQuestion>("Question", questionSchema);
