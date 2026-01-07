import tesseract from "node-tesseract-ocr";
import fs from "fs";
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
        const columns = line.split("\t")
        if (index > 0 && columns.length > 11) {
          const text = columns[11]!.trim()
          const top = parseInt(columns[7]!)
          const height = parseInt(columns[9]!) // ดึงค่าความสูงมาด้วย
          const left = parseInt(columns[6]!)   // ดึงค่าแนวนอนมาด้วย

          if (text !== "") {
            // ใช้ค่ากึ่งกลาง (Center Y) แทน Top
            const centerY = top + (height / 2)
            results.push({ text, centerY, left })
          }
        }
      })

      // 1. เรียงลำดับตามแนวตั้ง (centerY) ก่อน
      results.sort((a, b) => a.centerY - b.centerY)

      // 2. จัดกลุ่มบรรทัด (Grouping)
      let finalRows = []
      let currentRow: any = []
      let lastCenterY = -1
      const rowThreshold = 20 // ระยะห่างกึ่งกลางบรรทัดที่ยอมรับได้ (ลองปรับ 15-25)

      results.forEach((item) => {
        if (lastCenterY === -1 || Math.abs(item.centerY - lastCenterY) > rowThreshold) {
          if (currentRow.length > 0) {
            // ก่อนขึ้นบรรทัดใหม่ ให้เรียงซ้ายไปขวา (left) ในบรรทัดเดิมก่อน
            currentRow.sort((a: any, b: any) => a.left - b.left)
            finalRows.push(currentRow.map((i: any) => i.text).join(" "))
          }
          currentRow = [item]
          lastCenterY = item.centerY
        } else {
          currentRow.push(item)
        }
      })

      // บรรทัดสุดท้าย
      if (currentRow.length > 0) {
        currentRow.sort((a: any, b: any) => a.left - b.left)
        finalRows.push(currentRow.map((i: any) => i.text).join(" "))
      }

      const text = finalRows.join("\n")
      return text
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
export async function parseImageToText(image: Buffer, forOcr: For) {
  return await tesseract
    .recognize(image, forOcr.config)
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
