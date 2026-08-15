import { User } from "../models/user.model.js";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

function toPublic(user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}): PublicUser {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role, avatar: user.avatar };
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  const user = await User.findById(id);
  return user ? toPublic(user) : null;
}

export async function listUsers(): Promise<PublicUser[]> {
  const users = await User.find().lean();
  return users.map(toPublic);
}