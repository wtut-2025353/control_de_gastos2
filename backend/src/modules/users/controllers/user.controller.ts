import type { Request, Response } from "express";
import { findUserById, listUsers } from "../services/user.service.js";

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const user = await findUserById(req.user.id);
  if (!user) {
    res.status(404).json({ message: "Usuario no encontrado" });
    return;
  }
  res.json(user);
}

export async function getAllUsers(_req: Request, res: Response): Promise<void> {
  const users = await listUsers();
  res.json(users);
}