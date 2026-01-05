import type { BasePatternExtractor } from "../../extracter/patterns/base-pattern-extractor";

export class BinanceThTransaction {
    constructor(private extractor: BasePatternExtractor, private text: string) { }
    tojson() {
        const texts = this.extractor.extract(this.text)
        return texts.map(text => {
            const texts = text.split(' ')
            return {
                buy: `${texts[0]}`,
                currentcyBuy: `${texts[1]}`,
                receive: `${texts[2]}`,
                curruntcyReceive: `${texts[3]}`,
                date: new Date(`${texts[4]}T${texts[5]}`)
            }
        })
    }
}