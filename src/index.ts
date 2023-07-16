import { useState } from "react";

import * as df from "./date-fns";
import { getCalendarMonth, getMinMaxDate, getValidDate } from "./helpers";
import { buildGetBackForwardProps, buildGetDayProps } from "./props";
import type { ICalendarProps, IUseCalendarOptions } from "./use-calendar.d";

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

	let monthsToDisplay = options?.monthsToDisplay || 1;
	if (monthsToDisplay === Infinity) {
		const d1 = options?.minDate || df.getFirstDayOfMonth(visibleMonth);
		const d2 = options?.maxDate || df.getLastDayOfMonth(visibleMonth);
		monthsToDisplay = df.differenceInMonths(d1, d2) + 1;
	}

	let start = df.getDateFrom({ date: visibleMonth, months: -1 });
	let end = df.getDateFrom({ date: visibleMonth, months: monthsToDisplay });
	if (availableDates) {
		const numberDates = [...availableDates, Date.now()]
			.map((d) => new Date(d).getTime())
			.sort();
		// eslint-disable-next-line no-useless-computed-key
		const { [0]: minNumDate, length, [length - 1]: maxNumDate } = numberDates;
		start = new Date(minNumDate);
		end = new Date(maxNumDate);
	}
	const monthsInRange = df.getMonthsInRange({ start, end });

	const months = monthsInRange
		.filter(({ month, year }) => {
			const a = new Date(year, month);
			const b = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth());
			return a >= b;
		})
		.slice(0, monthsToDisplay)
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

	const [getBackProps, getForwardProps] = ["back", "forward"].map((direction) =>
		buildGetBackForwardProps({
			direction,
			months,
			setVisibleMonth,
			monthsInRange,
		})
	);

	const resetState = () => {
		setSelected(getValidDate(selectedDate));
		setVisibleMonth(new Date(Date.now()));
	};

	return { months, getDayProps, getBackProps, getForwardProps, resetState };
}
