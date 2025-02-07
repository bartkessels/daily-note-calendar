import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';
import {
    addWeeks,
    eachDayOfInterval,
    endOfWeek,
    getISOWeek,
    getQuarter,
    setISOWeek,
    startOfWeek,
    startOfISOWeek,
    startOfQuarter,
    subWeeks
} from 'date-fns';
import {Period, PeriodType} from 'src/domain/models/period.model';

export class DateFnsDateRepository implements DateRepository {
    private readonly monthFormat = 'long';
    private readonly dayFormat = '2-digit';
    private readonly yearFormat = 'numeric';

    public getDayFromDate(date: Date): Period {
        const formatter = new Intl.DateTimeFormat(undefined, {
            day: this.dayFormat
        });

        return <Period> {
            name: formatter.format(date),
            date: date,
            type: PeriodType.Day
        };
    }

    public getWeekFromDate(startOfWeek: DayOfWeek, date: Date): WeekModel {
        const weekNumber = getISOWeek(date);
        return this.getWeek(startOfWeek, weekNumber, date.getFullYear());
    }

    public getWeek(startOfWeek: DayOfWeek, weekNumber: number, year: number): WeekModel {
        const firstWeekDay = setISOWeek(new Date(year, 1, 0), weekNumber);
        const date = startOfISOWeek(firstWeekDay);

        return <WeekModel> {
            date: date,
            name: weekNumber.toString().padStart(2, "0"),
            weekNumber: weekNumber,
            year: this.getYear(year),
            month: this.getMonth(year, date.getMonth()),
            days: this.getDaysOfWeek(startOfWeek, date),
            type: PeriodType.Week
        };
    }

    public getNextWeek(startOfWeek: DayOfWeek, currentWeek: WeekModel): WeekModel {
        const nextWeekDate = addWeeks(currentWeek.date, 1);
        return this.getWeekFromDate(startOfWeek, nextWeekDate);
    }

    public getPreviousWeek(startOfWeek: DayOfWeek, currentWeek: WeekModel): WeekModel {
        const previousWeekDate = subWeeks(currentWeek.date, 1);
        return this.getWeekFromDate(startOfWeek, previousWeekDate);
    }

    public getQuarter(month: Period): Period {
        const firstDateOfQuarter = startOfQuarter(month.date);
        const quarter = getQuarter(firstDateOfQuarter);

        return <Period>{
            name: `Q${quarter}`,
            date: firstDateOfQuarter,
            type: PeriodType.Quarter
        };
    }

    private getYear(year: number): Period {
        const formatter = new Intl.DateTimeFormat(undefined, {
            year: this.yearFormat
        });

        const date = new Date(year, 0);

        return <Period>{
            name: formatter.format(date),
            date: date,
            type: PeriodType.Year
        };
    }

    private getMonth(year: number, monthIndex: number): Period {
        const formatter = new Intl.DateTimeFormat(undefined, {
            month: this.monthFormat
        });

        const date = new Date(year, monthIndex);

        return <Period> {
            name: formatter.format(date),
            date: date,
            type: PeriodType.Month
        };
    }

    private getDaysOfWeek(startOfWeekDay: DayOfWeek, date: Date): Period[] {
        const start = startOfWeek(date, {weekStartsOn: startOfWeekDay});
        const end = endOfWeek(date, {weekStartsOn: startOfWeekDay});
        const days = eachDayOfInterval({start, end});

        return days.map((date) => this.getDayFromDate(date));
    }
}