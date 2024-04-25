import { vi } from "vitest";

import * as df from "./date-fns";
import { dtz } from "./date-fns";
import {
	getDayEvents,
	getMinMaxDate,
	getNewDay,
	getStartEndDate,
	getValidDate,
	getWeeks,
	isValidDate,
	padAdjacentMonthDays,
} from "./helpers";
import { type IDay } from "./use-calendar.d";

describe("use-calendar helpers", () => {
	const dateNowSpy = vi
		.spyOn(Date, "now")
		.mockReturnValue(new Date("2022-07-02T00:00:00").getTime());

	afterAll(() => {
		dateNowSpy.mockRestore();
	});

	describe("isValidDate", () => {
		// eslint-disable-next-line unicorn/no-null
		it.each([null, false])("handles untyped values", (d) => {
			// @ts-expect-error - we're testing this
			const actual = isValidDate(d);
			expect(actual).toBe(false);
		});

		it.each([
			[undefined, false],
			["2020-01-01", true],
			["01-01-2020", false],
			["foobar", false],
			[0, true],
			[new Date("2022-12-25"), true],
		])("checks if date is valid: %s", (d, expected) => {
			const actual = isValidDate(d);
			expect(actual).toBe(expected);
		});
	});

	describe("getValidDate", () => {
		it.each([
			[undefined, undefined],
			["2020-01-01", new Date("2020-01-01")],
			["01-01-2020", undefined],
			["foobar", undefined],
			[0, new Date("1970-01-01T00:00:00.000Z")],
			[new Date("2022-12-25"), new Date("2022-12-25")],
		])("converts to date: %s", (d, expected) => {
			const actual = getValidDate(d);
			expect(actual).toStrictEqual(expected);
		});
	});

	describe("pad adjacent month days", () => {
		it.each([
			[
				"default",
				[],
				"2022-07-01",
				0,
				[
					{
						date: dtz("2022-06-26"),
						isAdjacentMonth: true,
						isWeekend: true,
					},
					{ date: dtz("2022-06-27"), isAdjacentMonth: true },
					{ date: dtz("2022-06-28"), isAdjacentMonth: true },
					{ date: dtz("2022-06-29"), isAdjacentMonth: true },
					{ date: dtz("2022-06-30"), isAdjacentMonth: true },
				],
			],
			[
				"firstDayOfWeek=1",
				[],
				"2022-07-01",
				1,
				[
					{ date: dtz("2022-06-27"), isAdjacentMonth: true },
					{ date: dtz("2022-06-28"), isAdjacentMonth: true },
					{ date: dtz("2022-06-29"), isAdjacentMonth: true },
					{ date: dtz("2022-06-30"), isAdjacentMonth: true },
				],
			],
		])(
			"pads last days of previous month: %s",
			(_, week, strDate, firstDayOfWeek, expected) => {
				const date = dtz(strDate);
				const actual = padAdjacentMonthDays({ date, firstDayOfWeek, week });
				expect(actual).toStrictEqual(expected);
			}
		);

		it.each([
			[
				"default",
				[],
				"2022-07-31",
				0,
				[
					{ date: dtz("2022-08-01"), isAdjacentMonth: true },
					{ date: dtz("2022-08-02"), isAdjacentMonth: true },
					{ date: dtz("2022-08-03"), isAdjacentMonth: true },
					{ date: dtz("2022-08-04"), isAdjacentMonth: true },
					{ date: dtz("2022-08-05"), isAdjacentMonth: true },
					{
						date: dtz("2022-08-06"),
						isAdjacentMonth: true,
						isWeekend: true,
					},
				],
			],
			[
				"default",
				[],
				"2022-08-31",
				0,
				[
					{ date: dtz("2022-09-01"), isAdjacentMonth: true },
					{ date: dtz("2022-09-02"), isAdjacentMonth: true },
					{
						date: dtz("2022-09-03"),
						isAdjacentMonth: true,
						isWeekend: true,
					},
				],
			],
			["firstDayOfWeek=1", [], "2022-07-31", 1, []],
		])(
			"pads first days of next month: %s",
			(_, week, strDate, firstDayOfWeek, expected) => {
				const date = dtz(strDate);

				const actual = padAdjacentMonthDays({ date, firstDayOfWeek, week });
				expect(actual).toStrictEqual(expected);
			}
		);

		it("pads adjacent month days according to available dates", () => {
			const actual = padAdjacentMonthDays({
				availableDates: df.getDaysOfMonth({ month: 5, year: 2022 }),
				date: dtz("2022-07-01"),
				firstDayOfWeek: 0,
				week: [],
			});

			const expected: IDay[] = [
				"2022-06-26",
				"2022-06-27",
				"2022-06-28",
				"2022-06-29",
				"2022-06-30",
			].map((date) => ({
				date: dtz(date),
				isAdjacentMonth: true,
				isSelectable: true,
			}));
			expected[0].isWeekend = true;
			expect(actual).toStrictEqual(expected);
		});

		it('pads adjacent month days with "selected" date', () => {
			const actual = padAdjacentMonthDays({
				availableDates: df.getDaysOfMonth({ month: 5, year: 2022 }),
				date: dtz("2022-07-01"),
				firstDayOfWeek: 0,
				selected: dtz("2022-06-27"),
				week: [],
			});
			const expected: IDay[] = [
				"2022-06-26",
				"2022-06-27",
				"2022-06-28",
				"2022-06-29",
				"2022-06-30",
			].map((date) => ({
				date: dtz(date),
				isAdjacentMonth: true,
				isSelectable: true,
			}));
			expected[0].isWeekend = true;
			expected[1].isSelected = true;
			expect(actual).toStrictEqual(expected);
		});
	});

	describe("getWeeks", () => {
		it("gets weeks for a month", () => {
			const actual = getWeeks({
				firstDayOfWeek: 0,
				maxDate: dtz("2022-07-31"),
				minDate: dtz("2022-07-01"),
				month: 6,
				year: 2022,
			});

			const expected = [
				"2022-07-01",
				"2022-07-04",
				"2022-07-11",
				"2022-07-18",
				"2022-07-25",
			].map((dateStr) => ({
				date: dtz(dateStr),
				isSelectable: true,
			}));
			expect(actual).toHaveLength(6);
			expect(actual.flat()).toStrictEqual(expect.arrayContaining(expected));
		});
	});

	describe("getNewDay", () => {
		it.each([
			["2022-07-02", { isSelectable: true, isToday: true, isWeekend: true }],
			["2022-07-11", { isSelectable: true }],
			["2022-06-11", { isWeekend: true }],
		])("creates a new Day object: %s", (dateStr, expectedAttrs) => {
			const actual = getNewDay({
				date: dtz(dateStr),
				maxDate: dtz("2022-07-31"),
				minDate: dtz("2022-07-01"),
			});

			const expected = {
				...expectedAttrs,
				date: dtz(dateStr),
			};
			expect(actual).toStrictEqual(expected);
		});

		it.each([
			["2022-07-02", { isSelectable: true, isToday: true, isWeekend: true }],
			["2022-07-11", { isSelectable: true }],
			["2022-06-11", { isWeekend: true }],
		])(
			"creates a new Day object with available dates list: %s",
			(dateStr, expectedAttrs) => {
				const actual = getNewDay({
					availableDates: df.getDaysOfMonth({ month: 6, year: 2022 }),
					date: dtz(dateStr),
				});

				const expected = {
					...expectedAttrs,
					date: dtz(dateStr),
				};
				expect(actual).toStrictEqual(expected);
			}
		);

		it("creates a selected Day", () => {
			const actual = getNewDay({
				availableDates: df.getDaysOfMonth({ month: 6, year: 2022 }),
				date: dtz("2022-07-02"),
				selected: dtz("2022-07-02"),
			});

			expect(actual.isSelectable).toBe(true);
		});

		it("creates a day with events", () => {
			const actual = getNewDay({
				date: dtz("2022-07-17"),
				events: [
					{ meta: { title: "Birthday Party" }, start: dtz("2022-07-17") },
				],
			});

			const expected = {
				date: dtz("2022-07-17"),
				events: [
					{
						meta: { title: "Birthday Party" },
						start: dtz("2022-07-17"),
					},
				],
				isSelectable: true,
				isWeekend: true,
			};
			expect(actual).toStrictEqual(expected);
		});

		it("creates a weekend day", () => {
			const actual = getNewDay({
				date: dtz("2022-07-17"),
			});

			const expected = {
				date: dtz("2022-07-17"),
				isSelectable: true,
				isWeekend: true,
			};
			expect(actual).toStrictEqual(expected);
		});
	});

	describe("getDayEvents", () => {
		it("works with no events", () => {
			const actual = getDayEvents({ date: dtz("2022-07-17") });
			expect(actual).toStrictEqual([]);
		});

		it.each([
			["2022-06-22", []],
			["2022-07-02", [{ start: dtz("2022-07-02") }]],
			[
				"2022-07-02T09:00:00.000Z",
				[{ start: dtz("2022-07-02T09:00:00.000Z") }],
			],
			["2022-09-12", []],
		])(
			"gets events for a day, single event with only a start date",
			(dtStart, expected) => {
				const actual = getDayEvents({
					date: dtz("2022-07-02"),
					events: [{ start: dtz(dtStart) }],
				});

				expect(actual).toStrictEqual(expected);
			}
		);

		it.each([
			["2022-06-22", "2022-07-16", []],
			[
				"2022-07-17",
				"2022-07-20",
				[{ end: dtz("2022-07-20"), start: dtz("2022-07-17") }],
			],
			["2022-09-12", "2022-09-13", []],
		])(
			"gets events for a day, single event with only a start date",
			(dtStart, dtEnd, expected) => {
				const actual = getDayEvents({
					date: dtz("2022-07-17"),
					events: [{ end: dtz(dtEnd), start: dtz(dtStart) }],
				});

				expect(actual).toStrictEqual(expected);
			}
		);
	});

	describe("getMinMaxDate", () => {
		it("gets min and max dates: default", () => {
			const actual = getMinMaxDate();

			const expected = {
				maxDate: dtz("2032-07-02"),
				minDate: dtz("2012-07-02"),
			};
			expect(actual).toStrictEqual(expected);
		});

		it("gets min and max dates: with given min/max Date", () => {
			const actual = getMinMaxDate({
				maxDate: dtz("2022-07-31"),
				minDate: dtz("2022-07-01"),
			});

			const expected = {
				maxDate: dtz("2022-07-31"),
				minDate: dtz("2022-07-01"),
			};
			expect(actual).toStrictEqual(expected);
		});

		it("always includes the current month with availableDates only (minDate)", () => {
			const availableDates = df.getDaysOfMonth({ month: 1, year: 2023 });
			const actual = getMinMaxDate({ availableDates });

			const expected = {
				maxDate: dtz("2023-02-28"),
				minDate: dtz("2022-07-01"),
			};
			expect(actual).toStrictEqual(expected);
		});

		it("always includes the current month with availableDates only (maxDate)", () => {
			const actual = getMinMaxDate({
				availableDates: df.getDaysOfMonth({ month: 9, year: 2021 }),
			});

			const expected = {
				maxDate: dtz("2022-07-31"),
				minDate: dtz("2021-10-01"),
			};
			expect(actual).toStrictEqual(expected);
		});

		it("handles maxDate < minDate", () => {
			const actual = getMinMaxDate({
				maxDate: dtz("2022-07-01"),
				minDate: dtz("2022-07-31"),
			});

			const expected = {
				maxDate: dtz("2022-07-31"),
				minDate: dtz("2022-07-01"),
			};
			expect(actual).toStrictEqual(expected);
		});
	});

	describe("getStartEndDate", () => {
		const visibleMonth = dtz("2022-07-02");
		const monthsToDisplay = 1;

		it("default 1 visible month", () => {
			const actual = getStartEndDate({ monthsToDisplay, visibleMonth });

			const expected = {
				end: dtz("2022-08-02"),
				start: dtz("2022-06-02"),
			};
			expect(actual).toStrictEqual(expected);
		});

		it("based on minDate", () => {
			const minDate = dtz("2022-06-04");
			const actual = getStartEndDate({
				minDate,
				monthsToDisplay,
				visibleMonth,
			});

			const expected = {
				end: dtz("2022-08-02"),
				start: dtz("2022-06-04"),
			};
			expect(actual).toStrictEqual(expected);
		});

		it("based on maxDate", () => {
			const maxDate = dtz("2022-08-04");
			const actual = getStartEndDate({
				maxDate,
				monthsToDisplay,
				visibleMonth,
			});

			const expected = {
				end: dtz("2022-08-04"),
				start: dtz("2022-06-02"),
			};
			expect(actual).toStrictEqual(expected);
		});

		it("based on minDate/maxDate", () => {
			const minDate = dtz("2022-06-22");
			const maxDate = dtz("2022-08-04");
			const actual = getStartEndDate({
				maxDate,
				minDate,
				monthsToDisplay,
				visibleMonth,
			});

			const expected = {
				end: dtz("2022-08-04"),
				start: dtz("2022-06-22"),
			};
			expect(actual).toStrictEqual(expected);
		});

		it("based on available dates", () => {
			const availableDates = ["2022-06-04", "2022-07-29"].map((d) => dtz(d));
			const actual = getStartEndDate({
				availableDates,
				monthsToDisplay,
				visibleMonth,
			});

			const expected = {
				end: dtz("2022-07-29"),
				start: dtz("2022-06-04"),
			};
			expect(actual).toStrictEqual(expected);
		});
	});
});
