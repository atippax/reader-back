import type { Log } from "../share-type.js"
// import { cleanText, filterEmptyWord } from "../util.js"
import { IncomeDividendLog } from "./incomeDividend.js"
import { TaxDividendLog } from "./taxDividend.js"

export type DividentType = "Tax" | "Income"
export interface Dividend extends Log {
    symbol: string
    amount: number
    type: "Tax" | "Income"
}
const dateRegex = /(?<=\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\s-\s\d{2}:\d{2}:\d{2}\s[AP]M)/g;
function isHaveDateString(text: string) {
    const results = text.match(dateRegex);
    if (results == null) return false
    return (results.length > 0)

}
function removeNotTransactionText(text: string[]) {
    if (text.length == 0) return ''
    const [frist, ...rest] = text
    if (words.some(s => frist?.includes(s))) return text.join('\n')
    return removeNotTransactionText(rest)
}
function isCurrentcy(text: string) {
    const regex = /\d+\.\d{2}\s+(?:THB|USD)/g;
    const results = text.match(regex);
    if (results == null) return false
    return (results.length > 0)
}
function getBeginTransaction(text: string) {
    const texts = text.split('\n')
    return removeNotTransactionText(texts)
}
function splitByDate(text: string) {
    const textSplited = text.split(dateRegex)
    return textSplited.map(item => item.trim()).filter(item => item !== "" && isHaveDateString(item))
}
function cleanText(text: string) {
    return text.split('\n').map(x => x.replaceAll('\r', '')).filter(x => x.trim() != '')
}
function filter(text: string[][]) {
    return text.map(x => filterOnlyDivident(x)).filter(x => x.length > 0)
}
const words = ['Deposit', 'Dividend', 'Deduct']
function filterOnlyDivident(text: string[]) {
    return text.filter(x => words.some(s => x.trim().startsWith(s)))
}
export function createADividendLog(word: string): IDividend[] {
    // const words = filterEmptyWord(cleanText(word).split('\n'))
    const result: IDividend[] = []
    const s = filter(splitByDate(getBeginTransaction(word)).map(cleanText))
    for (const element of s) {
        const type = element[0]!.includes('Withholding Tax') ? 'Tax' : 'Income'
        switch (type) {
            case "Income": { result.push(new IncomeDividendLog(element)); break; }
            case "Tax": { result.push(new TaxDividendLog(element)); break; }
            default: throw Error('no type')
        }
    }
    return result
}
export interface IDividend {
    toJson(): Dividend
} 