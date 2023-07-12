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
	"aria-label": string;
	role: string;
	onClick: () => void;
}

export interface IGetDayPropsFn {
	(options: IGetDayPropsOptions): Partial<IGetDayPropsReturns>;
}

export interface IGetBackForwardPropsReturns {
	"aria-label": string;
	disabled: boolean;
	role: string;
	type: "button";
	onClick: () => void;
}

export interface IGetBackPropsFn {
	(): IGetBackForwardPropsReturns;
}
export interface IGetForwardPropsFn {
	(): IGetBackForwardPropsReturns;
}

export interface ICalendarProps {
	getBackProps: IGetBackPropsFn;
	getDayProps: IGetDayPropsFn;
	getForwardProps: IGetForwardPropsFn;
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
