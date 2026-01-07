import tesseract from "node-tesseract-ocr";
import fs from "fs";
import path from 'path'
import sharp from 'sharp';
interface For {
  config: tesseract.Config,
  mutation: (str: string) => string
}
export function forPositionOcr(): For {
  return {
    config: {
      lang: "eng+tha",
      oem: 1,
      psm: 11,
      "tessedit_create_tsv": "1"
    },
    mutation: (tsvData: string) => {
      const lines = tsvData.split("\n")
      const results: any[] = []
      const keys: string[] = []
      lines.forEach((line, index) => {
        const columns = line.split("\t").map(x => x.replace('\r', ''))
        if (index > 0 && columns.length > 11) {
          results.push(keys.reduce((s, x, i) => ({ ...s, [x]: columns[i] }), {} as any))
        }
        else {
          if (keys.length == 0)
            keys.push(...columns)
        }
      })

      function contain(f: any, item: any) {
        const equal = (f.y0 <= item.y0 && f.y1 >= item.y1)
        const fLow = (f.y0 > item.y0 && f.y1 >= item.y1 && item.y1 > f.y0)
        const fTop = (f.y0 < item.y0 && f.y1 <= item.y1 && f.y1 > item.y1)
        const fSmallerItem = (f.y0 <= item.y0 && f.y1 >= item.y1)
        return equal || fTop || fLow || fSmallerItem
      }

      const c = results.map(x => {
        return {
          ...x,
          y0: +x.top,
          y1: +x.top + +x.height,
          x: +x.left
        }
      }).reduce((state, item) => {
        if (state.length == 0) {
          return [{ items: [{ x: item.x, text: item.text, y0: item.y0, y1: item.y1 }], y0: item.y0, y1: item.y1 }]
        }
        const findItem = state.find((f: any) => (contain(f, item) || contain(item, f)))
        if (!findItem) return [...state, { items: [{ x: item.x, text: item.text, y0: item.y0, y1: item.y1 }], y0: item.y0, y1: item.y1 }]
        return [...state.filter((f: any) => f != findItem), { items: [...findItem.items, { x: item.x, text: item.text, y0: item.y0, y1: item.y1 }], y0: Math.min(item.y0, findItem.y0), y1: Math.max(item.y1, findItem.y1) }]
      }, [])
      const texts = c.map((g: any) => g.items.map((f: any) => f.text).join(' ')).join('\n')
      return texts
    }
  }
}
export function forNormal(): For {
  return {
    config: {
      lang: "eng+tha",
      oem: 1,
      psm: 6,
    },
    mutation: (str: string) => {
      return str
    }
  }
}
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
    const debugDir = './imageTest/debugImages';
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }
    const outputPath = path.join(debugDir, outputFileName);
    await fs.promises.writeFile(outputPath, inputBuffer);
    console.log(`Successfully saved: ${outputPath}`);

  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}
async function greyScale(image: Buffer) {
  const processedImageBuffer = await sharp(image)
    .grayscale()
    .threshold(128)
    .toBuffer();
  return processedImageBuffer
}
export async function parseImageToText(image: Buffer, forOcr: For) {
  const greyImage = await greyScale(image)
  await saveImage(greyImage, `ocr-ready-${Date.now()}.png`)
  return await tesseract
    .recognize(greyImage, forOcr.config)
    .then((tsvData) => {
      const text = forOcr.mutation(tsvData)
      // console.log('raw text:', text)
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
