import type { BasePatternExtractor } from "../../extracter/patterns/base-pattern-extractor";
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
    words[words.findIndex(x => x == 'Shares') - 1]!
  );
}

function getSellExecutedPrice(words: string[]) {
  const index = words.findIndex(x => x == 'Executed')
  if (!index) throw new Error('not found Execute Price')
  return parseFloat(words[index + 2]!)
}

function getVatSellCommission(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'Commission') + 2]!)
}
function getVat7(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'VAT') + 2]!)
}
function getVatSEC(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'SEC') + 2]!)
}
function getVatTAF(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'TAF') + 2]!)
}
function getStockAmount(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'Amount') + 1]!)
}
function getPrice(words: string[]) {
  return parseFloat(words[words.findIndex(x => x == 'Credit') + 1]!)
}

export class SellInvestmentLog implements IInvestmentLog {
  constructor(private words: string, private extractor: BasePatternExtractor) { }
  toJson(): Investment {
    const texts = this.extractor.extract(this.words)
    const [frontText, _completionDate] = extractDatesFromText(texts);
    const [word, _submissionDate] = frontText?.split('Submission Date')!
    const submissionDate = parseDateTimeToDateObject(_submissionDate!);
    const completionDate = parseDateTimeToDateObject(_completionDate?.split('Completion date')[1]!)!;
    const words = word?.split(' ')!
    const executedPrice = getSellExecutedPrice(words);
    const shares = getSellShares(words);
    const stockAmount = getStockAmount(words);
    const vat: Vat = {
      commissionFee: getVatSellCommission(words),
      secFee: getVatSEC(words),
      tafFee: getVatTAF(words),
      vat7: getVat7(words),
    };
    const price = getPrice(words);
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
