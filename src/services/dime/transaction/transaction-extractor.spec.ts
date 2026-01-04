import { describe, expect, it, jest } from "@jest/globals";
import { TransactionExtractor } from "./transaction-extractor.js";
describe("", () => {
  it("should clean text correctly", () => {
    const mockPatternExtractor = {
      extract: jest.fn().mockReturnValue([
        `Activity f Schedule > Investment Cash ‘und @ Thai stock @ us options Q_ Enter astock symbol to search you.. 72> Done December 2025 
          Buy SGOV 4.37 USD Executed Price 100.37 30 Dec 2025 - 02:38:11 PM Shares 0.0435389`,
        ` Dividend SGOV 1.60 USD Deposit to Dime! USD 24 Dec 2025 - 11:19:50 PM`,
        `Dividend Withholding Tax SGOV -0.24 USD Deduct from Dime! USD 24 Dec 2025 - 11:19:46 PM`,
        `Dividend GOOGL 0.25 USD Deposit to Dime! USD 16 Dec 2025 - 12:46:53 AM`,
        `Dividend Withholding Tax GOOGL -0.03 USD Deduct from Dime! USD 16 Dec 2025 - 12:46:46 AM`,
        `Dividend SGOV 1.55 USD Deposit to Dime! USD 5 Dec 2025 - 12:23:32 AM`,
      ]),
    } as any;
    const extractor = new TransactionExtractor(
      mockPatternExtractor,
      "Activity f Schedule > Investment Cash ‘und @ Thai stock @ us options Q_ Enter astock symbol to search you.. 72> Done December 2025 Buy SGOV 4.37 USD Executed Price 100.37 30 Dec 2025 - 02:38:11 PM Shares 0.0435389 Dividend SGOV 1.60 USD Deposit to Dime! USD 24 Dec 2025 - 11:19:50 PM Dividend Withholding Tax SGOV -0.24 USD Deduct from Dime! USD 24 Dec 2025 - 11:19:46 PM Dividend GOOGL 0.25 USD Deposit to Dime! USD 16 Dec 2025 - 12:46:53 AM Dividend Withholding Tax GOOGL -0.03 USD Deduct from Dime! USD 16 Dec 2025 - 12:46:46 AM Dividend SGOV 1.55 USD Deposit to Dime! USD 5 Dec 2025 - 12:23:32 AM Nividand Alithhaldina Tav CAA -N 921I¢Nn 5 3 Home Invest Cash Assets Activity Me"
    );
    expect(extractor.getTexts()).toEqual([
      `Buy SGOV 4.37 USD Executed Price 100.37 30 Dec 2025 - 02:38:11 PM Shares 0.0435389`,
      `Dividend SGOV 1.60 USD Deposit to Dime! USD 24 Dec 2025 - 11:19:50 PM`,
      `Dividend Withholding Tax SGOV -0.24 USD Deduct from Dime! USD 24 Dec 2025 - 11:19:46 PM`,
      `Dividend GOOGL 0.25 USD Deposit to Dime! USD 16 Dec 2025 - 12:46:53 AM`,
      `Dividend Withholding Tax GOOGL -0.03 USD Deduct from Dime! USD 16 Dec 2025 - 12:46:46 AM`,
      `Dividend SGOV 1.55 USD Deposit to Dime! USD 5 Dec 2025 - 12:23:32 AM`,
    ]);
  });
});
