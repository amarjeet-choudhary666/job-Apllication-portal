import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employer" | "developer";
  phone?: string;
  avatar?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide password in queries unless explicitly selected
    },
    role: {
      type: String,
      enum: ["admin", "employer", "developer"],
      default: "developer",
    },
    phone: {
      type: Number,
    },
    avatar: {
      type: String, // profile picture URL
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
