import mongoose, { Schema } from "mongoose";
import { IUserQuiz } from "$types/userquiz.interface";

const userQuizSchema = new Schema<IUserQuiz>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    scoreBandId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    result: [
      {
        title: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        point: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPoint: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserQuiz>("UserQuiz", userQuizSchema);
