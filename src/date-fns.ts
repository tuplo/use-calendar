type GetDateFromArgs = {
	date: Date;
	days?: number;
	weeks?: number;
	months?: number;
	years?: number;
};
export function getDateFrom(args: GetDateFromArgs) {
	const { date, days, weeks, months, years } = args;
	let d = days || 0;
	if (weeks) d = weeks * 7;
	if (months) d = months * 30;
	if (years) d = years * 365;

	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + d);
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

type GetDaysOfMonthArgs = {
	year: number;
	month: number;
};
export function getDaysOfMonth(args: GetDaysOfMonthArgs) {
	const { year, month } = args;
	let date = new Date(year, month, 1);

	const days: Date[] = [];
	while (date.getMonth() === month) {
		days.push(date);
		date = getDateFrom({ date, days: 1 });
	}

	return days;
}

type GetMonthsInRangeArgs = { start?: Date; end?: Date };
export function getMonthsInRange(args: GetMonthsInRangeArgs) {
	const { start = new Date(), end = new Date() } = args;
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

export function getFirstDayOfMonth(date: Date = new Date()) {
	const month = date.getMonth();
	const year = date.getFullYear();
	return new Date(year, month, 1);
}

export function getLastDayOfMonth(date: Date = new Date()) {
	const month = date.getMonth();
	const year = date.getFullYear();
	return new Date(year, month + 1, 0);
}

type IsInRangeArgs = { date: Date; minDate?: Date; maxDate?: Date };
export function isInRange(args: IsInRangeArgs) {
	const {
		date,
		minDate = new Date(),
		maxDate = getLastDayOfMonth(minDate),
	} = args;

	const start = new Date(minDate);
	start.setHours(0, 0, 0, 0);
	const end = new Date(maxDate);
	end.setHours(23, 59, 59, 999);

	return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}
