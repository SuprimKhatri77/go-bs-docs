// Command wasm compiles github.com/suprimkhatri77/go-bs to WebAssembly and
// exposes a small JS API on the global object, for the interactive
// converter widget on the docs site. This is presentation-layer glue, not
// part of the go-bs library itself.
//
// Build with (see ../scripts/build-wasm.sh):
//
//	GOOS=js GOARCH=wasm go build -ldflags="-s -w" -o ../public/converter.wasm .
package main

import (
	"syscall/js"
	"time"

	bs "github.com/suprimkhatri77/go-bs"
)

// result builds a {value, error} JS object. error is null on success.
func result(value js.Value, err error) js.Value {
	obj := js.Global().Get("Object").New()
	if err != nil {
		obj.Set("value", js.Null())
		obj.Set("error", err.Error())
		return obj
	}
	obj.Set("value", value)
	obj.Set("error", js.Null())
	return obj
}

func dateToJS(d bs.Date) js.Value {
	obj := js.Global().Get("Object").New()
	obj.Set("year", d.Year)
	obj.Set("month", d.Month)
	obj.Set("day", d.Day)
	obj.Set("string", d.String())
	weekday, err := d.DayOfWeek()
	if err == nil {
		obj.Set("weekday", weekday.String())
	}
	nepaliName, err := d.MonthNameNepali()
	if err == nil {
		obj.Set("monthNameNepali", nepaliName)
	}
	englishName, err := d.MonthName()
	if err == nil {
		obj.Set("monthName", englishName)
	}
	return obj
}

// adToBS(adDateString) -> {value: {year, month, day, string, weekday, monthName, monthNameNepali}, error}
func adToBS(this js.Value, args []js.Value) any {
	t, err := time.Parse("2006-01-02", args[0].String())
	if err != nil {
		return result(js.Null(), err)
	}
	d, err := bs.ADToBS(t)
	if err != nil {
		return result(js.Null(), err)
	}
	return result(dateToJS(d), nil)
}

// bsToAD(year, month, day) -> {value: adDateString, error}
func bsToAD(this js.Value, args []js.Value) any {
	year, month, day := args[0].Int(), args[1].Int(), args[2].Int()
	d, err := bs.NewDate(year, month, day)
	if err != nil {
		return result(js.Null(), err)
	}
	t, err := bs.BSToAD(d)
	if err != nil {
		return result(js.Null(), err)
	}
	return result(js.ValueOf(t.Format("2006-01-02")), nil)
}

// monthCalendar(year, month) -> {value: {weeks: [[dayNumberOrNull, ...7], ...], monthName, monthNameNepali, daysInMonth}, error}
func monthCalendar(this js.Value, args []js.Value) any {
	year, month := args[0].Int(), args[1].Int()
	weeks, err := bs.MonthCalendar(year, month)
	if err != nil {
		return result(js.Null(), err)
	}
	jsWeeks := js.Global().Get("Array").New(len(weeks))
	for i, week := range weeks {
		jsWeek := js.Global().Get("Array").New(len(week))
		for j, day := range week {
			if day == nil {
				jsWeek.SetIndex(j, js.Null())
			} else {
				jsWeek.SetIndex(j, day.Day)
			}
		}
		jsWeeks.SetIndex(i, jsWeek)
	}

	obj := js.Global().Get("Object").New()
	obj.Set("weeks", jsWeeks)
	if name, err := bs.MonthName(month); err == nil {
		obj.Set("monthName", name)
	}
	if name, err := bs.MonthNameNepali(month); err == nil {
		obj.Set("monthNameNepali", name)
	}
	if days, err := bs.DaysInMonth(year, month); err == nil {
		obj.Set("daysInMonth", days)
	}
	return result(obj, nil)
}

// supportedRange() -> {minBSYear, maxBSYear}
func supportedRange(this js.Value, args []js.Value) any {
	obj := js.Global().Get("Object").New()
	obj.Set("minBSYear", bs.MinBSYear)
	obj.Set("maxBSYear", bs.MaxBSYear)
	return obj
}

func main() {
	js.Global().Set("goBS", js.Global().Get("Object").New())
	goBS := js.Global().Get("goBS")
	goBS.Set("adToBS", js.FuncOf(adToBS))
	goBS.Set("bsToAD", js.FuncOf(bsToAD))
	goBS.Set("monthCalendar", js.FuncOf(monthCalendar))
	goBS.Set("supportedRange", js.FuncOf(supportedRange))

	// Keep the program alive so registered callbacks keep working.
	select {}
}
