import { extractDateFromText } from "../../../util";
import type { Stock } from "./stock";
import type { Parser } from "../parser";
export class SellStockTransaction implements Parser<Stock> {
  constructor(private text: string) { }
  save(): void { }
  toJson(): Stock {
    const texts = this.text.split(" ");
    const symbol = texts[1]!;
    const shares = parseFloat(texts[2]!);
    const date = extractDateFromText(this.text);
    const price = parseFloat(texts[texts.findIndex((x) => x == "Price") + 1]!);
    return {
      type: "Sell",
      kind: 'Stock',
      symbol,
      remark: "amount value is estimated value calculated by price * shares",
      completionDate: date,
      amount: price * shares,
      price,
      shares,
    };
  }
}
