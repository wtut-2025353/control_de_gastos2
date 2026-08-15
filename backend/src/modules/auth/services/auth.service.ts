import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../users/models/user.model.js";
import { env } from "../../../config/env.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResult {
  token: string;
  user: AuthUserPayload;
}

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function signToken(user: AuthUserPayload): string {
  return jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

function toPayload(user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
}): AuthUserPayload {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user) {
    throw new AuthError("Credenciales inválidas", 401);
  }
  const valid = await bcrypt.compare(password, user.password ?? "");
  if (!valid) {
    throw new AuthError("Credenciales inválidas", 401);
  }
  const payload = toPayload(user);
  return { token: signToken(payload), user: payload };
}

export async function loginWithGoogle(credential: string): Promise<AuthResult> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new AuthError("El login con Google no está configurado en el servidor", 500);
  }
  let payload: { sub?: string; email?: string; name?: string; picture?: string };
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID
    });
    payload = ticket.getPayload() ?? {};
  } catch {
    throw new AuthError("Token de Google inválido", 401);
  }

  const email = payload.email?.toLowerCase();
  if (!email) {
    throw new AuthError("El token de Google no incluye un correo válido", 401);
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: payload.name ?? "Usuario de Google",
      email,
      googleId: payload.sub,
      avatar: payload.picture,
      role: "user"
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    if (payload.picture) user.avatar = payload.picture;
    await user.save();
  }

  const result = toPayload(user);
  return { token: signToken(result), user: result };
}