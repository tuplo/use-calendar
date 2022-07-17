export interface Event {
	start: Date;
	end?: Date;
	[key: string]: unknown;
}
export interface Day {
	date: Date;
	events?: Event[];
	isToday: boolean;
	isSelectable: boolean;
	isSelected: boolean;
}

export type Week = (Day | null)[];

export interface Month {
	weeks: Week[];
	month: number;
	year: number;
}

export interface GetDayPropsOptions {
	day: Day | null;
}

export interface GetDayPropsReturns {
	'aria-label': string;
	role: string;
	onClick: () => void;
}

export type GetDayPropsFn = (
	options: GetDayPropsOptions
) => Partial<GetDayPropsReturns>;

export interface GetBackForwardPropsReturns {
	'aria-label': string;
	disabled: boolean;
	role: string;
	type: 'button';
	onClick: () => void;
}

export type GetBackPropsFn = () => GetBackForwardPropsReturns;
export type GetForwardPropsFn = () => GetBackForwardPropsReturns;

export interface CalendarProps {
	months: Month[];
	getDayProps: GetDayPropsFn;
	getBackProps: GetBackPropsFn;
	getForwardProps: GetForwardPropsFn;
}

export interface UseCalendarOptions {
	availableDates: Date[];
	events: Event[];
	firstDayOfWeek: number;
	minDate: Date;
	maxDate: Date;
	selectedDate?: Date;
	onDateSelected: (day: Day) => void;
}
