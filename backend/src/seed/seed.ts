import bcrypt from "bcryptjs";
import { User } from "../modules/users/models/user.model.js";

const DEFAULT_USERS: Array<{
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}> = [
  {
    name: "Administrador",
    email: "admin@controlgastos.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Usuario Normal",
    email: "user@controlgastos.com",
    password: "user123",
    role: "user"
  }
];

export async function seedDefaultUsers(): Promise<void> {
  for (const data of DEFAULT_USERS) {
    const exists = await User.findOne({ email: data.email });
    if (exists) continue;
    const hashed = await bcrypt.hash(data.password, 10);
    await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role
    });
    console.log(`[seed] Usuario por defecto creado: ${data.email} (${data.role})`);
  }
}