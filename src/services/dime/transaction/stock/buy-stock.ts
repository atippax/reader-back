import { extractDateFromText } from "../../../util";
import type { Stock } from "./stock";
import type { Parser } from "../parser";
export class BuyStockTransaction implements Parser<Stock> {
  constructor(private text: string) { }
  save(): void { }
  toJson(): Stock {
    const texts = this.text.split(" ");
    const symbol = texts[1]!;
    const price = parseFloat(texts[2]!);
    const executedPriceText = parseFloat(texts[6]!);
    const date = extractDateFromText(this.text);
    const shares = parseFloat(
      texts[texts.findIndex((x) => x == "Shares") + 1]!
    );
    return {
      type: "Buy",
      kind: 'Stock',
      remark: "",
      symbol,
      completionDate: date,
      amount: executedPriceText,
      price,
      shares,
    };
  }
}
