import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { dtz } from "./date-fns";

import {
	type IDay,
	type IEvent,
	type IGetDayPropsReturns,
	useCalendar,
} from "./index";

describe("use-calendar", () => {
	const dateNowSpy = vi
		.spyOn(Date, "now")
		.mockReturnValue(new Date("2022-07-02T00:00:00").getTime());

	afterAll(() => {
		dateNowSpy.mockRestore();
	});

	describe("default", () => {
		it("returns default props", () => {
			const { result } = renderHook(() => useCalendar());
			const { current: actual } = result;

			const expected = {
				getDayProps: expect.any(Function),
				getNextMonthProps: expect.any(Function),
				getNextYearProps: expect.any(Function),
				getPrevMonthProps: expect.any(Function),
				getPrevYearProps: expect.any(Function),
				months: [
					{
						month: 6,
						weeks: [
							"2022-07-01",
							"2022-07-08",
							"2022-07-14",
							"2022-07-22",
							"2022-07-29",
						].map((dateStr) =>
							expect.arrayContaining([
								{
									date: dtz(dateStr),
									isSelectable: true,
								},
							])
						),
						year: 2022,
					},
				],
				resetState: expect.any(Function),
			};
			expected.months[0].weeks.push(
				expect.arrayContaining([
					{
						date: dtz("2022-07-31"),
						isSelectable: true,
						isWeekend: true,
					},
				])
			);
			expect(actual).toMatchObject(expected);
		});

		it("pads last days of last month", () => {
			const { result } = renderHook(() =>
				useCalendar({
					maxDate: dtz("2022-07-31"),
					minDate: dtz("2022-07-01"),
				})
			);
			const { current: actual } = result;

			const expected = [
				{
					date: dtz("2022-06-26"),
					isAdjacentMonth: true,
					isWeekend: true,
				},
				{
					date: dtz("2022-06-27"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-06-28"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-06-29"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-06-30"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-07-01"),
					isSelectable: true,
				},
				{
					date: dtz("2022-07-02"),
					isSelectable: true,
					isToday: true,
					isWeekend: true,
				},
			];
			expect(actual.months[0].weeks[0]).toStrictEqual(expected);
		});

		it("pads first days of next month", () => {
			const { result } = renderHook(() =>
				useCalendar({
					maxDate: dtz("2022-07-31"),
					minDate: dtz("2022-07-01"),
				})
			);
			const { current: actual } = result;

			const expected = [
				{
					date: dtz("2022-07-31"),
					isSelectable: true,
					isWeekend: true,
				},
				{
					date: dtz("2022-08-01"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-08-02"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-08-03"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-08-04"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-08-05"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-08-06"),
					isAdjacentMonth: true,
					isWeekend: true,
				},
			];
			expect(actual.months[0].weeks[5]).toEqual(expected);
		});
	});

	describe("firstDayOfWeek", () => {
		it("returns weeks starting", () => {
			const { result } = renderHook(() =>
				useCalendar({
					firstDayOfWeek: 1,
					maxDate: dtz("2022-07-31"),
					minDate: dtz("2022-07-01"),
				})
			);
			const { current: actual } = result;

			const expected = {
				getDayProps: expect.any(Function),
				getNextMonthProps: expect.any(Function),
				getNextYearProps: expect.any(Function),
				getPrevMonthProps: expect.any(Function),
				getPrevYearProps: expect.any(Function),
				months: expect.any(Array),
				resetState: expect.any(Function),
			};
			expect(actual).toEqual(expected);
		});

		it("pads last days of last month", () => {
			const { result } = renderHook(() =>
				useCalendar({
					firstDayOfWeek: 1,
					maxDate: dtz("2022-07-31"),
					minDate: dtz("2022-07-01"),
				})
			);
			const { current: actual } = result;

			const expected = [
				{
					date: dtz("2022-06-27"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-06-28"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-06-29"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-06-30"),
					isAdjacentMonth: true,
				},
				{
					date: dtz("2022-07-01"),
					isSelectable: true,
				},
				{
					date: dtz("2022-07-02"),
					isSelectable: true,
					isToday: true,
				},
				{
					date: dtz("2022-07-03"),
					isSelectable: true,
				},
			];
			expect(actual.months[0].weeks[0]).toMatchObject(expected);
		});

		it("pads first days of next month", () => {
			const { result } = renderHook(() =>
				useCalendar({
					firstDayOfWeek: 1,
					maxDate: dtz("2022-07-31"),
					minDate: dtz("2022-07-01"),
				})
			);
			const { current: actual } = result;

			const expected = [
				"2022-07-25",
				"2022-07-26",
				"2022-07-27",
				"2022-07-28",
				"2022-07-29",
				"2022-07-30",
				"2022-07-31",
			].map((dateStr) => ({
				date: dtz(dateStr),
				isSelectable: true,
			}));
			expect(actual.months[0].weeks[4]).toMatchObject(expected);
		});
	});

	describe("with selected", () => {
		it("returns selected date", () => {
			const { result } = renderHook(() =>
				useCalendar({ selectedDate: dtz("2022-07-03") })
			);
			const { current: actual } = result;

			expect(actual.months[0].weeks[1][0]!.isSelected).toBe(true);
		});

		it("handles invalid dates", () => {
			const selectedDate = "foobar";
			const { result } = renderHook(() => useCalendar({ selectedDate }));
			const { current: actual } = result;

			expect(actual.months[0].weeks[1][0]!.isSelected).toBeUndefined();
		});

		it("sets the current month to the selected date's month", () => {
			const props = {
				maxDate: dtz("2022-08-31"),
				minDate: dtz("2022-06-01"),
				selectedDate: dtz("2022-07-03"),
			};

			const { result } = renderHook(() => useCalendar(props));
			expect(result.current.months[0].month).toBe(6);
		});

		it("still returns current month if not provided selected date", () => {
			const { result } = renderHook(() => useCalendar());
			const { current: actual } = result;

			expect(actual.months).toHaveLength(1);
		});
	});

	describe("monthsToDisplay", () => {
		it("returns default number of months to display (1)", () => {
			const { result } = renderHook(() => useCalendar());
			const { months } = result.current;

			expect(months).toHaveLength(1);
		});

		it("returns all months for available dates, only selected month (1)", () => {
			const args = {
				maxDate: dtz("2023-03-25"),
				minDate: dtz("2022-12-25"),
				selectedDate: dtz("2022-12-25"),
			};
			const { result } = renderHook(() => useCalendar(args));
			const { months } = result.current;

			expect(months).toHaveLength(1);
		});

		it("returns number of months for available dates", () => {
			const args = {
				availableDates: [dtz("2022-12-25"), dtz("2023-02-25")],
			};
			const { result } = renderHook(() => useCalendar(args));
			const { months } = result.current;

			expect(months).toHaveLength(1);
		});

		it("returns number of months for available dates", () => {
			const args = {
				maxDate: dtz("2023-03-25"),
				minDate: dtz("2022-12-25"),
				monthsToDisplay: Number.POSITIVE_INFINITY,
				selectedDate: dtz("2022-12-25"),
			};
			const { result } = renderHook(() => useCalendar(args));
			const { months } = result.current;

			expect(months).toHaveLength(4);
		});

		it("returns number of months for available dates", () => {
			const args = { monthsToDisplay: Number.POSITIVE_INFINITY };
			const { result } = renderHook(() => useCalendar(args));
			const { months } = result.current;

			expect(months).toHaveLength(1);
		});
	});

	describe("availableDates", () => {
		it("handles empty list of available dates", () => {
			const { result } = renderHook(() => useCalendar({ availableDates: [] }));
			const { current: actual } = result;

			expect(actual.months[0].weeks[0][5]!.isSelectable).toBeUndefined();
		});

		it("returns all months from now to single available date", () => {
			const availableDates = [dtz("2022-12-25")];
			const { result } = renderHook(() => useCalendar({ availableDates }));
			const { current: actual } = result;

			expect(actual.months).toHaveLength(1);
			expect(actual.months[0].month).toBe(6);
		});

		it("handles 60 days of available dates", () => {
			const today = new Date();
			const day = 24 * 60 * 60 * 1_000;
			const availableDates = Array.from({ length: 60 }).map((_, i) =>
				dtz(today.getTime() + i * day)
			);
			const { result } = renderHook(() => useCalendar({ availableDates }));
			const { current: actual } = result;

			expect(actual.months).toHaveLength(1);
			expect(actual.months[0].month).toBe(6);
		});

		it("returns getPrevMonthProps", () => {
			const args = {
				availableDates: [dtz("2022-12-25")],
			};
			const { result } = renderHook(() => useCalendar(args));
			const { getPrevMonthProps } = result.current;
			const actual = getPrevMonthProps();

			expect(actual.disabled).toBe(true);
		});

		it("returns getNextMonthProps", () => {
			const args = {
				availableDates: [dtz("2022-06-02")],
			};
			const { result } = renderHook(() => useCalendar(args));
			const { getNextMonthProps } = result.current;
			const actual = getNextMonthProps();

			expect(actual.disabled).toBe(true);
		});
	});

	describe("events", () => {
		it.each(["2022-07-17", "2022-07-17T09:00:00.000Z"])(
			"gets calendar with events: %s",
			(dtStart) => {
				interface MyEvent extends IEvent {
					title: string;
				}
				const events: MyEvent[] = [
					{
						start: dtz(dtStart),
						title: "Alice's Birthday Party",
					},
				];
				const { result } = renderHook(() => useCalendar({ events }));
				const { current: actual } = result;

				const expected = [
					{
						start: dtz(dtStart),
						title: "Alice's Birthday Party",
					},
				];
				expect(actual.months[0].weeks[3][0]!.events).toStrictEqual(expected);
			}
		);
	});

	describe("resetState", () => {
		it("goes back to first month", () => {
			const { result } = renderHook(() =>
				useCalendar({ maxDate: dtz("2022-08-31") })
			);
			const { getNextMonthProps: getForwardProps } = result.current;
			const button = getForwardProps();

			// goes to next month
			act(() => button.onClick());
			expect(result.current.months[0]).toMatchObject({ month: 7, year: 2022 });

			// goes back to initial month
			const { resetState } = result.current;
			act(() => resetState());
			expect(result.current.months[0]).toMatchObject({ month: 6, year: 2022 });
		});

		it("goes back to selected date", () => {
			const { result } = renderHook(() =>
				useCalendar({ selectedDate: dtz("2022-07-10") })
			);
			const { getDayProps } = result.current;
			const day: IDay = {
				date: dtz("2022-07-13"),
				isSelectable: true,
				isSelected: false,
			};
			const button = getDayProps({ day }) as IGetDayPropsReturns;

			// picks a day
			act(() => button.onClick());
			expect(result.current.months[0].weeks[2][3]).toStrictEqual({
				date: dtz("2022-07-13"),
				isSelectable: true,
				isSelected: true,
			});

			// goes back to initial selected day
			const { resetState } = result.current;
			act(() => resetState());
			expect(result.current.months[0].weeks[2][3]?.isSelected).toBeUndefined();
			expect(result.current.months[0].weeks[2][0]).toStrictEqual({
				date: dtz("2022-07-10"),
				isSelectable: true,
				isSelected: true,
				isWeekend: true,
			});
		});
	});
});
