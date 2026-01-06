
import express from "express";
import imageProcessRoute from "./image-process";
import { TaskManager } from "../../services/task/task";
import { createAInvestmentLog } from "../../services/dime/stock-slip/core";
import { DatePatternExtractor } from "../../services/extracter/patterns/date-pattern-extractor";
import { TransactionExtractor } from "../../services/dime/transaction/transaction-extractor";
const dimeHandler = (text: string) => {
  try {
    if (text.includes('Stock Amount')) {
      return [createAInvestmentLog(text).toJson()]
    }
    const dateExtractor = new DatePatternExtractor();
    const extractor = new TransactionExtractor(dateExtractor, text);
    return extractor.toJson()
  }
  catch (ex) {
    throw ex
  }
};
export default function dimeRoute(taskManager: TaskManager) {
  const app = express();
  const subApp = express()
  subApp.get('/', (req, res) => {
    res.send('it a dime controller')
  })
  subApp.get('/task/:taskId', (req, res) => {
    const { taskId } = req.params
    const task = taskManager.getTaskId(taskId)
    if (!task) return res.status(404).send('not found')
    return res.json(task.getData())
  })
  app.use("/dime", imageProcessRoute(taskManager, dimeHandler));
  app.use('/dime', subApp)
  return app
}
