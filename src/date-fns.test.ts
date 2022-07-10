/* eslint-disable jest/no-conditional-in-test */
import * as df from './date-fns';

describe('date-fns', () => {
	it('gets all days in a month', () => {
		const days = df.getDaysOfMonth({ month: 0, year: 2020 });
		expect(days).toHaveLength(31);
		expect(days[0]).toStrictEqual(new Date('2020-01-01'));
		expect(days[30]).toStrictEqual(new Date('2020-01-31'));
	});

	it.each([
		['previous date', '2020-01-01', { days: -1 }, '2019-12-31'],
		['previous date', '2020-03-01', { days: -1 }, '2020-02-29'],
		['previous week', '2022-07-02', { weeks: -1 }, '2022-06-25'],
		['previous week', '2022-01-03', { weeks: -1 }, '2021-12-27'],
		['next day', '2020-01-31', { days: 1 }, '2020-02-01'],
		['next day', '2020-01-31', { days: 1 }, '2020-02-01'],
		['next week', '2020-01-31', { weeks: 1 }, '2020-02-07'],
		['next week', '2022-12-29', { weeks: 1 }, '2023-01-05'],
	])('getDateFrom: %s %s', (_, dateStr, args, expected) => {
		const actual = df.getDateFrom({ date: new Date(dateStr), ...args });
		expect(actual).toStrictEqual(new Date(expected));
	});

	describe('getLastDayOfMonth', () => {
		it.each([
			['2020-01-01', '2020-01-31'],
			['2020-12-10', '2020-12-31'],
			['2020-02-20', '2020-02-29'],
			['2022-02-28', '2022-02-28'],
		])('gets last day of month: %s', (dateStr, expectedStr) => {
			const actual = df.getLastDayOfMonth(new Date(dateStr));
			const expected = new Date(expectedStr);
			expect(actual).toStrictEqual(expected);
		});
	});

	describe('isInRange', () => {
		it.each([
			['2022-07-02', undefined, undefined, true],
			['2022-07-10', '2022-07-01', undefined, true],
			['2022-07-10', undefined, '2022-07-31', true],
			['2022-07-10', '2022-07-01', '2022-07-31', true],
			['2022-08-12', undefined, undefined, false],
			['2022-08-12', '2022-07-01', undefined, false],
			['2022-08-12', undefined, '2022-07-31', false],
			['2022-08-12', '2022-07-01', '2022-07-31', false],
		])('is in range: %s', (dateStr, minDate, maxDate, expected) => {
			jest.useFakeTimers().setSystemTime(new Date('2022-07-02'));
			const actual = df.isInRange({
				date: new Date(dateStr),
				minDate: minDate ? new Date(minDate) : undefined,
				maxDate: maxDate ? new Date(maxDate) : undefined,
			});
			expect(actual).toBe(expected);
		});
	});

	describe('getMonthsInRange', () => {
		it('get months in range', () => {
			const actual = df.getMonthsInRange({
				start: new Date('2022-06-14'),
				end: new Date('2022-08-03'),
			});

			const expected = [
				{ month: 5, year: 2022 },
				{ month: 6, year: 2022 },
				{ month: 7, year: 2022 },
			];
			expect(actual).toStrictEqual(expected);
		});

		it('get months in range ending on first of month', () => {
			const actual = df.getMonthsInRange({
				start: new Date('2022-06-14'),
				end: new Date('2022-08-01'),
			});

			const expected = [
				{ month: 5, year: 2022 },
				{ month: 6, year: 2022 },
				{ month: 7, year: 2022 },
			];
			expect(actual).toStrictEqual(expected);
		});

		it('get months in range starting on last of month', () => {
			const actual = df.getMonthsInRange({
				start: new Date('2022-06-30'),
				end: new Date('2022-07-01'),
			});

			const expected = [
				{ month: 5, year: 2022 },
				{ month: 6, year: 2022 },
			];
			expect(actual).toStrictEqual(expected);
		});

		it('get months in range with no start date', () => {
			const actual = df.getMonthsInRange({
				end: new Date('2022-08-10'),
			});

			const expected = [
				{ month: 6, year: 2022 },
				{ month: 7, year: 2022 },
			];
			expect(actual).toStrictEqual(expected);
		});
	});
});
