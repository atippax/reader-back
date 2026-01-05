import express from "express";
import type { OCRHandler } from ".";
import { TransactionExtractor } from "../../../services/dime/transaction/transaction-extractor";
import { DatePatternExtractor } from "../../../services/extracter/patterns/date-pattern-extractor";
import { createAInvestmentLog } from "../../../services/dime/stock-slip/core";
const app = express();
const dimeHandler: OCRHandler = (req, res) => {
  const extractorResults = [];
  for (const text of req.body.texts) {
    const dateExtractor = new DatePatternExtractor();
    if (text.includes('Stock Amount')) {
      extractorResults.push(createAInvestmentLog(text).toJson())
      continue;
    }
    const extractor = new TransactionExtractor(dateExtractor, text);
    extractorResults.push(
      ...extractor.toJson(),
    );
  }
  res.json(extractorResults);
};

app.post("/dime", dimeHandler);
export { app as dimeRouter };
