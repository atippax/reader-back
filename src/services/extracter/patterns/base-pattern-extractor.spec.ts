import { BasePatternExtractor } from "./base-pattern-extractor";

describe("BasePatternExtractor", () => {
  it("should trim whitespace and filter empty results", () => {
    const extractor = new BasePatternExtractor(/(?<=-)/g);
    const input = " part1  -  part2  -  ";
    expect(extractor.extract(input)).toEqual(["part1  -", "part2  -"]);
  });
});
