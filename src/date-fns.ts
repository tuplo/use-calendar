export function dtz(date?: string | Date | number) {
	if (typeof date === "undefined") {
		return new Date(Date.now());
	}

	const d = new Date(date);
	d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
	return d;
}

type IGetDateFromArgs = {
	date: Date;
	days?: number;
	weeks?: number;
	months?: number;
	years?: number;
};

export function getDateFrom(args: IGetDateFromArgs) {
	const { date, days, weeks, months, years } = args;

	let d = days || 0;
	if (weeks) {
		d = weeks * 7;
	}

	if (d) {
		const ms = d * 24 * 60 * 60 * 1_000;
		return new Date(date.getTime() + ms);
	}

	if (months) {
		const dayOfMonth = date.getDate();
		const endOfDesiredMonth = new Date(date.getTime());
		endOfDesiredMonth.setMonth(date.getMonth() + months + 1, 0);
		const daysInMonth = endOfDesiredMonth.getDate();
		if (dayOfMonth >= daysInMonth) {
			return endOfDesiredMonth;
		}

		return new Date(
			endOfDesiredMonth.getFullYear(),
			endOfDesiredMonth.getMonth(),
			dayOfMonth
		);
	}

	if (years) {
		const newDate = new Date(date.getTime());
		newDate.setFullYear(
			date.getFullYear() + years,
			date.getMonth(),
			date.getDate()
		);

		return newDate;
	}

	return date;
}

export function differenceInMonths(d1: Date, d2: Date) {
	let months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months -= d1.getMonth();
	months += d2.getMonth();

	return months <= 0 ? 0 : months;
}

export function isSameDay(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

export function isLastDayOfMonth(date: Date) {
	return getDateFrom({ date, days: 1 }).getMonth() !== date.getMonth();
}

export function isFirstDayOfMonth(date: Date) {
	return date.getDate() === 1;
}

type IGetDaysOfMonthArgs = {
	year: number;
	month: number;
};

export function getDaysOfMonth(args: IGetDaysOfMonthArgs) {
	const { year, month } = args;
	let date = new Date(year, month, 1);

	const days: Date[] = [];
	while (date.getMonth() === month) {
		days.push(date);
		date = getDateFrom({ date, days: 1 });
	}

	return days;
}

type IGetMonthsInRangeArgs = {
	start?: Date;
	end?: Date;
};

export function getMonthsInRange(args: IGetMonthsInRangeArgs) {
	const { start = new Date(Date.now()), end = new Date(Date.now()) } = args;
	const months = [];

	// include last date in range
	const dayAfterEnd = getDateFrom({ date: end, days: 1 });
	let date = new Date(start);
	while (!isSameDay(date, dayAfterEnd)) {
		const year = date.getFullYear();
		const month = date.getMonth();
		const index = months.findIndex((m) => m.year === year && m.month === month);
		if (index === -1) {
			months.push({ year, month });
		}
		date = getDateFrom({ date, days: 1 });
	}

	return months;
}

export function getFirstDayOfMonth(date: Date = new Date(Date.now())) {
	const month = date.getMonth();
	const year = date.getFullYear();
	return new Date(year, month, 1);
}

export function getLastDayOfMonth(date: Date = new Date(Date.now())) {
	const month = date.getMonth();
	const year = date.getFullYear();
	return new Date(year, month + 1, 0);
}

type IIsInRangeArgs = {
	date: Date;
	minDate?: Date;
	maxDate?: Date;
};

export function isInRange(args: IIsInRangeArgs) {
	const {
		date,
		minDate = new Date(Date.now()),
		maxDate = getLastDayOfMonth(minDate),
	} = args;

	const start = new Date(minDate);
	start.setHours(0, 0, 0, 0);
	const end = new Date(maxDate);
	end.setHours(23, 59, 59, 999);

	return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}
