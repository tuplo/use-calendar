import type { Month } from './calhook';
import { buildGetBackForwardProps } from './props';

const commonProps = {
	role: 'button',
	type: 'button',
	onClick: expect.any(Function),
};

describe('props functions', () => {
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
