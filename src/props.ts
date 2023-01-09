import * as df from "./date-fns";
import type {
	IDay,
	IGetBackForwardPropsReturns,
	IGetDayPropsOptions,
	IMonth,
} from "./use-calendar.d";

interface IBuildGetDayPropsArgs {
	setSelected: (newSelected: Date) => void;
	onDateSelected?: (day: IDay) => void;
	locale?: string;
}

export function buildGetDayProps(args: IBuildGetDayPropsArgs) {
	const { setSelected, onDateSelected } = args;

	return (options: IGetDayPropsOptions) => {
		const { day } = options;
		if (!day) {
			return {
				onClick: () => undefined,
			};
		}

		const locale = args.locale || navigator?.language || "en";
		const dtf = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

		return {
			"aria-label": dtf.format(new Date(day.date)),
			role: "button",
			onClick: () => {
				const { isSelectable } = day;
				if (!isSelectable) return;

				setSelected(day.date);
				if (onDateSelected) onDateSelected(day);
			},
		};
	};
}

interface IBuildGetBackForwardPropsArgs {
	direction: string;
	months: IMonth[];
	minDate?: Date;
	maxDate?: Date;
	setVisibleMonth: (newVisibleMonth: Date) => void;
}

export function buildGetBackForwardProps(args: IBuildGetBackForwardPropsArgs) {
	const { months, minDate, maxDate, direction, setVisibleMonth } = args;
	const { 0: firstMonth, length, [length - 1]: lastMonth } = months;
	const month = direction === "back" ? firstMonth : lastMonth;
	const delta = direction === "back" ? -1 : 1;
	if (!month) return () => ({} as IGetBackForwardPropsReturns);

	const adjacentMonth = new Date(month.year, month.month + delta);
	const monthsInRange = df.getMonthsInRange({ start: minDate, end: maxDate });
	const disabled =
		monthsInRange.findIndex(
			(m) =>
				m.month === adjacentMonth.getMonth() &&
				m.year === adjacentMonth.getFullYear()
		) === -1;
	const ariaLabel =
		direction === "back" ? "Go back 1 month" : "Go forward 1 month";
	const onClick = () => {
		if (disabled) return;
		setVisibleMonth(adjacentMonth);
	};

	return () => ({
		disabled,
		role: "button",
		type: "button" as const,
		"aria-label": ariaLabel,
		onClick,
	});
}
