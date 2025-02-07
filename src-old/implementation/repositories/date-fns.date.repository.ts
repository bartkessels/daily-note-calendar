import {Day, DayOfWeek} from 'src-old/domain/models/day';
import {Month} from 'src-old/domain/models/month';
import {Week} from 'src-old/domain/models/week';
import {DateRepository} from 'src-old/domain/repositories/date.repository';
import {Year} from 'src-old/domain/models/year';
import {getISOWeek} from 'date-fns';
import {SettingsRepository} from 'src-old/domain/repositories/settings.repository';
import {GeneralSettings} from 'src-old/domain/models/settings/general.settings';
import {Quarter} from 'src-old/domain/models/quarter';

export class DateFnsDateRepository implements DateRepository {
    private readonly monthFormat = 'long';
    private readonly dayFormat = 'numeric';
    private readonly yearFormat = 'numeric';

    constructor(
        private readonly settingsRepository: SettingsRepository<GeneralSettings>
    ) {
    }

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

    public async getYear(year: number): Promise<Year> {
        const date = new Date(year, 0);
        const formatter = new Intl.DateTimeFormat(undefined, {
            year: this.yearFormat
        });

        return <Year>{
            name: formatter.format(date),
            date: date
        };
    }

    public async getMonth(year: number, monthIndex: number): Promise<Month> {
        const settings = await this.settingsRepository.getSettings();
        const formatter = new Intl.DateTimeFormat(undefined, {
            month: this.monthFormat
        });

        const date = new Date(year, monthIndex);
        const days = this.getDaysOfMonth(year, monthIndex);
        const weeks = this.groupDaysIntoWeeks(days, settings);
        const quarter = Math.floor(monthIndex / 3) + 1;

        return <Month>{
            quarter: <Quarter> {
                date: new Date(year, monthIndex),
                quarter: quarter,
                year: year
            },
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

    private groupDaysIntoWeeks(days: Day[], settings: GeneralSettings): Week[] {
        const weeks: Week[] = [];
        let currentWeek: Day[] = [];

        days.forEach(day => {
            if (currentWeek.length > 0 && day.dayOfWeek === settings.firstDayOfWeek) {
                weeks.push(this.getWeek(currentWeek[0].date, currentWeek));
                currentWeek = [];
            }

            currentWeek.push(day);
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
    }
}