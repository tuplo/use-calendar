<br />
<div align="center">
  <img src="logo.png" alt="Logo" width="120" height="120">
  <h1 align="center">calhook</h3>
  <p align="center">Headless calendar hook for React</p>
  <p align="center">
    <img src="https://img.shields.io/npm/v/@tuplo/calhook">
    <img src="https://img.shields.io/bundlephobia/minzip/@tuplo/calhook">
  	 <a href="https://codeclimate.com/github/tuplo/calhook/test_coverage">
  	   <img src="https://api.codeclimate.com/v1/badges/a7b3c39ad40c1b1bdd6d/test_coverage">
  	 </a>
  	 <img src="https://github.com/tuplo/calhook/actions/workflows/build.yml/badge.svg">
  </p>
</div>

## Why

Other similar solutions were a bit too heavy on dependencies or didn't support all features we needed.

* No dependencies
* WAI-ARIA compliant
* Events	 

## Install

```bash
$ npm install @tuplo/calhook

# or with yarn
$ yarn add @tuplo/calhook
```

## Usage

Minimal example

```jsx
import { useCalendar } from '@tuplo/calhook'

function Calendar() {
  const {
    months,
    getDayProps,
    getBackProps,
    getForwardProps
  } = useCalendar()

  return (
    <>
      {months.map(({ year, month, weeks }) => (
        <div>
          <header>
            <h1>{month} {year}</h1>
          </header>
          <nav>
            <button {...getBackProps()}>Prev</button>
            <button {...getForwardProps()}>Next</button>
          </nav>
          {
            weeks.map((week) =>
              week.map((day) =>
                day
                  ? <button {...getDayProps({ day })}>{day.date.getDate()}</button>
                  : <span />
              )
          }
        </div>
      ))
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

### onDateSelected

> `function(day: Day)` | optional

Called when the user selects a date.

### selectedDate

> `Date` | defaults to `new Date()`

Used to calculate what month to display on initial render.

## License

MIT
