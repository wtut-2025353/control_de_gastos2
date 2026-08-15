import type { Request, Response } from "express";
import { AuthError, loginWithEmail, loginWithGoogle } from "../services/auth.service.js";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ message: "Email y contraseña son obligatorios" });
    return;
  }
  try {
    const result = await loginWithEmail(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function loginGoogle(req: Request, res: Response): Promise<void> {
  const { credential } = req.body as { credential?: string };
  if (!credential) {
    res.status(400).json({ message: "Falta el token de Google" });
    return;
  }
  try {
    const result = await loginWithGoogle(credential);
    res.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}