import { OcrStategy } from "./base-ocr";
import tesseract from "node-tesseract-ocr";

export class CoordinatesOcrStategy implements OcrStategy {
  private config: tesseract.Config = {
    lang: "eng+tha",
    oem: 1,
    psm: 11,
    tessedit_create_tsv: "1",
    tessedit_do_invert: 0,
    tessdata_manager_max_memory_mb: 64,
  };
  public getConfig(): tesseract.Config {
    return this.config;
  }
  public mutation(tsvData: string): string {
    const lines = tsvData.split("\n");
    const results: any[] = [];
    const keys: string[] = [];
    lines.forEach((line, index) => {
      const columns = line.split("\t").map((x) => x.replace("\r", ""));
      if (index > 0 && columns.length > 11) {
        results.push(
          keys.reduce((s, x, i) => ({ ...s, [x]: columns[i] }), {} as any)
        );
      } else {
        if (keys.length == 0) keys.push(...columns);
      }
    });

    function contain(f: any, item: any) {
      const equal = f.y0 <= item.y0 && f.y1 >= item.y1;
      const fLow = f.y0 > item.y0 && f.y1 >= item.y1 && item.y1 > f.y0;
      const fTop = f.y0 < item.y0 && f.y1 <= item.y1 && f.y1 > item.y1;
      const fSmallerItem = f.y0 <= item.y0 && f.y1 >= item.y1;
      return equal || fTop || fLow || fSmallerItem;
    }

    const c = results
      .map((x) => {
        return {
          ...x,
          y0: +x.top,
          y1: +x.top + +x.height,
          x: +x.left,
        };
      })
      .reduce((state, item) => {
        if (state.length == 0) {
          return [
            {
              items: [{ x: item.x, text: item.text, y0: item.y0, y1: item.y1 }],
              y0: item.y0,
              y1: item.y1,
            },
          ];
        }
        const findItem = state.find(
          (f: any) => contain(f, item) || contain(item, f)
        );
        if (!findItem)
          return [
            ...state,
            {
              items: [{ x: item.x, text: item.text, y0: item.y0, y1: item.y1 }],
              y0: item.y0,
              y1: item.y1,
            },
          ];
        return [
          ...state.filter((f: any) => f != findItem),
          {
            items: [
              ...findItem.items,
              { x: item.x, text: item.text, y0: item.y0, y1: item.y1 },
            ],
            y0: Math.min(item.y0, findItem.y0),
            y1: Math.max(item.y1, findItem.y1),
          },
        ];
      }, []);
    const texts = c
      .map((g: any) => g.items.map((f: any) => f.text).join(" "))
      .join("\n");
    return texts;
  }
}
