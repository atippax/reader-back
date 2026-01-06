import {
  extractDatesFromText,
  findWordUseNextLine,
  parseDateTimeToDateObject,
  parseUsd,
} from "../../util";
import type {
  IInvestmentLog,
  Investment,
  InvestmentType,
  Vat,
} from "./core";
import { getSymbol, getType, sumVat } from "./util";

function getSellShares(words: string[]) {
  return parseFloat(
    words.find((w) => w.includes("Shares"))?.replace("Shares", "")!
  );
}

function getSellExecutedPrice(words: string[]) {
  return parseFloat(
    words
      .find((w) => w.includes("Executed Price"))
      ?.replace("Executed Price", "")
      .replace("USD", "")!
  );
}

function getVatSellCommission(words: string[]) {
  return parseUsd(findWordUseNextLine(words, "Commission Fee")!);
}
function getVat7(words: string[]) {
  return parseUsd(findWordUseNextLine(words, "VAT 7%")!);
}
function getVatSEC(words: string[]) {
  return parseUsd(findWordUseNextLine(words, "SEC Fee")!);
}
function getVatTAF(words: string[]) {
  return parseUsd(findWordUseNextLine(words, "TAF Fee")!);
}
function getStockAmount(words: string[]) {
  return parseUsd(findWordUseNextLine(words, "Stock Amount")!);
}
function getPrice(words: string[]) {
  return parseUsd(findWordUseNextLine(words, "Total Credit")!);
}

export class SellInvestmentLog implements IInvestmentLog {
  constructor(private words: string[]) { }
  toJson(): Investment {
    const [_submissionDate, _completionDate] = extractDatesFromText(this.words);
    const submissionDate = parseDateTimeToDateObject(_submissionDate!);
    const completionDate = parseDateTimeToDateObject(_completionDate!)!;
    const executedPrice = getSellExecutedPrice(this.words);
    const shares = getSellShares(this.words);
    const stockAmount = getStockAmount(this.words);
    const vat: Vat = {
      commissionFee: getVatSellCommission(this.words),
      secFee: getVatSEC(this.words),
      tafFee: getVatTAF(this.words),
      vat7: getVat7(this.words),
    };
    const price = getPrice(this.words);
    const allVatPrice = sumVat(vat);
    const diffPrice = stockAmount - price;
    const diffVat = diffPrice - allVatPrice;
    return {
      kind: 'slip',
      type: getType(this.words) as InvestmentType,
      symbol: getSymbol(this.words)!,
      stockAmount,
      allVatPrice,
      executedPrice,
      completionDate,
      diffVat,
      vat,
      vatExecuted: diffPrice,
      value: price,
      shares,
      submissionDate,
    };
  }
}
