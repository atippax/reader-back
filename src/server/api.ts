import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import binanceThRoute from "./routes/binance-th";
import { TaskManager } from "../services/task/task";
const app: Express = express();
const port: number = 8080;
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const requestTime = new Date(Date.now()).toISOString();
  console.log(`[${requestTime}] ${req.method} ${req.url}`);
  next();
});
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});
const tasks = new TaskManager()
app.use(binanceThRoute(tasks));
app.use(binanceThRoute(tasks));
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
