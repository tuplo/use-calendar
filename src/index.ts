import { useState } from 'react';

import type { CalendarProps, UseCalendarOptions } from './calhook.d';
import * as df from './date-fns';
import { getCalendarMonth, getMinMaxDate, getValidDate } from './helpers';
import { buildGetBackForwardProps, buildGetDayProps } from './props';

export type {
	CalendarProps,
	Day,
	Event,
	GetBackForwardPropsReturns,
	GetBackPropsFn,
	GetDayPropsFn,
	GetDayPropsOptions,
	GetDayPropsReturns,
	GetForwardPropsFn,
	Month,
	UseCalendarOptions,
	Week,
} from './calhook.d';

export function useCalendar(
	options?: Partial<UseCalendarOptions>
): CalendarProps {
	const {
		availableDates,
		events = [],
		firstDayOfWeek = 0,
		selectedDate,
		onDateSelected,
	} = options || {};
	const s = getValidDate(selectedDate);
	const [selected, setSelected] = useState<Date | undefined>(s);
	const [visibleMonth, setVisibleMonth] = useState(
		selected || new Date(Date.now())
	);
	const { minDate, maxDate } = getMinMaxDate(options);
	const months = df
		.getMonthsInRange({ start: minDate, end: maxDate })
		.map((month) =>
			getCalendarMonth({
				...month,
				availableDates,
				events,
				firstDayOfWeek,
				maxDate,
				minDate,
				selected,
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

	const resetState = () => {
		setSelected(getValidDate(selectedDate));
		setVisibleMonth(new Date(Date.now()));
	};

	return { months, getDayProps, getBackProps, getForwardProps, resetState };
}
