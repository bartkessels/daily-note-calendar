import { WeekModel } from 'src-new/domain/models/week.model';
import {DateService} from 'src-new/infrastructure/contracts/date-service';
import {addWeeks, eachDayOfInterval, endOfISOWeek, getISOWeek, setISOWeek, startOfISOWeek, subWeeks} from 'date-fns';
import {Period} from 'src-new/domain/models/date.model';

export class DateFnsDateService implements DateService {
    private readonly monthFormat = 'long';
    private readonly dayFormat = '2-digit';
    private readonly yearFormat = 'numeric';

    public getWeekFromDate(date: Date): WeekModel {
        const weekNumber = getISOWeek(date);
        return this.getWeek(weekNumber, date.getFullYear());
    }

    public getWeek(weekNumber: number, year: number): WeekModel {
        const firstWeekDay = setISOWeek(new Date(), weekNumber);
        const date = startOfISOWeek(firstWeekDay);

        return <WeekModel> {
            date: date,
            weekNumber: weekNumber,
            year: this.getYear(year),
            month: this.getMonth(year, date.getMonth()),
            days: this.getDaysOfWeek(weekNumber)
        };
    }

    public getNextWeek(currentWeek: WeekModel): WeekModel {
        const nextWeekDate = addWeeks(currentWeek.date, 1);
        return this.getWeekFromDate(nextWeekDate);
    }

    public getPreviousWeek(currentWeek: WeekModel): WeekModel {
        const previousWeekDate = subWeeks(currentWeek.date, 1);
        return this.getWeekFromDate(previousWeekDate);
    }

    private getYear(year: number): Period {
        const formatter = new Intl.DateTimeFormat(undefined, {
            year: this.yearFormat
        });

        const date = new Date(year, 0);

        return <Period>{
            name: formatter.format(date),
            date: date
        };
    }

    private getMonth(year: number, monthIndex: number): Period {
        const formatter = new Intl.DateTimeFormat(undefined, {
            month: this.monthFormat
        });

        const date = new Date(year, monthIndex);

        return <Period> {
            name: formatter.format(date),
            date: date
        };
    }

    private getDaysOfWeek(weekNumber: number): Period[] {
        const formatter = new Intl.DateTimeFormat(undefined, {
            day: this.dayFormat
        });

        const start = startOfISOWeek(weekNumber);
        const end = endOfISOWeek(weekNumber);
        const days = eachDayOfInterval({start, end});

        return days.map(day => <Period> {
            date: day,
            name: formatter.format(day),
        });
    }
}