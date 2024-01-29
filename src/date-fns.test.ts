import { vi } from "vitest";

import * as df from "./date-fns";
import { dtz } from "./date-fns";

describe("date-fns", () => {
	describe("getDateFrom", () => {
		it.each([
			["bad arg", "2022-07-11", { foo: 1 }, "2022-07-11"],
			["yesterday", "2020-01-01", { days: -1 }, "2019-12-31"],
			["yesterday", "2020-03-01", { days: -1 }, "2020-02-29"],
			["previous week", "2022-07-02", { weeks: -1 }, "2022-06-25"],
			["previous week", "2022-01-03", { weeks: -1 }, "2021-12-27"],
			["next day", "2020-01-31", { days: 1 }, "2020-02-01"],
			["next day", "2020-01-31", { days: 1 }, "2020-02-01"],
			["next week", "2020-01-31", { weeks: 1 }, "2020-02-07"],
			["next week", "2022-12-29", { weeks: 1 }, "2023-01-05"],
			["next month", "2022-07-11", { months: 1 }, "2022-08-11"],
			["next month", "2020-01-31", { months: 1 }, "2020-02-29"],
			["next month", "2022-12-29", { months: 1 }, "2023-01-29"],
			["previous month", "2022-12-29", { months: -1 }, "2022-11-29"],
			["next year", "2022-07-11", { years: 1 }, "2023-07-11"],
			["next year", "2020-01-31", { years: 1 }, "2021-01-31"],
			["next year", "2022-12-29", { years: 1 }, "2023-12-29"],
			["previous year", "2022-12-29", { years: -1 }, "2021-12-29"],
		])("getDateFrom: %s %s", (_, dateStr, args, expected) => {
			const actual = df.getDateFrom({ date: dtz(dateStr), ...args });
			expect(actual).toStrictEqual(dtz(expected));
		});
	});

	describe("getDaysOfMonth", () => {
		it("gets all days in a month", () => {
			const actual = df.getDaysOfMonth({ month: 3, year: 2023 });

			expect(actual).toHaveLength(30);
			// eslint-disable-next-line no-useless-computed-key
			const { [0]: first, length, [length - 1]: last } = actual;
			expect(first).toStrictEqual(dtz("2023-04-01"));
			expect(last).toStrictEqual(dtz("2023-04-30"));
		});
	});

	describe("getFirstDayOfMonth", () => {
		it("returns the first day of the month: current month", () => {
			vi.useFakeTimers().setSystemTime(dtz("2022-07-11"));
			const actual = df.getFirstDayOfMonth();

			const expected = dtz("2022-07-01");
			expect(actual).toStrictEqual(expected);
		});

		it("returns the first day of the month", () => {
			const actual = df.getFirstDayOfMonth(dtz("2020-01-01"));
			const expected = dtz("2020-01-01");
			expect(actual).toStrictEqual(expected);
		});
	});

	describe("getLastDayOfMonth", () => {
		vi.useFakeTimers().setSystemTime(new Date("2022-07-11").getTime());

		it("returns the first day of the month: current month", () => {
			const actual = df.getFirstDayOfMonth();

			const expected = dtz("2022-07-01");
			expect(actual).toStrictEqual(expected);
		});

		it("returns the last day of the month: current month", () => {
			const actual = df.getLastDayOfMonth();

			const expected = dtz("2022-07-31");
			expect(actual).toStrictEqual(expected);
		});

		it.each([
			["2020-01-01", "2020-01-31"],
			["2020-12-10", "2020-12-31"],
			["2022-11-10", "2022-11-30"],
			["2020-02-20", "2020-02-29"],
			["2022-02-28", "2022-02-28"],
			["2022-07-01", "2022-07-31"],
		])("gets last day of month: %s", (dateStr, expectedStr) => {
			const actual = df.getLastDayOfMonth(dtz(dateStr));
			const expected = dtz(expectedStr);
			expect(actual).toStrictEqual(expected);
		});
	});

	describe("isInRange", () => {
		it.each([
			["2022-07-02", undefined, undefined, true],
			["2022-07-10", "2022-07-01", undefined, true],
			["2022-07-10", undefined, "2022-07-31", true],
			["2022-07-10", "2022-07-01", "2022-07-31", true],
			["2022-08-12", undefined, undefined, false],
			["2022-08-12", "2022-07-01", undefined, false],
			["2022-08-12", undefined, "2022-07-31", false],
			["2022-08-12", "2022-07-01", "2022-07-31", false],
		])("is in range: %s", (dateStr, minDate, maxDate, expected) => {
			vi.useFakeTimers().setSystemTime(dtz("2022-07-02"));
			const actual = df.isInRange({
				date: dtz(dateStr),
				minDate: minDate ? dtz(minDate) : undefined,
				maxDate: maxDate ? dtz(maxDate) : undefined,
			});

			expect(actual).toBe(expected);
		});
	});

	describe("getMonthsInRange", () => {
		it("get months in range", () => {
			const actual = df.getMonthsInRange({
				start: dtz("2022-06-14"),
				end: dtz("2022-08-03"),
			});

			const expected = [
				{ month: 5, year: 2022 },
				{ month: 6, year: 2022 },
				{ month: 7, year: 2022 },
			];
			expect(actual).toStrictEqual(expected);
		});

		it("get months in range ending on first of month", () => {
			const actual = df.getMonthsInRange({
				start: dtz("2022-06-14"),
				end: dtz("2022-08-01"),
			});

			const expected = [
				{ month: 5, year: 2022 },
				{ month: 6, year: 2022 },
				{ month: 7, year: 2022 },
			];
			expect(actual).toStrictEqual(expected);
		});

		it("get months in range starting on last of month", () => {
			const actual = df.getMonthsInRange({
				start: dtz("2022-06-30"),
				end: dtz("2022-07-01"),
			});

			const expected = [
				{ month: 5, year: 2022 },
				{ month: 6, year: 2022 },
			];
			expect(actual).toStrictEqual(expected);
		});

		it("get months in range with no start date", () => {
			const actual = df.getMonthsInRange({
				end: dtz("2022-08-10"),
			});

			const expected = [
				{ month: 6, year: 2022 },
				{ month: 7, year: 2022 },
			];
			expect(actual).toStrictEqual(expected);
		});
	});
});
