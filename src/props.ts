import type {
	IDay,
	IGetPrevNextPropsReturns,
	IGetDayPropsOptions,
	IMonth,
} from "./use-calendar.d";
import * as df from "./date-fns";

interface IBuildGetDayPropsArgs {
	setSelected: (newSelected: Date) => void;
	onDateSelected?: (day: IDay) => void;
	locale?: string;
}

function getBrowserLocale() {
	return typeof navigator !== "undefined" && navigator?.language;
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

		const locale = args.locale || getBrowserLocale() || "en";
		const dtf = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

		return {
			"aria-selected": day.isSelected,
			"aria-label": dtf.format(new Date(day.date)),
			disabled: !day.isSelectable,
			key: day.date.toISOString(),
			role: "button",
			onClick: () => {
				const { isSelectable } = day;
				if (!isSelectable) {
					return;
				}

				setSelected(day.date);
				if (onDateSelected) {
					onDateSelected(day);
				}
			},
		};
	};
}

interface IBuildGetPrevNextMonthPropsArgs {
	direction: string;
	months: IMonth[];
	setVisibleMonth: (newVisibleMonth: Date) => void;
	monthsInRange: Partial<IMonth>[];
}

export function buildGetPrevNextMonthProps(
	args: IBuildGetPrevNextMonthPropsArgs
) {
	const { months, direction, monthsInRange, setVisibleMonth } = args;
	const { 0: firstMonth, length, [length - 1]: lastMonth } = months;
	const month = direction === "back" ? firstMonth : lastMonth;
	const delta = direction === "back" ? -1 : 1;
	if (!month) {
		return () => ({}) as IGetPrevNextPropsReturns;
	}

	const adjacentMonth = new Date(month.year, month.month + delta);
	const disabled =
		monthsInRange.findIndex(
			(m) =>
				m.month === adjacentMonth.getMonth() &&
				m.year === adjacentMonth.getFullYear()
		) === -1;
	const label = direction === "back" ? "Go back 1 month" : "Go forward 1 month";
	const onClick = () => {
		if (disabled) {
			return;
		}
		setVisibleMonth(adjacentMonth);
	};

	return () => ({
		disabled,
		role: "button",
		type: "button" as const,
		"aria-label": label,
		onClick,
	});
}

interface IBuildGetPrevNextYearPropsArgs {
	direction: string;
	setVisibleMonth: (newVisibleMonth: Date) => void;
	monthsInRange: Partial<IMonth>[];
	visibleMonth: Date;
}

export function buildGetPrevNextYearProps(
	args: IBuildGetPrevNextYearPropsArgs
) {
	const { direction, monthsInRange, setVisibleMonth, visibleMonth } = args;

	const delta = direction === "back" ? -1 : 1;
	const adjacentMonth = df.getDateFrom({ date: visibleMonth, years: delta });
	const disabled =
		monthsInRange.findIndex(
			(m) =>
				m.month === adjacentMonth.getMonth() &&
				m.year === adjacentMonth.getFullYear()
		) === -1;
	const label = direction === "back" ? "Go back 1 year" : "Go forward 1 year";
	const onClick = () => {
		if (disabled) {
			return;
		}
		setVisibleMonth(adjacentMonth);
	};

	return () => ({
		disabled,
		role: "button",
		type: "button" as const,
		"aria-label": label,
		onClick,
	});
}
