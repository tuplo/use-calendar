<br />
<div align="center">
  <img src="logo.png" alt="Logo" width="120" height="120">
  <h1 align="center">use-calendar</h3>
  <p align="center">Headless calendar hook for React</p>
  <p align="center">
    <img src="https://img.shields.io/npm/v/@tuplo/use-calendar">
    <img src="https://img.shields.io/bundlephobia/minzip/@tuplo/use-calendar">
  	 <a href="https://codeclimate.com/github/tuplo/use-calendar/test_coverage"><img src="https://api.codeclimate.com/v1/badges/950de43b7d3e5b4b84c7/test_coverage" /></a>
  </p>
</div>

## Why

Other similar solutions were a bit too heavy on dependencies or didn't support all features we needed.

* No dependencies
* WAI-ARIA compliant
* Events	 

## Install

```bash
$ npm install @tuplo/use-calendar

# or with yarn
$ yarn add @tuplo/use-calendar
```

## Usage

Minimal example

```jsx
import { useCalendar } from '@tuplo/use-calendar'

function Calendar() {
  const {
    months,
    getDayProps,
    getPrevMonthProps,
    getNextMonthProps
  } = useCalendar()

  return (
    <>
      {months.map(({ year, month, weeks }) => (
        <div>
          <header>
            <h1>{month} {year}</h1>
          </header>
          <nav>
            <button {...getPrevMonthProps()}>Prev</button>
            <button {...getNextMonthProps()}>Next</button>
          </nav>
          {
            weeks.map((week) =>
              week.map((day) =>
                <button {...getDayProps({ day })}>{day.date.getDate()}</button>
              ))
          }
        </div>
      ))}
    </>
  )
}
```

## Options

```typescript
const calendarProps = useCalendar({
  availableDates: [new Date('2022-07-11'), new Date('2022-07-12')],
  events: [{ start: new Date('2022-12-25'), title: 'Christmas' }],
  firstDayOfWeek: 1,
  minDate: new Date('2022-07-01'),
  maxDate: new Date('2022-07-31'),
  monthsToDisplay: 1,
  onDateSelected: (day) => console.log(day.date),
  selectedDate: new Date('2022-07-11'),
});
```

### availableDates

> `Date[]` | optional

Which days should be selectable on the calendar.

### events

> `{ start: Date, end?: Date, [k: string]: unknown }[]` | optional

List of events. The only required attribute on a `Event` is the `start` date. Any custom attributes you send in, will be returned back on the corresponding days, ex: `isAllDay: true`

### firstDayOfWeek

> `number` | defaults to `0`

First day of the week with possible values 0-6 (Sunday to Saturday). Defaults to
Sunday.

### minDate

> `Date` | optional

Used to calculate the minimum month to render.

### maxDate

> `Date` | optional

Used to calculate the maximum month to render.

### monthsToDisplay

> `number` | defaults to `1`

Number of months returned, based off the `selectedDate`. `Infinity` will display all months with available dates.


### onDateSelected

> `function(day: Day)` | optional

Called when the user selects a date.

### selectedDate

> `Date | string | number` | optional

Used to calculate what month to display on initial render.


## Outputs

The hook will return an object with the following shape:

```typescript
interface ICalendarProps {
  getDayProps: IGetDayPropsFn;
  getPrevMonthProps: IGetPrevNextPropsFn;
  getNextMonthProps: IGetPrevNextPropsFn;
  getPrevYearProps: IGetPrevNextPropsFn;
  getNextYearProps: IGetPrevNextPropsFn;
  months: IMonth[];
  resetState: () => void;
}
```

Each month has the shape:

```typescript
interface IMonth {
  weeks: IDay[][];
  month: number;
  year: number;
}
```

Each day returned on each week of the months to display is:

```typescript
interface IDay {
  date: Date;
  events?: IEvent[];
  isSelectable?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  isWeekend?: boolean;
  isAdjacentMonth?: boolean;
}
```

An event is represented by (it can hold any extra data needed):

```typescript
interface IEvent {
  \[key: string\]: unknown;
  end?: Date;
  start: Date;
}
```

## License

MIT
