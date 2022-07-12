import { useCalendar, type UseCalendarOptions } from '../index';

export default function Calendar(props?: Partial<UseCalendarOptions>) {
	const { months, getDayProps, getBackProps, getForwardProps } =
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
						<button {...getBackProps()}>Prev</button>
						<button {...getForwardProps()}>Next</button>
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
