import tesseract from "node-tesseract-ocr";
import { createAInvestmentLog } from "./core";
const config = {
  lang: "tha+eng",
  oem: 3,
  psm: 6,
  tessjs_create_hocr: "1",
};
export async function getInvestmentJsonFormImage(image: Buffer) {
  return await tesseract
    .recognize(image, config)
    .then((text) => {
      return createAInvestmentLog(text).toJson();
    })
    .catch((error) => {
      throw error;
    });
}
