import mongoose, { Schema } from "mongoose";
import { IAccount } from "$types/account.interface";
import { RoleEnum } from "$root/enums/RoleEnum";

const AccountSchema = new Schema<IAccount>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.Customer,
      required: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    phone:{
      type: String,
      required: [true, "Phone is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
