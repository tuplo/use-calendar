import { useMemo, useState } from "react";

import * as df from "./date-fns";
import {
	getCalendarMonth,
	getMinMaxDate,
	getStartEndDate,
	getValidDate,
} from "./helpers";
import {
	buildGetDayProps,
	buildGetPrevNextMonthProps,
	buildGetPrevNextYearProps,
} from "./props";
import type { ICalendarProps, IUseCalendarOptions } from "./use-calendar.d";

export type {
	ICalendarProps,
	IDay,
	IEvent,
	IGetDayPropsFn,
	IGetDayPropsOptions,
	IGetDayPropsReturns,
	IGetPrevNextPropsFn,
	IGetPrevNextPropsReturns,
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

	let monthsToDisplay = options?.monthsToDisplay || 1;
	if (monthsToDisplay === Infinity) {
		const d1 = options?.minDate || df.getFirstDayOfMonth(visibleMonth);
		const d2 = options?.maxDate || df.getLastDayOfMonth(visibleMonth);
		monthsToDisplay = df.differenceInMonths(d1, d2) + 1;
	}

	const { minDate, maxDate } = getMinMaxDate(options);
	const { start, end } = getStartEndDate({
		availableDates,
		monthsToDisplay,
		minDate,
		maxDate,
		visibleMonth,
	});

	const monthsInRange = useMemo(
		() => df.getMonthsInRange({ start, end }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[start.toISOString(), end.toISOString()]
	);

	const visibleMonthDate = new Date(
		visibleMonth.getFullYear(),
		visibleMonth.getMonth()
	);
	const months = monthsInRange
		.filter(({ month, year }) => {
			const a = new Date(year, month);
			return a >= visibleMonthDate;
		})
		.slice(0, monthsToDisplay || 1)
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
		);

	const getDayProps = buildGetDayProps({ setSelected, onDateSelected });

	const [getPrevMonthProps, getNextMonthProps] = ["back", "forward"].map(
		(direction) =>
			buildGetPrevNextMonthProps({
				direction,
				months,
				setVisibleMonth,
				monthsInRange,
			})
	);

	const [getPrevYearProps, getNextYearProps] = ["back", "forward"].map(
		(direction) =>
			buildGetPrevNextYearProps({
				direction,
				monthsInRange,
				setVisibleMonth,
				visibleMonth,
			})
	);

	const resetState = () => {
		setSelected(getValidDate(selectedDate));
		setVisibleMonth(new Date(Date.now()));
	};

	return {
		months,
		getDayProps,
		getPrevYearProps,
		getPrevMonthProps,
		getNextMonthProps,
		getNextYearProps,
		resetState,
	};
}
