import * as df from "./date-fns";
import type {
	IDay,
	IEvent,
	IMonth,
	IUseCalendarOptions,
	IWeek,
} from "./use-calendar.d";

export function isValidDate(d: string | number | Date | undefined) {
	if (d === null) return false;
	if (typeof d === "boolean") return false;
	if (typeof d === "undefined") return false;
	if (typeof d === "string") return /^\d{4}-\d{2}-\d{2}/.test(d);

	const dd = new Date(d);
	return dd instanceof Date && !Number.isNaN(dd);
}

export function getValidDate(d: string | number | Date | undefined) {
	if (typeof d === "undefined") return undefined;
	if (!isValidDate(d)) return undefined;

	return new Date(d);
}

interface IGetDayEventsArgs {
	date: Date;
	events?: IEvent[];
}

export function getDayEvents(args: IGetDayEventsArgs) {
	const { date, events = [] } = args;

	return events.filter((ev) =>
		df.isInRange({
			date,
			minDate: ev.start,
			maxDate: new Date(ev.end || ev.start),
		})
	);
}

interface INewDayArgs {
	availableDates?: Date[];
	date: Date;
	events?: IEvent[];
	maxDate?: Date;
	minDate?: Date;
	selected?: Date;
	isAdjacentMonth?: boolean;
}

export function getNewDay(args: INewDayArgs): IDay {
	const {
		availableDates,
		date,
		events = [],
		minDate,
		maxDate,
		selected,
		isAdjacentMonth,
	} = args;
	const today = new Date(Date.now());

	let isSelectable = df.isInRange({ date, minDate, maxDate });
	if (availableDates) {
		isSelectable = availableDates.findIndex((a) => df.isSameDay(date, a)) > -1;
	}

	const day: IDay = { date };
	if (isSelectable) {
		day.isSelectable = true;
	}
	if (selected && df.isSameDay(date, selected)) {
		day.isSelected = true;
	}
	if (df.isSameDay(date, today)) {
		day.isToday = true;
	}
	if (date.getDay() === 0 || date.getDay() === 6) {
		day.isWeekend = true;
	}
	if (isAdjacentMonth) {
		day.isAdjacentMonth = true;
	}

	const dayEvents = getDayEvents({ date, events });
	if (dayEvents.length > 0) {
		day.events = dayEvents;
	}

	return day;
}

interface IPadAdjacentMonthDaysArgs {
	availableDates?: Date[];
	date: Date;
	firstDayOfWeek: number;
	selected?: Date;
	week: IWeek;
}

export function padAdjacentMonthDays(args: IPadAdjacentMonthDaysArgs) {
	const { availableDates, week, firstDayOfWeek, date, selected } = args;
	const isFirstDayOfMonth = df.isFirstDayOfMonth(date);
	const isLastDayOfMonth = df.isLastDayOfMonth(date);
	const lastDayOfWeek = firstDayOfWeek - 1 >= 0 ? firstDayOfWeek - 1 : 6;
	const newWeek = week.slice();

	if (isFirstDayOfMonth) {
		const lastDays = [];
		let lastDate = df.getDateFrom({ date, days: -1 });
		while (lastDate.getDay() !== lastDayOfWeek) {
			lastDays.push(
				getNewDay({
					availableDates,
					date: df.getUTCDate(lastDate),
					isAdjacentMonth: true,
					selected,
				})
			);
			lastDate = df.getDateFrom({ date: lastDate, days: -1 });
		}
		newWeek.unshift(...lastDays.reverse());
	}

	if (isLastDayOfMonth) {
		const nextDays = [];
		let nextDate = df.getDateFrom({ date, days: 1 });
		while (nextDate.getDay() !== firstDayOfWeek) {
			nextDays.push(
				getNewDay({
					availableDates,
					date: df.getUTCDate(nextDate),
					isAdjacentMonth: true,
					selected,
				})
			);
			nextDate = df.getDateFrom({ date: nextDate, days: 1 });
		}
		newWeek.push(...nextDays);
	}

	return newWeek;
}

interface IGetWeekArgs {
	availableDates?: Date[];
	events?: IEvent[];
	firstDayOfWeek: number;
	maxDate?: Date;
	minDate?: Date;
	month: number;
	selected?: Date;
	year: number;
}

export function getWeeks(args: IGetWeekArgs): IWeek[] {
	const {
		availableDates,
		events,
		firstDayOfWeek,
		maxDate,
		minDate,
		month,
		selected,
		year,
	} = args;
	const days = df.getDaysOfMonth({ year, month });

	let currentWeekIndex = 0;
	const weeks: IWeek[] = [];
	for (const date of days) {
		weeks[currentWeekIndex] = weeks[currentWeekIndex] || [];
		const weekDay = date.getDay();

		// pad last days of last month
		if (date === days[0]) {
			weeks[currentWeekIndex] = padAdjacentMonthDays({
				availableDates,
				date,
				firstDayOfWeek,
				selected,
				week: weeks[currentWeekIndex],
			});
		}

		if (weekDay === firstDayOfWeek) {
			currentWeekIndex += 1;
			weeks[currentWeekIndex] = [];
		}

		weeks[currentWeekIndex].push(
			getNewDay({ availableDates, date, events, maxDate, minDate, selected })
		);

		// pad first days of next month
		if (date === days[days.length - 1]) {
			weeks[currentWeekIndex] = padAdjacentMonthDays({
				availableDates,
				date,
				firstDayOfWeek,
				selected,
				week: weeks[currentWeekIndex],
			});
		}
	}

	return weeks;
}

interface IGetCalendarMonthArgs {
	availableDates?: Date[];
	events?: IEvent[];
	firstDayOfWeek: number;
	maxDate?: Date;
	minDate?: Date;
	month: number;
	selected?: Date;
	year: number;
}

export function getCalendarMonth(args: IGetCalendarMonthArgs): IMonth {
	const { month, year } = args;
	const weeks = getWeeks(args);

	return { weeks, month, year };
}

export function getMinMaxDate(options?: Partial<IUseCalendarOptions>) {
	const {
		availableDates,
		minDate,
		maxDate,
		selectedDate = new Date(Date.now()),
	} = options || {};
	const today = new Date(Date.now());
	const date = getValidDate(selectedDate) || today;
	let min = minDate || new Date("0000-01-01");
	let max = maxDate || df.getDateFrom({ date, years: 1_000 });
	if (availableDates) {
		const { 0: firstDate, length, [length - 1]: lastDate } = availableDates;
		const firstDayOfCurrentMonth = df.getFirstDayOfMonth(today);
		const lastDayOfCurrentMonth = df.getLastDayOfMonth(today);

		min = firstDayOfCurrentMonth;
		if (firstDate) {
			min = new Date(
				Math.min(firstDate.getTime(), firstDayOfCurrentMonth.getTime())
			);
		}

		max = lastDayOfCurrentMonth;
		if (lastDate) {
			max = new Date(
				Math.max(lastDate.getTime(), lastDayOfCurrentMonth.getTime())
			);
		}
	}

	return { minDate: min, maxDate: max };
}
