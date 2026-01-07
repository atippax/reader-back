import { BasePatternExtractor } from "../../extracter/patterns/base-pattern-extractor";
import { DatePatternExtractor } from "../../extracter/patterns/date-pattern-extractor";
import { cleanText, filterEmptyWord } from "../../util";
import type { Transaction } from "../transaction/transaction";
import { BuyInvestmentLog } from "./buyInvestment";
import { SellInvestmentLog } from "./sellInvestment";
import { getType } from "./util";

export type InvestmentType = "Sell" | "Buy";
export interface Vat {
  commissionFee: number;
  vat7: number | null;
  secFee: number | null;
  tafFee: number | null;
}
export interface Investment extends Transaction {
  symbol: string;
  type: InvestmentType;
  shares: number;
  vat: Vat;
  allVatPrice: number;
  vatExecuted: number;
  diffVat: number;
  submissionDate: Date | null;
  executedPrice: number;
  stockAmount: number;
  value: number;
}
export function createAInvestmentLog(word: string): IInvestmentLog {
  const words = cleanText(word);
  const type = getType(words) as InvestmentType;
  switch (type) {
    case "Sell":
      return new SellInvestmentLog(words, new BasePatternExtractor(/(?<=\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\s-\s\d{2}:\d{2})/g));
    case "Buy":
      return new BuyInvestmentLog(words, new BasePatternExtractor(/(?<=\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\s-\s\d{2}:\d{2})/g));
    default:
      throw Error("no type");
  }
}
export interface IInvestmentLog {
  toJson(): Investment;
}
