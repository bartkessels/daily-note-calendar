import { Day, DayOfWeek } from "src/domain/models/Day";
import { Month } from "src/domain/models/Month";
import { Week } from "src/domain/models/Week";
import { DateRepository } from "src/domain/repositories/date.repository";

export class DefaultDateRepository implements DateRepository {
    private readonly monthFormat = "long";
    private readonly dayFormat = "numeric";

    public getMonth(year: number, month: number): Month {
        const formatter = new Intl.DateTimeFormat(undefined, {
            month: this.monthFormat
        });

        const days = this.getDaysOfMonth(year, month);
        const weeks = this.groupDaysIntoWeeks(days);

        return <Month> {
            monthIndex: month,
            year: year,
            name: formatter.format(new Date(year, month)),
            weeks: weeks
        };
    }

    private getDaysOfMonth(year: number, month: number): Day[] {
        const date = new Date(year, month, 1);
        var daysList = [];

        while(date.getMonth() === month) {
            daysList.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        const formatter = new Intl.DateTimeFormat(undefined, {
            day: this.dayFormat
        });
        
        return daysList.map(day => {
            const completeDate = new Date(year, month, day.getDate());

            return <Day> {
                dayOfWeek: this.getDayOfWeek(completeDate.getDay()),
                date: day.getDate(),
                name: formatter.format(new Date(year, month, day.getDate())),
                completeDate: completeDate
            };
        });
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

    private getDayOfWeek(value: number): DayOfWeek  {
        switch (value) {
            case 1: return DayOfWeek.Monday;
            case 2: return DayOfWeek.Tuesday;
            case 3: return DayOfWeek.Wednesday;
            case 4: return DayOfWeek.Thursday;
            case 5: return DayOfWeek.Friday;
            case 6: return DayOfWeek.Saturday;
            default: return DayOfWeek.Sunday;
        }
    };
}