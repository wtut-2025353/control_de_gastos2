import "dotenv/config";

function required(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Falta la variable de entorno ${key}`);
  }
  return value ?? fallback!;
}

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  MONGODB_URI: required("MONGODB_URI", "mongodb://localhost:27017/control_de_gastos"),
  JWT_SECRET: required("JWT_SECRET", "cambio_esta_secret_en_produccion"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "5s",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:4200"
};