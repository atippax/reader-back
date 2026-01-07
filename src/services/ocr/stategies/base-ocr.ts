import tesseract from "node-tesseract-ocr";
export abstract class OcrStategy {
  abstract getConfig: () => tesseract.Config;
  abstract mutation: (str: string) => string;
}
export class BaseOcrStategy implements OcrStategy {
  private config: tesseract.Config = {
    lang: "eng+tha",
    oem: 1,
    psm: 6,
    tessedit_do_invert: 0,
    tessdata_manager_max_memory_mb: 64,
  };
  public getConfig(): tesseract.Config {
    return this.config;
  }
  public mutation(str: string) {
    return str;
  }
}
