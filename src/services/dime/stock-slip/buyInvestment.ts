import type { BasePatternExtractor } from "../../extracter/patterns/base-pattern-extractor";
import {
  extractDatesFromText,
  findSame,
  findWord,
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

function getBuyPrice(words: string[]): number {
  return parseUsd(findWord(words, "USD")!);
}
function getBuyShares(words: string[]) {
  const indexFoundShares = words.findIndex((x) => x.includes("Shares"));
  const word = words[indexFoundShares + 3];
  const isCanParse = isNaN(parseFloat(word!));
  return parseFloat(words[indexFoundShares + (isCanParse ? 2 : 3)]!);
}
function getBuyExecutedPrice(words: string[]) {
  const index = words.findIndex(x => x == 'Executed')
  if (!index) throw new Error('not found Execute Price')
  return parseFloat(words[index + 2]!)
  // const prices = findSame(words, "USD");
  // return parseUsd(prices[1]!);
}
function getVatSellCommission(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'Commission') + 2]!)
  return parseUsd(findWordUseNextLine(words, "Commission Fee")!);
}
function getVat7(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'VAT') + 2]!)
  return parseUsd(findWordUseNextLine(words, "VAT 7%")!);
}
function getVatSEC(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'SEC') + 2]!)
  return parseUsd(findWordUseNextLine(words, "SEC Fee")!);
}
function getVatTAF(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'TAF') + 2]!)
  return parseUsd(findWordUseNextLine(words, "TAF Fee")!);
}
function getStockAmount(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'Amount') + 1]!)
  return parseUsd(findWordUseNextLine(words, "Stock Amount")!);
}
export class BuyInvestmentLog implements IInvestmentLog {
  constructor(private words: string, private extractor: BasePatternExtractor) {
    console.log(words);
  }
  toJson(): Investment {
    const texts = this.extractor.extract(this.words)
    const [frontText, _completionDate] = extractDatesFromText(texts);
    const [word, _submissionDate] = frontText?.split('Submission Date')!
    const submissionDate = parseDateTimeToDateObject(_submissionDate!);
    const completionDate = parseDateTimeToDateObject(_completionDate?.split('Completion date')[1]!)!;
    const words = word?.split(' ')!
    const executedPrice = getBuyExecutedPrice(words);
    const shares = getBuyShares(words);
    const price = getBuyPrice(words);
    const vat: Vat = {
      commissionFee: getVatSellCommission(words),
      secFee: getVatSEC(words),
      tafFee: getVatTAF(words),
      vat7: getVat7(words),
    };
    const stockAmount = getStockAmount(words);
    const allVatPrice = sumVat(vat);
    const diffPrice = price - stockAmount;
    const diffVat = allVatPrice - diffPrice;
    return {
      kind: 'slip',
      type: getType(this.words) as InvestmentType,
      symbol: getSymbol(this.words)!,
      stockAmount: stockAmount,
      allVatPrice,
      executedPrice,
      completionDate,
      vat,
      vatExecuted: diffPrice,
      diffVat,
      value: price,
      shares,
      submissionDate,
    };
  }
}
