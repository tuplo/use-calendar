import * as df from './date-fns';
import type { Day, Month, UseCalendarOptions, Week } from './calhook.d';

type PadAdjacentMonthDaysArgs = {
	week: Date[];
	firstDayOfWeek: number;
	date: Date;
};
export function padAdjacentMonthDays(args: PadAdjacentMonthDaysArgs) {
	const { week, firstDayOfWeek, date } = args;
	const isFirstDayOfMonth = df.isFirstDayOfMonth(date);
	const isLastDayOfMonth = df.isLastDayOfMonth(date);
	const lastDayOfWeek = firstDayOfWeek - 1 >= 0 ? firstDayOfWeek - 1 : 6;
	const newWeek = week.slice();

	if (isFirstDayOfMonth) {
		const lastDays = [];
		let lastDate = df.getDateFrom({ date, days: -1 });
		while (lastDate.getDay() !== lastDayOfWeek) {
			lastDays.push(null);
			lastDate = df.getDateFrom({ date: lastDate, days: -1 });
		}
		newWeek.unshift(...lastDays.reverse());
	}

	if (isLastDayOfMonth) {
		const nextDays = [];
		let nextDate = df.getDateFrom({ date, days: 1 });
		while (nextDate.getDay() !== firstDayOfWeek) {
			nextDays.push(null);
			nextDate = df.getDateFrom({ date: nextDate, days: 1 });
		}
		newWeek.push(...nextDays);
	}

	return newWeek;
}

type NewDayArgs = {
	availableDates?: Date[];
	date: Date;
	minDate?: Date;
	maxDate?: Date;
	selected?: Date;
};
export function newDay(args: NewDayArgs): Day {
	const { availableDates, date, minDate, maxDate, selected } = args;
	const today = new Date();

	let isSelectable = df.isInRange({ date, minDate, maxDate });
	if (availableDates) {
		isSelectable = availableDates.findIndex((a) => df.isSameDay(date, a)) > -1;
	}

	return {
		date,
		isToday: df.isSameDay(date, today),
		isSelectable,
		isSelected: selected ? df.isSameDay(date, args.selected) : false,
	};
}

type GetWeekArgs = {
	availableDates?: Date[];
	firstDayOfWeek: number;
	maxDate?: Date;
	minDate?: Date;
	month: number;
	selected?: Date;
	year: number;
};
export function getWeeks(args: GetWeekArgs): Week[] {
	const {
		availableDates,
		year,
		month,
		firstDayOfWeek,
		minDate,
		maxDate,
		selected,
	} = args;
	const days = df.getDaysOfMonth({ year, month });

	let currentWeekIndex = 0;
	const weeks = [];
	for (const date of days) {
		weeks[currentWeekIndex] = weeks[currentWeekIndex] || [];
		const weekDay = date.getDay();

		// pad last days of last month
		if (date === days[0]) {
			weeks[currentWeekIndex] = padAdjacentMonthDays({
				week: weeks[currentWeekIndex],
				firstDayOfWeek,
				date,
			});
		}

		if (weekDay === firstDayOfWeek) {
			currentWeekIndex += 1;
			weeks[currentWeekIndex] = [];
		}
		weeks[currentWeekIndex].push(
			newDay({ date, minDate, maxDate, availableDates, selected })
		);

		// pad first days of next month
		if (date === days[days.length - 1]) {
			weeks[currentWeekIndex] = padAdjacentMonthDays({
				week: weeks[currentWeekIndex],
				firstDayOfWeek,
				date,
			});
		}
	}

	return weeks;
}

type GetCalendarMonthArgs = {
	availableDates?: Date[];
	firstDayOfWeek: number;
	maxDate?: Date;
	minDate?: Date;
	month: number;
	selected?: Date;
	year: number;
};
export function getCalendarMonth(args: GetCalendarMonthArgs): Month {
	const { month, year } = args;
	const weeks = getWeeks(args);

	return { weeks, month, year };
}

export function getMinMaxDate(options?: Partial<UseCalendarOptions>) {
	const {
		availableDates,
		minDate,
		maxDate,
		selectedDate = new Date(),
	} = options || {};
	let min = minDate || df.getFirstDayOfMonth(selectedDate);
	let max = maxDate || df.getLastDayOfMonth(selectedDate);
	if (availableDates) {
		const { 0: firstDate, length, [length - 1]: lastDate } = availableDates;
		min = firstDate;
		max = lastDate;
	}

	return { minDate: min, maxDate: max };
}
