export interface IEvent {
	start: Date;
	end?: Date;
	[key: string]: unknown;
}
export interface IDay {
	date: Date;
	events?: IEvent[];
	isToday: boolean;
	isSelectable: boolean;
	isSelected: boolean;
}

export type IWeek = (IDay | null)[];

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
	months: IMonth[];
	getDayProps: IGetDayPropsFn;
	getBackProps: IGetBackPropsFn;
	getForwardProps: IGetForwardPropsFn;
	resetState: () => void;
}

export interface IUseCalendarOptions {
	availableDates: Date[];
	events: IEvent[];
	firstDayOfWeek: number;
	minDate: Date;
	maxDate: Date;
	selectedDate?: string | number | Date;
	onDateSelected: (day: IDay) => void;
}
