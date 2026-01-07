import tesseract from "node-tesseract-ocr";
import fs from "fs";
import path from "path";
import sharp from "sharp";
sharp.concurrency(1);
import type { OcrStategy } from "./stategies/base-ocr";
export async function readImageBufferFromPath(path: string) {
  const image = await fs.readFileSync(path);
  const imageBuffer = Buffer.from(image.buffer);
  return imageBuffer;
}
function sanitize(text: string): string {
  return text.replace(/([ก-์])\s+(?=[ก-์])/g, "$1").replace(/\s+/g, " ");
}
async function saveImage(inputBuffer: Buffer, outputFileName: string) {
  try {
    const debugDir = "./imageTest/debugImages";
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }
    const outputPath = path.join(debugDir, outputFileName);
    await fs.promises.writeFile(outputPath, inputBuffer);
    console.log(`Successfully saved: ${outputPath}`);
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}
async function greyScale(image: Buffer) {
  const processedImageBuffer = await sharp(image)
    .grayscale()
    .resize({ width: 1800, height: 2400, fit: "inside" })
    .withMetadata({ density: 300 })
    .sharpen()
    // .threshold(128)
    .toBuffer();
  return processedImageBuffer;
}
export async function parseImageToText(image: Buffer, ocrStategy: OcrStategy) {
  const greyImage = await greyScale(image);
  await saveImage(greyImage, `ocr-ready-${Date.now()}.png`);
  return await tesseract
    .recognize(greyImage, ocrStategy.getConfig())
    .then((tsvData) => {
      const text = ocrStategy.mutation(tsvData);
      return sanitize(text)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .join(" ");
    })
    .catch((error) => {
      throw error;
    });
}
