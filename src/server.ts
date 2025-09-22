import { createServer } from "http";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 8080;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`meta-scan-api running on :${PORT}`);
});

const shutdown = (signal: string) => () => {
  console.log(`${signal} received. Shutting down...`);
  server.close(() => process.exit(0));
};
["SIGINT", "SIGTERM"].forEach((sig) =>
  process.on(sig as NodeJS.Signals, shutdown(sig))
);
