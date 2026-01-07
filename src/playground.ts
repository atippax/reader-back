import fs from "fs";
import {
  forNormal,
  forPositionOcr,
  parseImageToText,
  readImageBufferFromPath,
} from "./services/ocr/index";
import { BinanceThSlip } from "./services/binance-th/slip/slip";
import { createAInvestmentLog } from "./services/dime/stock-slip/core";
import { BinanceThTransaction } from "./services/binance-th/transaction/transaction";
import { BinanceThTransactionPatternExtractor } from "./services/extracter/patterns/binance-th-transaction-pattern-extractor";

// fs.readdir("./imageTest/dime", async (err, langFolders) => {
//   for (const langFolder of langFolders) {
//     const folders = fs.readdirSync(`./imageTest/dime/${langFolder}`);
//     for (const folder of folders) {
//       const files = fs.readdirSync(`./imageTest/dime/${langFolder}/${folder}`);

//       for (const file of files) {
//         const text = await parseImageToText(
//           await readImageBufferFromPath(
//             `./imageTest/dime/${langFolder}/${folder}/${file}`
//           )
//         );
//         console.log(
//           `${langFolder}/${folder}/${file}: \n\n${text}\n---------------------\n`
//         );
//         // const dateExtractor = new DatePatternExtractor();
//         // const transaction = new TransactionExtractor(dateExtractor, text);
//         // console.log(transaction.toJson());
//       }
//     }
//   }
// });
// const basePath = "./imageTest/en/transaction"
// fs.readdir(basePath, async (err, files) => {
//   if (err) return console.log(err)
//   for (const file of files) {
//     const text = await parseImageToText(
//       await readImageBufferFromPath(
//         `${basePath}/${file}`
//       ), forNormal()
//     );
//     console.log(new BinanceThTransaction(new BinanceThTransactionPatternExtractor(), text).toJson())
//   }
// })

// const text = await parseImageToText(
//   await readImageBufferFromPath(
//     `imageTest/1000000974.jpg`
//   )
// );
// console.log(createAInvestmentLog(text).toJson())

// const paragraphs = `
// 1+2  1+4  1+5
// `;
// const p1 = /(\+)/g;
// const p2 = /\+/g;
// const p3 = /(?<=\+)/g;
// const p4 = /(?=\+)/g;
// const p5 = /(?:\+)/g;
// console.log(paragraphs.split(p1));
// console.log(paragraphs.split(p2));
// console.log(paragraphs.split(p3));
// console.log(paragraphs.split(p4));
// console.log(paragraphs.split(p5));
