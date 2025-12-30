import tesseract from "node-tesseract-ocr"
import type { Log } from "../share-type.js"
const config = {
    lang: "eng",
    oem: 1,
    psm: 11,
}
export async function getExchangeRate(image: Buffer) {
    return await tesseract.recognize(image, config)
        .then(text => {
            return splitByDate(getBeginTransaction(text)).map(cleanText).map(map)
        })
        .catch(error => {
            throw error
        })
}
function removeNotTransactionText(text: string[]) {
    if (text.length == 0) return ''
    const [frist, ...rest] = text
    if (isCurrentcy(frist!)) return text.join('\n')
    return removeNotTransactionText(rest)
}
function getBeginTransaction(text: string) {
    const texts = text.split('\n')
    return removeNotTransactionText(texts)
}
function isCurrentcy(text: string) {
    const regex = /\d+\.\d{2}\s+(?:THB|USD)/g;
    const results = text.match(regex);
    if (results == null) return false
    return (results.length > 0)
}
const dateRegex = /(?<=\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\s-\s\d{2}:\d{2}:\d{2}\s[AP]M)/g;
function isHaveDateString(text: string) {
    const results = text.match(dateRegex);
    if (results == null) return false
    return (results.length > 0)

}
function splitByDate(text: string) {
    const textSplited = text.split(dateRegex)
    return textSplited.map(item => item.trim()).filter(item => item !== "" && isHaveDateString(item))
}
function cleanText(text: string) {
    return text.split('\n').map(x => x.replaceAll('\r', '')).filter(x => x.trim() != '')
}

interface LogTransaction {
    name: string
    value: number
    currentcy: string
}
interface LogStructure extends Log {
    from: LogTransaction
    to: LogTransaction
    completionDate: Date
    rate: { rate: string, value: number }
}

function wordToLog(text: string) {
    const match = text.match(/(\d+\.\d+)\s+([A-Z]+)/);
    if (!match) {
        throw new Error('not format')
    }
    const amount = match[1];
    const currency = match[2];
    return { amount, currency }
}
function findTrim(text: string[], predicate: (x: string) => boolean) {
    const value = text.find(predicate)
    if (!value) return { text, value: null }
    return { text: text.filter(x => x != value), value }
}
function t(text: string[]) {
    if (text.length == 0) return []
    const [f, ...rest] = text
    if (isCurrentcy(f!)) return text
    return t(rest)
}
function map(text: string[]) {
    const startProcessWithCurrentcy = t(text)
    const fromType = findTrim(startProcessWithCurrentcy, (x) => !isCurrentcy(x))
    const fromValue = findTrim(fromType.text, isCurrentcy)
    const toValue = findTrim(fromValue.text, isCurrentcy)
    const toType = findTrim(toValue.text, (x) => !isCurrentcy(x))
    const [rate, date] = toType.text
    const from = wordToLog(fromValue.value!)
    const to = wordToLog(toValue.value!)
    return {
        completionDate: new Date(date!.replace("- ", "")!),
        rate: { rate, value: +wordToLog(rate?.split('=')[1]!).amount! },
        from: {
            currentcy: from.currency,
            name: fromType.value,
            value: +from.amount!
        },
        to: {
            currentcy: to.currency,
            name: toType.value,
            value: +to.amount!
        }
    } as LogStructure
}
