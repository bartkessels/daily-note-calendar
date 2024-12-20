import {Day, DayOfWeek} from 'src/domain/models/day';
import {Month} from 'src/domain/models/month';
import {Week} from 'src/domain/models/week';
import {DateRepository} from 'src/domain/repositories/date.repository';
import {Year} from 'src/domain/models/year';
import {getISOWeek} from 'date-fns';

export class DateFnsDateRepository implements DateRepository {
    private readonly monthFormat = 'long';
    private readonly dayFormat = 'numeric';
    private readonly yearFormat = 'numeric';

    public getDay(date: Date): Day {
        const formatter = new Intl.DateTimeFormat(undefined, {
            day: this.dayFormat
        });

        return <Day>{
            name: formatter.format(date),
            dayOfWeek: this.getDayOfWeek(date.getDay()),
            date: date
        };
    }

    public getYear(year: number): Year {
        const date = new Date(year, 0);
        const months: Month[] = [];
        const formatter = new Intl.DateTimeFormat(undefined, {
            year: this.yearFormat
        });

        for (let monthIndex = 0; monthIndex <= 11; monthIndex++) {
            months.push(this.getMonth(year, monthIndex));
        }

        return <Year>{
            name: formatter.format(date),
            months: months,
            date: date
        };
    }

    public getMonth(year: number, monthIndex: number): Month {
        const formatter = new Intl.DateTimeFormat(undefined, {
            month: this.monthFormat
        });

        const date = new Date(year, monthIndex);
        const days = this.getDaysOfMonth(year, monthIndex);
        const weeks = this.groupDaysIntoWeeks(days);
        const quarter = Math.floor(monthIndex / 3) + 1;

        return <Month>{
            quarter: quarter,
            name: formatter.format(date),
            weeks: weeks,
            date: date
        };
    }

    private getDaysOfMonth(year: number, monthIndex: number): Day[] {
        const date = new Date(year, monthIndex, 1);
        const daysList = [];

        while (date.getMonth() === monthIndex) {
            daysList.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return daysList.map(day => this.getDay(day));
    }

    private groupDaysIntoWeeks(days: Day[]): Week[] {
        const weeks: Week[] = [];
        let currentWeek: Day[] = [];

        days.forEach(day => {
            currentWeek.push(day);
            const date = day.date;

            if (day.dayOfWeek === DayOfWeek.Sunday) {
                weeks.push(this.getWeek(date, currentWeek));
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            const date = currentWeek[0].date;
            weeks.push(this.getWeek(date, currentWeek));
        }

        return weeks;
    }

    private getWeek(date: Date, days: Day[]): Week {
        return {
            date: date,
            weekNumber: getISOWeek(date).toString().padStart(2, '0'),
            days: days
        };
    }

    private getDayOfWeek(value: number): DayOfWeek {
        switch (value) {
            case 1:
                return DayOfWeek.Monday;
            case 2:
                return DayOfWeek.Tuesday;
            case 3:
                return DayOfWeek.Wednesday;
            case 4:
                return DayOfWeek.Thursday;
            case 5:
                return DayOfWeek.Friday;
            case 6:
                return DayOfWeek.Saturday;
            default:
                return DayOfWeek.Sunday;
        }
    };
}