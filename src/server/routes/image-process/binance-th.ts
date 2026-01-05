import express from "express";
import type { OCRHandler } from ".";
import { BinanceThTransactionPatternExtractor } from "../../../services/extracter/patterns/binance-th-transaction-pattern-extractor";
import { BinanceThSlip } from "../../../services/binance-th/slip/slip";
import { BinanceThTransaction } from "../../../services/binance-th/transaction/transaction";
const app = express();
const binanceThHandler: OCRHandler = (req, res) => {
    try {

        const extractorResults = [];
        for (const text of req.body.texts) {
            const dateExtractor = new BinanceThTransactionPatternExtractor();
            if (text.toLowerCase().includes('details')) {
                extractorResults.push(new BinanceThSlip(text).toJson())
                continue;
            }
            const extractor = new BinanceThTransaction(dateExtractor, text);
            extractorResults.push(...extractor.toJson());
        }
        const data = extractorResults.sort((x: any, y: any) => y.date - x.date)
        console.log('result : ', data)
        res.json(data);
    }
    catch (ex) {
        console.log(ex)
        res.send(ex)
    }
};
app.post("/binance-th", binanceThHandler);
export { app as binanceThRouter };
