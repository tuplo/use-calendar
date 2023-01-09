import { useState } from "react";

import * as df from "./date-fns";
import { getCalendarMonth, getMinMaxDate, getValidDate } from "./helpers";
import { buildGetBackForwardProps, buildGetDayProps } from "./props";
import type { ICalendarProps, IUseCalendarOptions } from "./use-calendar";

export type {
	ICalendarProps,
	IDay,
	IEvent,
	IGetBackForwardPropsReturns,
	IGetBackPropsFn,
	IGetDayPropsFn,
	IGetDayPropsOptions,
	IGetDayPropsReturns,
	IGetForwardPropsFn,
	IMonth,
	IUseCalendarOptions,
	IWeek,
} from "./use-calendar.d";

export function useCalendar(
	options?: Partial<IUseCalendarOptions>
): ICalendarProps {
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

	const [getBackProps, getForwardProps] = ["back", "forward"].map((direction) =>
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
