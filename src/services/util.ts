export function filterEmptyWord(words: string) {
  // return words.filter((w) => w != "");
}

export function defaultZero(value: number | null) {
  return value || 0;
}

export function findSame(words: string[], search: string) {
  return words.filter((x) => x.includes(search));
}
export function parseWithWord(word: string, search: string) {
  return parseFloat(word?.replace(search, ""));
}
export function parseUsd(word: string) {
  return parseWithWord(word, "USD");
}
export function findWord(words: string[], search: string) {
  return words.find((f) => f.includes(search));
}
export function findWordUseNextLine(words: string[], search: string) {
  const index = words.findIndex((f) => f.includes(search));
  const word = words[index + 1];
  return word;
}

export function cleanText(word: string) {
  return word.replaceAll("\r", "");
}
export function extractDateFromText(text: string): Date | null {
  const fullDateRegex =
    /\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\s-\s\d{2}:\d{2}:\d{2}\s(?:AM|PM)/i;
  const match = text.match(fullDateRegex);
  const dateValue = match ? match[0].replace("- ", "")! : null;
  return dateValue ? new Date(dateValue) : null;
}
export function extractDatesFromText(words: string[]) {
  const dateRegex =
    /\b(\d{2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{4})\s/g;
  const matches = words.filter((w) => w.match(dateRegex));
  if (matches) {
    return matches;
  }
  return [];
}
export function parseDateTimeToDateObject(dateTimeString: string) {
  const standardFormat = dateTimeString.replace(" - ", " ");
  const date = new Date(standardFormat);
  if (!isNaN(date.getTime())) {
    return date;
  }
  return null;
}
export function displayDateToLocal(date: Date) {
  return date.toLocaleString();
}
