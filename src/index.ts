import { useEffect, useMemo, useState } from "react";

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
import {
	type ICalendarProps,
	type IUseCalendarOptions,
} from "./use-calendar.d";

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
		onDateSelected,
		selectedDate,
	} = options || {};
	const s = getValidDate(selectedDate);
	const [selected, setSelected] = useState<Date | undefined>(s);
	const [visibleMonth, setVisibleMonth] = useState(
		selected || new Date(Date.now())
	);

	useEffect(() => {
		if (!s || s?.getTime() === selected?.getTime()) return;
		setSelected(s);
		setVisibleMonth(s);
	}, [s?.getTime()]);

	let monthsToDisplay = options?.monthsToDisplay || 1;
	if (monthsToDisplay === Number.POSITIVE_INFINITY) {
		const d1 = options?.minDate || df.getFirstDayOfMonth(visibleMonth);
		const d2 = options?.maxDate || df.getLastDayOfMonth(visibleMonth);
		monthsToDisplay = df.differenceInMonths(d1, d2) + 1;
	}

	const { maxDate, minDate } = getMinMaxDate(options);
	const { end, start } = getStartEndDate({
		availableDates,
		maxDate,
		minDate,
		monthsToDisplay,
		visibleMonth,
	});

	const monthsInRange = useMemo(
		() => df.getMonthsInRange({ end, start }),
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

	const getDayProps = buildGetDayProps({ onDateSelected, setSelected });

	const [getPrevMonthProps, getNextMonthProps] = ["back", "forward"].map(
		(direction) =>
			buildGetPrevNextMonthProps({
				direction,
				months,
				monthsInRange,
				setVisibleMonth,
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
		getDayProps,
		getNextMonthProps,
		getNextYearProps,
		getPrevMonthProps,
		getPrevYearProps,
		months,
		resetState,
	};
}
