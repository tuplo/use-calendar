export interface IEvent {
	[key: string]: unknown;
	end?: Date;
	start: Date;
}
export interface IDay {
	date: Date;
	events?: IEvent[];
	isSelectable?: boolean;
	isSelected?: boolean;
	isToday?: boolean;
	isWeekend?: boolean;
	isAdjacentMonth?: boolean;
}

export type IWeek = IDay[];

export interface IMonth {
	weeks: IWeek[];
	month: number;
	year: number;
}

export interface IGetDayPropsOptions {
	day: IDay | null;
}

export interface IGetDayPropsReturns {
	"aria-selected": boolean;
	"aria-label": string;
	disabled: boolean;
	key: string;
	role: string;
	onClick: () => void;
}

export interface IGetDayPropsFn {
	(options: IGetDayPropsOptions): Partial<IGetDayPropsReturns>;
}

export interface IGetPrevNextPropsReturns {
	"aria-label": string;
	disabled: boolean;
	role: string;
	type: "button";
	onClick: () => void;
}

export interface IGetPrevNextPropsFn {
	(): IGetPrevNextPropsReturns;
}

export interface ICalendarProps {
	getPrevYearProps: IGetPrevNextPropsFn;
	getPrevMonthProps: IGetPrevNextPropsFn;
	getDayProps: IGetDayPropsFn;
	getNextMonthProps: IGetPrevNextPropsFn;
	getNextYearProps: IGetPrevNextPropsFn;
	months: IMonth[];
	resetState: () => void;
}

export interface IUseCalendarOptions {
	availableDates: Date[];
	events: IEvent[];
	firstDayOfWeek: number;
	maxDate: Date;
	minDate: Date;
	monthsToDisplay?: number;
	onDateSelected: (day: IDay) => void;
	selectedDate?: string | number | Date;
}
