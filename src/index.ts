import { useState } from 'react';

import * as df from './date-fns';
import { getCalendarMonth, getMinMaxDate } from './helpers';
import type { CalendarProps, UseCalendarOptions } from './calhook';
import { buildGetBackForwardProps, buildGetDayProps } from './props';

export type {
	Day,
	Week,
	Month,
	GetDayPropsOptions,
	GetDayPropsReturns,
	GetDayPropsFn,
	GetBackForwardPropsReturns,
	GetBackPropsFn,
	GetForwardPropsFn,
	CalendarProps,
	UseCalendarOptions,
} from './calhook.d';

export function useCalendar(
	options?: Partial<UseCalendarOptions>
): CalendarProps {
	const {
		availableDates,
		firstDayOfWeek = 0,
		selectedDate,
		onDateSelected,
	} = options || {};
	const [selected, setSelected] = useState<Date | undefined>(selectedDate);
	const [visibleMonth, setVisibleMonth] = useState(selected || new Date());
	const { minDate, maxDate } = getMinMaxDate(options);
	const months = df
		.getMonthsInRange({ start: minDate, end: maxDate })
		.map((month) =>
			getCalendarMonth({
				...month,
				selected,
				availableDates,
				firstDayOfWeek,
				minDate,
				maxDate,
			})
		)
		.filter(
			({ month, year }) =>
				visibleMonth.getMonth() === month && visibleMonth.getFullYear() === year
		);

	const getDayProps = buildGetDayProps({ setSelected, onDateSelected });

	const [getBackProps, getForwardProps] = ['back', 'forward'].map((direction) =>
		buildGetBackForwardProps({
			direction,
			months,
			minDate,
			maxDate,
			setVisibleMonth,
		})
	);

	return { months, getDayProps, getBackProps, getForwardProps };
}
