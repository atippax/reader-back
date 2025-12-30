import tesseract from "node-tesseract-ocr"
import { createADividendLog } from "./core.js"
const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}
export async function getDividendJsonFormImage(image: Buffer) {
    return await tesseract.recognize(image, config)
        .then(text => {
            return createADividendLog(text).map(x => x.toJson())
        })
        .catch(error => {
            throw error
        })
}