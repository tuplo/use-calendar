import { vi } from "vitest";

import { dtz } from "./date-fns";
import { buildGetDayProps, buildGetPrevNextMonthProps } from "./props";
import { type IMonth } from "./use-calendar.d";

const commonProps = {
	onClick: expect.any(Function),
	role: "button",
	type: "button",
};

describe("props functions", () => {
	const dateNowSpy = vi
		.spyOn(Date, "now")
		.mockReturnValue(new Date("2022-07-02T00:00:00").getTime());

	afterAll(() => {
		dateNowSpy.mockRestore();
	});

	describe("buildGetDayProps", () => {
		it("builds day component props", () => {
			const fn = buildGetDayProps({ setSelected: vi.fn() });
			const day = {
				date: dtz(),
				isSelected: false,
				isToday: false,
			};
			const actual = fn({ day });

			const expected = {
				"aria-label": "July 2, 2022",
				"aria-selected": false,
				disabled: true,
				onClick: expect.any(Function),
				role: "button",
			};
			expect(actual).toStrictEqual(expected);
		});

		it.each([
			[true, 1],
			[false, 0],
		])(
			"calls/doesn't setSelected when day is selectable: %s",
			(isSelectable, expected) => {
				const setSelectedSpy = vi.fn();
				const fn = buildGetDayProps({ setSelected: setSelectedSpy });
				const day = {
					date: dtz(),
					isSelectable,
					isSelected: false,
					isToday: false,
				};
				const actual = fn({ day });
				actual.onClick();

				expect(setSelectedSpy).toHaveBeenCalledTimes(expected);
			}
		);

		it("null day", () => {
			const setSelectedSpy = vi.fn();
			const fn = buildGetDayProps({ setSelected: setSelectedSpy });
			// eslint-disable-next-line unicorn/no-null
			const actual = fn({ day: null });

			actual.onClick();

			expect(setSelectedSpy).toHaveBeenCalledTimes(0);
		});

		describe("locale", () => {
			const originalNavigator = JSON.parse(JSON.stringify(global.navigator));

			afterEach(() => {
				Object.defineProperty(global, "navigator", {
					value: originalNavigator,
					writable: true,
				});
			});

			it("uses locale provided as option", () => {
				const fn = buildGetDayProps({ locale: "ar", setSelected: vi.fn() });
				const day = {
					date: dtz(),
					isSelectable: true,
					isSelected: false,
					isToday: false,
				};
				const actual = fn({ day });

				const expected = "٢ يوليو ٢٠٢٢";
				expect(actual["aria-label"]).toBe(expected);
			});

			it.each([
				["ar", "٢ يوليو ٢٠٢٢"],
				[undefined, "July 2, 2022"],
			])("uses navigator.language as locale: %s", (language, expected) => {
				Object.defineProperty(global.navigator, "language", {
					configurable: true,
					value: language,
					writable: false,
				});
				const fn = buildGetDayProps({ setSelected: vi.fn() });
				const day = {
					date: dtz(),
					isSelectable: true,
					isSelected: false,
					isToday: false,
				};
				const actual = fn({ day });

				expect(actual["aria-label"]).toBe(expected);
			});

			it("still works when not on browser(?): defaults to en", () => {
				Object.defineProperty(global, "navigator", {
					value: undefined,
					writable: true,
				});

				const fn = buildGetDayProps({ setSelected: vi.fn() });
				const day = {
					date: dtz(),
					isSelectable: true,
					isSelected: false,
					isToday: false,
				};
				const actual = fn({ day });

				const expected = "July 2, 2022";
				expect(actual["aria-label"]).toBe(expected);
			});
		});

		describe("onDateSelected", () => {
			it("when a callback is provided, call it on click", () => {
				const onDateSelectedSpy = vi.fn();
				const fn = buildGetDayProps({
					onDateSelected: onDateSelectedSpy,
					setSelected: vi.fn(),
				});
				const day = {
					date: dtz(),
					isSelectable: true,
					isSelected: false,
					isToday: false,
				};
				const actual = fn({ day });
				actual.onClick();

				expect(onDateSelectedSpy).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("getPrevMonth", () => {
		it("builds gets back props function", () => {
			const months = [{ month: 6, year: 2022 }] as IMonth[];
			const fn = buildGetPrevNextMonthProps({
				direction: "back",
				months,
				monthsInRange: [{ month: 5, year: 2022 }],
				setVisibleMonth: vi.fn(),
			});
			const actual = fn();

			const expected = {
				...commonProps,
				"aria-label": "Go back 1 month",
				disabled: false,
			};
			expect(actual).toStrictEqual(expected);
		});

		it("disabled previous month button", () => {
			const months = [{ month: 6, year: 2022 }] as IMonth[];
			const fn = buildGetPrevNextMonthProps({
				direction: "back",
				months,
				monthsInRange: [{ month: 6, year: 2022 }],
				setVisibleMonth: vi.fn(),
			});
			const actual = fn();
			expect(actual.disabled).toBe(true);
		});

		it("handles empty list of months", () => {
			const months: IMonth[] = [];
			const fn = buildGetPrevNextMonthProps({
				direction: "back",
				months,
				monthsInRange: [{ month: 5, year: 2022 }],
				setVisibleMonth: vi.fn(),
			});
			const actual = fn();

			const expected = {};
			expect(actual).toStrictEqual(expected);
		});
	});

	describe("getNextMonth", () => {
		it("builds gets back props function", () => {
			const months = [{ month: 6, year: 2022 }] as IMonth[];
			const fn = buildGetPrevNextMonthProps({
				direction: "forward",
				months,
				monthsInRange: [
					{ month: 5, year: 2022 },
					{ month: 6, year: 2022 },
					{ month: 7, year: 2022 },
				],
				setVisibleMonth: vi.fn(),
			});
			const actual = fn();

			const expected = {
				...commonProps,
				"aria-label": "Go forward 1 month",
				disabled: false,
			};
			expect(actual).toStrictEqual(expected);
		});

		it("disabled next button", () => {
			const months = [{ month: 6, year: 2022 }] as IMonth[];
			const fn = buildGetPrevNextMonthProps({
				direction: "forward",
				months,
				monthsInRange: [
					{ month: 5, year: 2022 },
					{ month: 6, year: 2022 },
				],
				setVisibleMonth: vi.fn(),
			});
			const actual = fn();

			expect(actual.disabled).toBe(true);
		});
	});

	describe("onClick", () => {
		it.each([
			["back", "2022-06-01"],
			["forward", "2022-08-01"],
		])(
			"when clicking %s, set month as visible",
			(direction, expectedDateStr) => {
				const setVisibleMonthSpy = vi.fn();
				const months = [{ month: 6, year: 2022 }] as IMonth[];
				const fn = buildGetPrevNextMonthProps({
					direction,
					months,
					monthsInRange: [
						{ month: 5, year: 2022 },
						{ month: 6, year: 2022 },
						{ month: 7, year: 2022 },
					],
					setVisibleMonth: setVisibleMonthSpy,
				});
				const actual = fn();
				actual.onClick();

				const expected = dtz(expectedDateStr);
				expect(setVisibleMonthSpy).toHaveBeenCalledTimes(1);
				expect(setVisibleMonthSpy).toHaveBeenCalledWith(expected);
			}
		);

		it.each([["back"], ["forward"]])(
			"when clicking disabled %s, do nothing",
			(direction) => {
				const setVisibleMonthSpy = vi.fn();
				const months = [{ month: 6, year: 2022 }] as IMonth[];
				const fn = buildGetPrevNextMonthProps({
					direction,
					months,
					monthsInRange: [{ month: 6, year: 2022 }],
					setVisibleMonth: setVisibleMonthSpy,
				});
				const actual = fn();
				actual.onClick();

				expect(setVisibleMonthSpy).toHaveBeenCalledTimes(0);
			}
		);
	});
});
