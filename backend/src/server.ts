import { createApp } from "./apps.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { seedDefaultUsers, seedFinancialData } from "./seed/seed.js";

async function main(): Promise<void> {
  await connectDB();
  await seedDefaultUsers();
  await seedFinancialData();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[server] API escuchando en http://localhost:${env.PORT}`);
  });
}

main().catch((error) => {
  console.error("[server] Error al iniciar:", error);
  process.exit(1);
});
