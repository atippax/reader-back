export class BasePatternExtractor {
  constructor(private pattern: RegExp) { }
  private isHavePattern(text: string) {
    const results = text.match(this.pattern);
    if (results == null) return false;
    return results.length > 0;
  }
  public extract(text: string) {
    const textSplited = text.split(this.pattern);
    return textSplited
      .map((item) => item.trim())
      .filter((item) => item !== "" && this.isHavePattern(item));
  }
}
