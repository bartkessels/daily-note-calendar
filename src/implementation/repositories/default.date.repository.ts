import {Day, DayOfWeek} from 'src/domain/models/day';
import {Month} from 'src/domain/models/month';
import {Week} from 'src/domain/models/week';
import {DateRepository} from 'src/domain/repositories/date.repository';
import {Year} from 'src/domain/models/year';

export class DefaultDateRepository implements DateRepository {
    private readonly monthFormat = 'long';
    private readonly dayFormat = 'numeric';
    private readonly yearFormat = 'numeric';

    public getDay(date: Date): Day {
        const formatter = new Intl.DateTimeFormat(undefined, {
            day: this.dayFormat
        });

        return <Day>{
            dayOfWeek: this.getDayOfWeek(date.getDay()),
            date: date.getDate(),
            name: formatter.format(date),
            completeDate: date
        };
    }

    public getYear(year: number): Year {
        const months: Month[] = [];
        const formatter = new Intl.DateTimeFormat(undefined, {
            year: this.yearFormat
        });

        for (let i = 0; i < 12; i++) {
            months.push(this.getMonth(year, i));
        }

        return <Year>{
            year: year,
            name: formatter.format(new Date(year, months[0].monthIndex)),
            months: months
        };
    }

    public getMonth(year: number, month: number): Month {
        const formatter = new Intl.DateTimeFormat(undefined, {
            month: this.monthFormat
        });

        const days = this.getDaysOfMonth(year, month);
        const weeks = this.groupDaysIntoWeeks(days);
        const quarter = Math.floor(month / 3) + 1;

        return <Month>{
            monthIndex: month,
            quarter: quarter,
            year: year,
            name: formatter.format(new Date(year, month)),
            weeks: weeks
        };
    }

    private getDaysOfMonth(year: number, month: number): Day[] {
        const date = new Date(year, month, 1);
        const daysList = [];

        while (date.getMonth() === month) {
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

            if (day.dayOfWeek === DayOfWeek.Sunday) {
                weeks.push({
                    weekNumber: this.getWeekNumber(day.completeDate),
                    days: currentWeek
                });
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            weeks.push({
                weekNumber: this.getWeekNumber(currentWeek[0].completeDate),
                days: currentWeek
            });
        }

        return weeks;
    }

    private getWeekNumber(date: Date): number {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + startOfYear.getDay()) / 7);
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