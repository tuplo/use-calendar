import type {
	IDay,
	IGetDayPropsOptions,
	IGetPrevNextPropsReturns,
	IMonth,
} from "./use-calendar.d";
import * as df from "./date-fns";

type IBuildGetDayPropsArgs = {
	locale?: string;
	onDateSelected?: (day: IDay) => void;
	setSelected: (newSelected: Date) => void;
};

type IBuildGetPrevNextMonthPropsArgs = {
	direction: string;
	months: IMonth[];
	monthsInRange: Partial<IMonth>[];
	setVisibleMonth: (newVisibleMonth: Date) => void;
};

type IBuildGetPrevNextYearPropsArgs = {
	direction: string;
	monthsInRange: Partial<IMonth>[];
	setVisibleMonth: (newVisibleMonth: Date) => void;
	visibleMonth: Date;
};

export function buildGetDayProps(args: IBuildGetDayPropsArgs) {
	const { onDateSelected, setSelected } = args;

	return (options: IGetDayPropsOptions) => {
		const { day } = options;
		if (!day) {
			return {
				onClick: () => {},
			};
		}

		const locale = args.locale || getBrowserLocale() || "en";
		const dtf = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

		return {
			"aria-label": dtf.format(new Date(day.date)),
			"aria-selected": day.isSelected,
			disabled: !day.isSelectable,
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
			role: "button",
		};
	};
}

export function buildGetPrevNextMonthProps(
	args: IBuildGetPrevNextMonthPropsArgs
) {
	const { direction, months, monthsInRange, setVisibleMonth } = args;
	const { 0: firstMonth, length, [length - 1]: lastMonth } = months;
	const month = direction === "back" ? firstMonth : lastMonth;
	const delta = direction === "back" ? -1 : 1;
	if (!month) {
		return () => ({}) as IGetPrevNextPropsReturns;
	}

	const adjacentMonth = new Date(month.year, month.month + delta);
	const disabled = !monthsInRange.some(
		(m) =>
			m.month === adjacentMonth.getMonth() &&
			m.year === adjacentMonth.getFullYear()
	);
	const label = direction === "back" ? "Go back 1 month" : "Go forward 1 month";
	const onClick = () => {
		if (disabled) {
			return;
		}
		setVisibleMonth(adjacentMonth);
	};

	return () => ({
		"aria-label": label,
		disabled,
		onClick,
		role: "button",
		type: "button" as const,
	});
}

export function buildGetPrevNextYearProps(
	args: IBuildGetPrevNextYearPropsArgs
) {
	const { direction, monthsInRange, setVisibleMonth, visibleMonth } = args;

	const delta = direction === "back" ? -1 : 1;
	const adjacentMonth = df.getDateFrom({ date: visibleMonth, years: delta });
	const disabled = !monthsInRange.some(
		(m) =>
			m.month === adjacentMonth.getMonth() &&
			m.year === adjacentMonth.getFullYear()
	);
	const label = direction === "back" ? "Go back 1 year" : "Go forward 1 year";
	const onClick = () => {
		if (disabled) {
			return;
		}
		setVisibleMonth(adjacentMonth);
	};

	return () => ({
		"aria-label": label,
		disabled,
		onClick,
		role: "button",
		type: "button" as const,
	});
}

function getBrowserLocale() {
	return typeof navigator !== "undefined" && navigator?.language;
}
