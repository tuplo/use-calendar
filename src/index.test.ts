import { renderHook } from '@testing-library/react';

import { useCalendar } from './index';

describe('calhook', () => {
	jest.useFakeTimers().setSystemTime(new Date('2022-07-02'));

	describe('default', () => {
		it('returns default props', () => {
			const hook = renderHook(() => useCalendar());
			const { current: actual } = hook.result;

			const expected = {
				getDayProps: expect.any(Function),
				getBackProps: expect.any(Function),
				getForwardProps: expect.any(Function),
				months: [
					{
						month: 6,
						year: 2022,
						weeks: [
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
						),
					},
				],
			};
			expect(actual).toStrictEqual(expected);
		});

		it('pads last days of last month', () => {
			const hook = renderHook(() =>
				useCalendar({
					minDate: new Date('2022-07-01'),
					maxDate: new Date('2022-07-31'),
				})
			);
			const { current: actual } = hook.result;

			const expected = [
				null,
				null,
				null,
				null,
				null,
				{
					date: new Date('2022-07-01'),
					isToday: false,
					isSelectable: true,
					isSelected: false,
				},
				{
					date: new Date('2022-07-02'),
					isToday: true,
					isSelectable: true,
					isSelected: false,
				},
			];
			expect(actual.months[0].weeks[0]).toStrictEqual(expected);
		});

		it('pads first days of next month', () => {
			const hook = renderHook(() =>
				useCalendar({
					minDate: new Date('2022-07-01'),
					maxDate: new Date('2022-07-31'),
				})
			);
			const { current: actual } = hook.result;

			const expected = [
				{
					date: new Date('2022-07-31'),
					isToday: false,
					isSelectable: true,
					isSelected: false,
				},
				null,
				null,
				null,
				null,
				null,
				null,
			];
			expect(actual.months[0].weeks[5]).toStrictEqual(expected);
		});
	});

	describe('firstDayOfWeek', () => {
		it('returns weeks starting', () => {
			const hook = renderHook(() =>
				useCalendar({
					firstDayOfWeek: 1,
					minDate: new Date('2022-07-01'),
					maxDate: new Date('2022-07-31'),
				})
			);
			const { current: actual } = hook.result;

			const expected = {
				getDayProps: expect.any(Function),
				getBackProps: expect.any(Function),
				getForwardProps: expect.any(Function),
				months: [
					{
						month: 6,
						year: 2022,
						weeks: [
							'2022-07-01',
							'2022-07-04',
							'2022-07-11',
							'2022-07-18',
							'2022-07-25',
						].map((dateStr) =>
							expect.arrayContaining([
								{
									date: new Date(dateStr),
									isToday: false,
									isSelectable: true,
									isSelected: false,
								},
							])
						),
					},
				],
			};
			expect(actual).toStrictEqual(expected);
		});

		it('pads last days of last month', () => {
			const hook = renderHook(() =>
				useCalendar({
					firstDayOfWeek: 1,
					minDate: new Date('2022-07-01'),
					maxDate: new Date('2022-07-31'),
				})
			);
			const { current: actual } = hook.result;

			const expected = [
				null,
				null,
				null,
				null,
				{
					date: new Date('2022-07-01'),
					isToday: false,
					isSelectable: true,
					isSelected: false,
				},
				{
					date: new Date('2022-07-02'),
					isToday: true,
					isSelectable: true,
					isSelected: false,
				},
				{
					date: new Date('2022-07-03'),
					isToday: false,
					isSelectable: true,
					isSelected: false,
				},
			];
			expect(actual.months[0].weeks[0]).toStrictEqual(expected);
		});

		it('pads first days of next month', () => {
			const hook = renderHook(() =>
				useCalendar({
					firstDayOfWeek: 1,
					minDate: new Date('2022-07-01'),
					maxDate: new Date('2022-07-31'),
				})
			);
			const { current: actual } = hook.result;

			const expected = [
				'2022-07-25',
				'2022-07-26',
				'2022-07-27',
				'2022-07-28',
				'2022-07-29',
				'2022-07-30',
				'2022-07-31',
			].map((dateStr) => ({
				date: new Date(dateStr),
				isToday: false,
				isSelectable: true,
				isSelected: false,
			}));
			expect(actual.months[0].weeks[4]).toStrictEqual(expected);
		});
	});

	describe('with selected', () => {
		it('returns selected date', () => {
			const hook = renderHook(() =>
				useCalendar({ selectedDate: new Date('2022-07-03') })
			);
			const { current: actual } = hook.result;

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(actual.months[0].weeks[1][0]!.isSelected).toBe(true);
		});
	});
});
