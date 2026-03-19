import { Hono } from "hono";
import { auth } from "./lib/auth";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Better Auth routes, see docs before changing
 * @link https://better-auth.com/docs
 */
app.use(
  "/api/auth/*",
  cors({
    origin: [
      "https://feisty-education-production.up.railway.app",
      "https://socrates.scuffi.dev",
    ],
    credentials: true,
  })
);
// IMPORTANT: allow preflight
app.options("/api/auth/*", (c) => c.text("", 200));

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export default app;
