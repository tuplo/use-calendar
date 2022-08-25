import type {
	Day,
	GetBackForwardPropsReturns,
	GetDayPropsOptions,
	Month,
} from './calhook.d';
import * as df from './date-fns';

type BuildGetDayPropsArgs = {
	setSelected: (newSelected: Date) => void;
	onDateSelected?: (day: Day) => void;
	locale?: string;
};

export function buildGetDayProps(args: BuildGetDayPropsArgs) {
	const { setSelected, onDateSelected } = args;

	return (options: GetDayPropsOptions) => {
		const { day } = options;
		if (!day) {
			return {
				onClick: () => undefined,
			};
		}

		const locale = args.locale || navigator?.language || 'en';
		const dtf = new Intl.DateTimeFormat(locale, { dateStyle: 'long' });

		return {
			'aria-label': dtf.format(new Date(day.date)),
			role: 'button',
			onClick: () => {
				const { isSelectable } = day;
				if (!isSelectable) return;

				setSelected(day.date);
				if (onDateSelected) onDateSelected(day);
			},
		};
	};
}

type BuildGetBackForwardPropsArgs = {
	direction: string;
	months: Month[];
	minDate?: Date;
	maxDate?: Date;
	setVisibleMonth: (newVisibleMonth: Date) => void;
};

export function buildGetBackForwardProps(args: BuildGetBackForwardPropsArgs) {
	const { months, minDate, maxDate, direction, setVisibleMonth } = args;
	const { 0: firstMonth, length, [length - 1]: lastMonth } = months;
	const month = direction === 'back' ? firstMonth : lastMonth;
	const delta = direction === 'back' ? -1 : 1;
	if (!month) return () => ({} as GetBackForwardPropsReturns);

	const adjacentMonth = new Date(month.year, month.month + delta);
	const monthsInRange = df.getMonthsInRange({ start: minDate, end: maxDate });
	const disabled =
		monthsInRange.findIndex(
			(m) =>
				m.month === adjacentMonth.getMonth() &&
				m.year === adjacentMonth.getFullYear()
		) === -1;
	const ariaLabel =
		direction === 'back' ? 'Go back 1 month' : 'Go forward 1 month';
	const onClick = () => {
		if (disabled) return;
		setVisibleMonth(adjacentMonth);
	};

	return () => ({
		disabled,
		role: 'button',
		type: 'button' as const,
		'aria-label': ariaLabel,
		onClick,
	});
}
