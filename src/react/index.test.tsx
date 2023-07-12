import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Calendar from "./index";

describe("useCalendar UI", () => {
	const user = userEvent.setup();

	it("renders", () => {
		const { container } = render(<Calendar />);

		expect(container).toMatchSnapshot();
		expect(screen.getByText("6 2022")).toBeInTheDocument();
	});

	describe("onDateSelected", () => {
		const dateNowSpy = vi
			.spyOn(Date, "now")
			.mockReturnValue(new Date("2022-07-25").getTime());

		afterAll(() => {
			dateNowSpy.mockRestore();
		});

		it("calls provided handler when user clicks day", async () => {
			const onDateSelectedSpy = vi.fn();
			render(<Calendar onDateSelected={onDateSelectedSpy} />);
			await act(async () => {
				await user.click(screen.getByText("12"));
			});

			const expected = {
				date: new Date("2022-07-12T00:00:00.000Z"),
				isSelectable: true,
			};
			expect(onDateSelectedSpy).toHaveBeenCalledTimes(1);
			expect(onDateSelectedSpy).toHaveBeenCalledWith(expected);
		});

		it("doesn't call when user clicks not available dates", async () => {
			const onDateSelectedSpy = vi.fn();
			const availableDates = [10, 12, 13, 14, 15].map(
				(date) => new Date(`2022-07-${date}`)
			);
			render(
				<Calendar
					onDateSelected={onDateSelectedSpy}
					availableDates={availableDates}
				/>
			);
			await user.click(screen.getByText("25"));

			expect(onDateSelectedSpy).toHaveBeenCalledTimes(0);
		});
	});
});
