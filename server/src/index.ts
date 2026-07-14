import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.SERVER_PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
