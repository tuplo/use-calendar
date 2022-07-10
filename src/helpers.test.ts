import * as df from './date-fns';
import {
	padAdjacentMonthDays,
	getWeeks,
	newDay,
	getMinMaxDate,
} from './helpers';

describe('use-calendar helpers', () => {
	jest.useFakeTimers().setSystemTime(new Date('2022-07-02'));

	describe('pad adjacent month days', () => {
		it.each([
			['default', [], '2022-07-01', 0, [null, null, null, null, null]],
			['firstDayOfWeek=1', [], '2022-07-01', 1, [null, null, null, null]],
		])(
			'pads last days of previous month: %s',
			(_, week, strDate, firstDayOfWeek, expected) => {
				const date = new Date(strDate);
				const actual = padAdjacentMonthDays({ week, firstDayOfWeek, date });
				expect(actual).toStrictEqual(expected);
			}
		);

		it.each([
			['default', [], '2022-07-31', 0, [null, null, null, null, null, null]],
			['default', [], '2022-08-31', 0, [null, null, null]],
			['firstDayOfWeek=1', [], '2022-07-31', 1, []],
		])(
			'pads first days of next month: %s',
			(_, week, strDate, firstDayOfWeek, expected) => {
				const date = new Date(strDate);
				const actual = padAdjacentMonthDays({ week, firstDayOfWeek, date });
				expect(actual).toStrictEqual(expected);
			}
		);
	});

	describe('getWeeks', () => {
		it('gets weeks for a month', () => {
			const actual = getWeeks({
				year: 2022,
				month: 6,
				firstDayOfWeek: 0,
				minDate: new Date('2022-07-01'),
				maxDate: new Date('2022-07-31'),
			});

			const expected = [
				'2022-07-01',
				'2022-07-03',
				'2022-07-10',
				'2022-07-17',
				'2022-07-24',
				'2022-07-31',
			].map((dateStr) =>
				expect.arrayContaining([
					{
						date: new Date(dateStr),
						isToday: false,
						isSelectable: true,
						isSelected: false,
					},
				])
			);
			expect(actual).toStrictEqual(expected);
		});
	});

	describe('newDay', () => {
		it.each([
			['2022-07-02', { isSelectable: true, isToday: true }],
			['2022-07-11', { isSelectable: true, isToday: false }],
			['2022-06-11', { isSelectable: false, isToday: false }],
		])('creates a new Day object: %s', (dateStr, expectedAttrs) => {
			const actual = newDay({
				date: new Date(dateStr),
				minDate: new Date('2022-07-01'),
				maxDate: new Date('2022-07-31'),
			});

			const expected = {
				...expectedAttrs,
				date: new Date(dateStr),
				isSelected: false,
			};
			expect(actual).toStrictEqual(expected);
		});

		it.each([
			['2022-07-02', { isSelectable: true, isToday: true }],
			['2022-07-11', { isSelectable: true, isToday: false }],
			['2022-06-11', { isSelectable: false, isToday: false }],
		])(
			'creates a new Day object with available dates list: %s',
			(dateStr, expectedAttrs) => {
				const actual = newDay({
					date: new Date(dateStr),
					availableDates: df.getDaysOfMonth({ year: 2022, month: 6 }),
				});

				const expected = {
					...expectedAttrs,
					date: new Date(dateStr),
					isSelected: false,
				};
				expect(actual).toStrictEqual(expected);
			}
		);

		it('creates a selected Day', () => {
			const actual = newDay({
				date: new Date('2022-07-02'),
				availableDates: df.getDaysOfMonth({ year: 2022, month: 6 }),
				selected: new Date('2022-07-02'),
			});

			expect(actual.isSelectable).toBe(true);
		});
	});

	describe('getMinMaxDate', () => {
		it('gets min and max dates: default', () => {
			const actual = getMinMaxDate();

			const expected = {
				minDate: new Date('2022-07-01'),
				maxDate: new Date('2022-07-31'),
			};
			expect(actual).toStrictEqual(expected);
		});
		it('gets min and max dates: with given min/max Date', () => {
			const actual = getMinMaxDate({
				minDate: new Date('2022-07-01'),
				maxDate: new Date('2022-07-31'),
			});

			const expected = {
				minDate: new Date('2022-07-01'),
				maxDate: new Date('2022-07-31'),
			};
			expect(actual).toStrictEqual(expected);
		});

		it('gets min and max dates: with availableDates', () => {
			const actual = getMinMaxDate({
				availableDates: df.getDaysOfMonth({ year: 2022, month: 9 }),
			});

			const expected = {
				minDate: new Date('2022-10-01'),
				maxDate: new Date('2022-10-31'),
			};
			expect(actual).toStrictEqual(expected);
		});
	});
});
