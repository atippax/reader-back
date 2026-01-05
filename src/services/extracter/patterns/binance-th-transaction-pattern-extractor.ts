import { BasePatternExtractor } from "./base-pattern-extractor";

export class BinanceThTransactionPatternExtractor extends BasePatternExtractor {
    constructor() {
        super(/(?=\b\d+(?:\.\d+)?\s?THB)/g);
    }
}
