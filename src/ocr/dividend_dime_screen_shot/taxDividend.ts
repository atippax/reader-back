import type { Dividend, IDividend } from "./core.js"


export class TaxDividendLog implements IDividend {
    constructor(private words: string[]) { }
    toJson(): Dividend {
        const s = this.words[0]?.replace('Dividend Withholding Tax ', '').split(' ')!
        const symbol = s[0]!
        const value = s[1]!
        const date = (this.words[1]?.replace('Deduct from Dime! USD', ''))
        return {
            type: 'Tax',
            symbol: symbol,
            amount: Math.abs(+value),
            completionDate: new Date(date!.replace("- ", "")!)
        }
    }
}
