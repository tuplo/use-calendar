export type IEvent = {
	[key: string]: unknown;
	end?: Date;
	start: Date;
};

export type IDay = {
	date: Date;
	events?: IEvent[];
	isSelectable?: boolean;
	isSelected?: boolean;
	isToday?: boolean;
	isWeekend?: boolean;
	isAdjacentMonth?: boolean;
};

export type IWeek = IDay[];

export type IMonth = {
	weeks: IWeek[];
	month: number;
	year: number;
};

export type IGetDayPropsOptions = {
	day: IDay | null;
};

export type IGetDayPropsReturns = {
	"aria-selected": boolean;
	"aria-label": string;
	disabled: boolean;
	key: string;
	role: string;
	onClick: () => void;
};

export type IGetDayPropsFn = {
	(options: IGetDayPropsOptions): Partial<IGetDayPropsReturns>;
};

export type IGetPrevNextPropsReturns = {
	"aria-label": string;
	disabled: boolean;
	role: string;
	type: "button";
	onClick: () => void;
};

export type IGetPrevNextPropsFn = {
	(): IGetPrevNextPropsReturns;
};

export type ICalendarProps = {
	getPrevYearProps: IGetPrevNextPropsFn;
	getPrevMonthProps: IGetPrevNextPropsFn;
	getDayProps: IGetDayPropsFn;
	getNextMonthProps: IGetPrevNextPropsFn;
	getNextYearProps: IGetPrevNextPropsFn;
	months: IMonth[];
	resetState: () => void;
};

export type IUseCalendarOptions = {
	availableDates: Date[];
	events: IEvent[];
	firstDayOfWeek: number;
	maxDate: Date;
	minDate: Date;
	monthsToDisplay?: number;
	onDateSelected: (day: IDay) => void;
	selectedDate?: string | number | Date;
};
