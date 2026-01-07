import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import binanceThRoute from "./routes/binance-th";
import { TaskManager } from "../services/task/task";
import dimeRoute from "./routes/dime";
import taskRoute from "./routes/task";
const app: Express = express();
const port: number = 8080;
app.use(cors());

app.use((req, res, next) => {
  const requestTime = new Date(Date.now()).toISOString();
  console.log(`[${requestTime}] ${req.method} ${req.url}`);
  next();
});
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});
const tasks = new TaskManager(20)
app.use(binanceThRoute(tasks));
app.use(dimeRoute(tasks));
app.use(taskRoute(tasks));
app.use(express.json());
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.message)
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: statusCode,
    message: err.message || 'Internal Server Error',
  });
});
try {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
catch (ex) {
  console.error(ex)
}
