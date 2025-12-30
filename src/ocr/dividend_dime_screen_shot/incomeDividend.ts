import type { Dividend, IDividend } from "./core.js";
export class IncomeDividendLog implements IDividend {
    constructor(private words: string[]) { }
    toJson(): Dividend {
        const s = this.words[0]?.replace('Dividend', '').split(' ').filter(x => x != '')!
        const symbol = s[0]!
        const value = s[1]!
        const date = (this.words[1]?.toUpperCase()?.replace('Deposit to Dime! UsD'.toUpperCase(), ''))
        return {
            type: 'Income',
            symbol: symbol,
            amount: Math.abs(+value),
            completionDate: new Date(date!.replace("- ", "")!)
        }
    }
}
