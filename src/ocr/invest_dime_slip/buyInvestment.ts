import { extractDatesFromText, findSame, findWord, findWordUseNextLine, parseDateTimeToDateObject, parseUsd } from "../util.js"
import type { IInvestmentLog, Investment, InvestmentType, Vat } from "./core.js"
import { getSymbol, getType, sumVat } from "./util.js"

function getBuyPrice(words: string[]): number {
    return parseUsd(findWord(words, 'USD')!)
}
function getBuyShares(words: string[]) {
    const indexFoundShares = words.findIndex(x => x.includes('Shares'))
    const word = words[indexFoundShares + 3]
    const isCanParse = isNaN(parseFloat(word!))
    return parseFloat(words[indexFoundShares + (isCanParse ? 2 : 3)]!)
}
function getBuyExecutedPrice(words: string[]) {
    const prices = findSame(words, 'USD')
    return parseUsd(prices[1]!)
}
function getVatSellCommission(words: string[]) {
    return parseUsd(findWordUseNextLine(words, 'Commission Fee')!)
}
function getVat7(words: string[]) {
    return parseUsd(findWordUseNextLine(words, 'VAT 7%')!)
}
function getVatSEC(words: string[]) {
    return parseUsd(findWordUseNextLine(words, 'SEC Fee')!)
}
function getVatTAF(words: string[]) {
    return parseUsd(findWordUseNextLine(words, 'TAF Fee')!)
}
function getStockAmount(words: string[]) {
    return parseUsd(findWordUseNextLine(words, 'Stock Amount')!)

}
export class BuyInvestmentLog implements IInvestmentLog {
    constructor(private words: string[]) {
        console.log(words)
    }
    toJson(): Investment {
        const [_submissionDate, _completionDate] = extractDatesFromText(this.words)
        const submissionDate = parseDateTimeToDateObject(_submissionDate!)
        const completionDate = parseDateTimeToDateObject(_completionDate!)!
        const executedPrice = getBuyExecutedPrice(this.words)
        const shares = getBuyShares(this.words)
        const price = getBuyPrice(this.words)
        const vat: Vat = {
            commissionFee: getVatSellCommission(this.words),
            secFee: getVatSEC(this.words),
            tafFee: getVatTAF(this.words),
            vat7: getVat7(this.words)
        }
        const stockAmount = getStockAmount(this.words)
        const allVatPrice = sumVat(vat)
        const diffPrice = price - stockAmount
        const diffVat = allVatPrice - diffPrice
        return {
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
        }
    }
}

