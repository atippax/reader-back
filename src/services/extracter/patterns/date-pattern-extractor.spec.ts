import { DatePatternExtractor } from "./date-pattern-extractor";

describe("DatePatternExtractor", () => {
  it("should extract dates with AM/PM format correctly", () => {
    const extractor = new DatePatternExtractor();
    const input = `
    asdasdasdad asdpalsdp adasl kdas,dsaokd ad dpoaksd
    Dividend Withholding 24 Dec 2025 - 11:19:46 PM 
    Dividend 12 Jan 2024 - 09:15:30 AM`;
    const result = extractor.extract(input);

    expect(result).toHaveLength(2);
    expect(result[1]).toContain("12 Jan 2024 - 09:15:30 AM");
    expect(result[0]).toContain("24 Dec 2025 - 11:19:46 PM");
  });
});
