import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import userRoutes from "./modules/users/routes/user.routes.js";
import { env } from "./config/env.js";

export function createApp(): express.Express {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ message: "API control_de_gastos funcionando" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
  });

  return app;
}