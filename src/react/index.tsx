import type { IUseCalendarOptions } from "../index";
import { useCalendar } from "../index";

function Calendar(props?: Partial<IUseCalendarOptions>) {
	const { months, getDayProps, getPrevMonthProps, getNextMonthProps } =
		useCalendar(props);

	return (
		<>
			{months.map(({ year, month, weeks }) => (
				<div key={`${year}${month}`}>
					<header>
						<h1>
							{month} {year}
						</h1>
					</header>
					<nav>
						<button {...getPrevMonthProps()}>Prev</button>
						<button {...getNextMonthProps()}>Next</button>
					</nav>
					{weeks.map((week, weekIndex) =>
						week.map((day, dayIndex) =>
							day ? (
								<button
									key={`${year}${weekIndex}${dayIndex}`}
									{...getDayProps({ day })}
								>
									{day.date.getDate()}
								</button>
							) : (
								<span key={`${year}${weekIndex}${dayIndex}`} />
							)
						)
					)}
				</div>
			))}
		</>
	);
}

export default Calendar;
