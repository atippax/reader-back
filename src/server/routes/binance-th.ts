import express from "express";
import { BinanceThTransactionPatternExtractor } from "../../services/extracter/patterns/binance-th-transaction-pattern-extractor";
import { BinanceThSlip } from "../../services/binance-th/slip/slip";
import { BinanceThTransaction } from "../../services/binance-th/transaction/transaction";
import imageProcessRoute from "./image-process";
import { TaskManager } from "../../services/task/task";
const binanceThHandler = (text: string) => {
    try {
        const dateExtractor = new BinanceThTransactionPatternExtractor();
        if (text.toLowerCase().includes('details')) {
            return [new BinanceThSlip(text).toJson()]
        }
        const extractor = new BinanceThTransaction(dateExtractor, text);
        return extractor.toJson()
    }
    catch (ex) {
        throw ex
    }
};
export default function binanceThRoute(taskManager: TaskManager) {
    const app = express();
    const subApp = express()
    subApp.get('/', (req, res) => {
        res.send('it a binance controller')
    })
    subApp.get('/task/:taskId', (req, res) => {
        const { taskId } = req.params
        const task = taskManager.getTaskId(taskId)
        return res.json(task)
    })
    app.use("/binance-th", imageProcessRoute(taskManager, binanceThHandler));
    app.use('/binance-th', subApp)
    return app
}
