import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    googleId: { type: String, required: false, unique: true, sparse: true },
    avatar: { type: String, required: false }
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;

export const User = model("User", userSchema);