import { extractDateFromText } from "../../../util";
import type { Dividend } from "../dividend/dividend";
import type { Parser } from "../parser";
import type { Fee } from "./fee";
export class TAFLog implements Parser<Fee> {
  constructor(private text: string) { }
  save(): void { }
  toJson(): Fee {
    const texts = this.text.split(" ");
    const amount = parseFloat(texts[2]!);
    const date = extractDateFromText(this.text);
    return {
      kind: 'Fee',
      type: 'TAF',
      remark: "TAF Fee deducted from Dime account",
      completionDate: date,
      amount: amount,
    };
  }
}
