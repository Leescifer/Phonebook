import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helment from "helmet";
import cookieParser from "cookie-parser";
import { type Request, type Response } from "express";

//Routes
import authRoutes from "./src/routes/auth.route.ts";
import userRoutes from "./src/routes/user.route.ts";
import contactRoutes from "./src/routes/contact.route.ts";

dotenv.config();

const app = express();
app.use(helment());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/contacts", contactRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const allowedOrigins = process.env.CLIENT_URL?.trim().replace(/\/$/, "");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "X-Project-ID",
    ],
  }),
);

console.log(
  `CORS configuration initialized. ${allowedOrigins ? `Allowed origin: ${allowedOrigins}` : "No allowed origins specified."}`,
);

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
