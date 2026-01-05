export class BinanceThSlip {
    constructor(private text: string) { }
    toJson() {
        const texts = this.text.split(/(Receive )/g)
        const buyDetail = texts[2]!.split(' ')
        const t = texts[4]!.split(' ')
        const pricePerUnit = parseFloat(t[t.length - 2]!)
        const receive = parseFloat(t[0]!)
        const fullUnit = (t[6]!)
        const receiveCurrentCy = t[1]
        const fromCurrentcy = t[t.length - 1]
        const amount = parseFloat(buyDetail[buyDetail?.length - 3]!)
        return {
            date: new Date(`${buyDetail[5]} ${buyDetail[6]}`),
            type: texts[2]![0] == '+' ? 'buy' : 'sell',
            pricePerUnit,
            receive,
            fullUnit,
            receiveCurrentCy,
            fromCurrntcy: fromCurrentcy,
            amount
        }
    }
}