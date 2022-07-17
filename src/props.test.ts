import type { Month } from './calhook';
import { buildGetBackForwardProps, buildGetDayProps } from './props';

const commonProps = {
	role: 'button',
	type: 'button',
	onClick: expect.any(Function),
};

describe('props functions', () => {
	describe('buildGetDayProps', () => {
		it.each([
			[true, 1],
			[false, 0],
		])(
			"calls/doesn't setSelected when day is selectable: %s",
			(isSelectable, expected) => {
				const setSelectedSpy = jest.fn();
				const fn = buildGetDayProps({ setSelected: setSelectedSpy });
				const day = {
					date: new Date(Date.now()),
					isToday: false,
					isSelectable,
					isSelected: false,
				};
				const actual = fn({ day });
				actual.onClick();

				expect(setSelectedSpy).toHaveBeenCalledTimes(expected);
			}
		);

		it('null day', () => {
			const setSelectedSpy = jest.fn();
			const fn = buildGetDayProps({ setSelected: setSelectedSpy });
			const actual = fn({ day: null });

			actual.onClick();

			expect(setSelectedSpy).toHaveBeenCalledTimes(0);
		});

		describe('locale', () => {
			const dateNowSpy = jest
				.spyOn(Date, 'now')
				.mockReturnValue(new Date('2022-12-25').getTime());
			const originalNavigator = JSON.parse(JSON.stringify(global.navigator));

			afterEach(() => {
				Object.defineProperty(global, 'navigator', {
					writable: true,
					value: originalNavigator,
				});
			});

			afterAll(() => {
				dateNowSpy.mockRestore();
			});

			it('uses locale provided as option', () => {
				const fn = buildGetDayProps({ setSelected: jest.fn(), locale: 'ar' });
				const day = {
					date: new Date(Date.now()),
					isToday: false,
					isSelectable: true,
					isSelected: false,
				};
				const actual = fn({ day });

				const expected = '٢٥ ديسمبر ٢٠٢٢';
				expect(actual['aria-label']).toBe(expected);
			});

			it.each([
				['ar', '٢٥ ديسمبر ٢٠٢٢'],
				[undefined, 'December 25, 2022'],
			])('uses navigator.language as locale: %s', (language, expected) => {
				Object.defineProperty(global.navigator, 'language', {
					configurable: true,
					writable: false,
					value: language,
				});
				const fn = buildGetDayProps({ setSelected: jest.fn() });
				const day = {
					date: new Date(Date.now()),
					isToday: false,
					isSelectable: true,
					isSelected: false,
				};
				const actual = fn({ day });

				expect(actual['aria-label']).toBe(expected);
			});

			it('still works when not on browser(?): defaults to en', () => {
				Object.defineProperty(global, 'navigator', {
					value: undefined,
					writable: true,
				});

				const fn = buildGetDayProps({ setSelected: jest.fn() });
				const day = {
					date: new Date(Date.now()),
					isToday: false,
					isSelectable: true,
					isSelected: false,
				};
				const actual = fn({ day });

				const expected = 'December 25, 2022';
				expect(actual['aria-label']).toBe(expected);
			});
		});

		describe('onDateSelected', () => {
			it('when a callback is provided, call it on click', () => {
				const onDateSelectedSpy = jest.fn();
				const fn = buildGetDayProps({
					setSelected: jest.fn(),
					onDateSelected: onDateSelectedSpy,
				});
				const day = {
					date: new Date(Date.now()),
					isToday: false,
					isSelectable: true,
					isSelected: false,
				};
				const actual = fn({ day });
				actual.onClick();

				expect(onDateSelectedSpy).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('getBackProps', () => {
		it('builds gets back props function', () => {
			const months = [{ month: 6, year: 2022 }] as Month[];
			const fn = buildGetBackForwardProps({
				direction: 'back',
				months,
				minDate: new Date(2022, 5, 1),
				setVisibleMonth: jest.fn(),
			});
			const actual = fn();

			const expected = {
				...commonProps,
				'aria-label': 'Go back 1 month',
				disabled: false,
			};
			expect(actual).toStrictEqual(expected);
		});

		it('disabled back button', () => {
			const months = [{ month: 6, year: 2022 }] as Month[];
			const fn = buildGetBackForwardProps({
				direction: 'back',
				months,
				minDate: new Date(2022, 6, 1),
				setVisibleMonth: jest.fn(),
			});
			const actual = fn();

			expect(actual.disabled).toBe(true);
		});

		it('handles empty list of months', () => {
			const months: Month[] = [];
			const fn = buildGetBackForwardProps({
				direction: 'back',
				months,
				minDate: new Date(2022, 5, 1),
				setVisibleMonth: jest.fn(),
			});
			const actual = fn();

			const expected = {};
			expect(actual).toStrictEqual(expected);
		});
	});

	describe('getForwardProps', () => {
		it('builds gets back props function', () => {
			const months = [{ month: 6, year: 2022 }] as Month[];
			const fn = buildGetBackForwardProps({
				direction: 'forward',
				months,
				maxDate: new Date(2022, 7, 1),
				setVisibleMonth: jest.fn(),
			});
			const actual = fn();

			const expected = {
				...commonProps,
				'aria-label': 'Go forward 1 month',
				disabled: false,
			};
			expect(actual).toStrictEqual(expected);
		});

		it('disabled forward button', () => {
			const months = [{ month: 6, year: 2022 }] as Month[];
			const fn = buildGetBackForwardProps({
				direction: 'forward',
				months,
				maxDate: new Date(2022, 6, 31),
				setVisibleMonth: jest.fn(),
			});
			const actual = fn();

			expect(actual.disabled).toBe(true);
		});
	});

	describe('onClick', () => {
		it.each([
			['back', '2022-06-01'],
			['forward', '2022-08-01'],
		])(
			'when clicking %s, set month as visible',
			(direction, expectedDateStr) => {
				const setVisibleMonthSpy = jest.fn();
				const months = [{ month: 6, year: 2022 }] as Month[];
				const fn = buildGetBackForwardProps({
					direction,
					months,
					minDate: new Date(2022, 5, 1),
					maxDate: new Date(2022, 7, 30),
					setVisibleMonth: setVisibleMonthSpy,
				});
				const actual = fn();
				actual.onClick();

				const expected = new Date(expectedDateStr);
				expect(setVisibleMonthSpy).toHaveBeenCalledTimes(1);
				expect(setVisibleMonthSpy).toHaveBeenCalledWith(expected);
			}
		);

		it.each([['back'], ['forward']])(
			'when clicking disabled %s, do nothing',
			(direction) => {
				const setVisibleMonthSpy = jest.fn();
				const months = [{ month: 6, year: 2022 }] as Month[];
				const fn = buildGetBackForwardProps({
					direction,
					months,
					minDate: new Date(2022, 6, 1),
					maxDate: new Date(2022, 6, 31),
					setVisibleMonth: setVisibleMonthSpy,
				});
				const actual = fn();
				actual.onClick();

				expect(setVisibleMonthSpy).toHaveBeenCalledTimes(0);
			}
		);
	});
});
