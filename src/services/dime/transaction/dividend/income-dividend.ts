import { extractDateFromText } from "../../../util";
import type { Parser } from "../parser";
import type { Dividend } from "./dividend";

export class IncomeDividendLog implements Parser<Dividend> {
  constructor(private words: string) { }
  save(): void { }
  toJson(): Dividend {
    const s = this.words
      ?.replace("Dividend", "")
      .split(" ")
      .filter((x) => x != "")!;
    const symbol = s[0]!;
    const value = s[1]!;
    const date = extractDateFromText(this.words);
    return {
      kind: 'Dividend',
      type: "Income Dividend",
      symbol: symbol,
      amount: Math.abs(+value),
      completionDate: date,
    };
  }
}
