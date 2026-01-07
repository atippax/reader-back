import { extractDateFromText } from "../../../util";
import type { Parser } from "../parser";
import type { Dividend } from "./dividend";

export class TaxDividendLog implements Parser<Dividend> {
  constructor(private words: string) { }
  save(): void { }
  toJson(): Dividend {
    const s = this.words?.replace("Dividend Withholding Tax ", "").split(" ")!;
    const symbol = s[0]!;
    const value = s[1]!;
    const date = extractDateFromText(this.words);

    return {
      type: "Tax",
      kind: 'Dividend',
      symbol: symbol,
      amount: Math.abs(+value),
      completionDate: date,
      remark: 'tax dividend'
    };
  }
}
