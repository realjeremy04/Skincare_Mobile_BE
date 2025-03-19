import mongoose, { Schema } from "mongoose";
import { IBlog } from "$types/blog.interface";

const blogSchema = new Schema<IBlog>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageId: [
      {
        image: {
          type: String,
          required: true,
        },
        imageDescription: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", blogSchema);
