import type { BasePatternExtractor } from "../../extracter/patterns/base-pattern-extractor";
import type { Dividend } from "./dividend/dividend";
import { getParser } from "./factories";
import type { Fee } from "./fee/fee";
import type { Stock } from "./stock/stock";

export class TransactionExtractor {
  private texts: string[];
  constructor(
    private patternExtractor: BasePatternExtractor,
    private text: string
  ) {
    this.texts = this.patternExtractor
      .extract(this.text)
      .map(this.cleanText)
      .flatMap((x) => x)
      .reduce((state, text) => {
        if (text.startsWith("Shares")) {
          const lastElement = state.pop();
          return [...state, `${lastElement} ${text}`];
        }
        return [...state, text];
      }, [] as string[]);
  }
  public getTexts() {
    return this.texts;
  }
  cleanText(text: string) {
    // console.log(text);
    const regex = /(TAF|Sell|Buy|Dividend)/i;
    const index = text.search(regex);
    if (index === -1) return text;
    const textAfterKeyword = text.slice(index).replace(/\s+/g, " ").trim();
    const frontText = text.slice(0, index);
    if (frontText.includes("Shares")) {
      return [frontText, textAfterKeyword];
    }
    return [textAfterKeyword];
  }

  toJson() {
    const results = { fee: [] as Fee[], dividendLogs: [] as Dividend[], stockLogs: [] as Stock[] };
    for (const text of this.texts) {
      const parser = getParser(text);
      if (parser) {
        const result = parser.toJson()
        if ((result.kind) == 'Stock') {
          results.stockLogs.push(result as Stock)
        }
        else if ((result.kind) == 'Dividend') {
          results.dividendLogs.push(result as Dividend)
        }
        else if ((result.kind) == 'Fee') {
          results.fee.push(result as Fee)
        }
      }
    }
    return results;
  }
}
