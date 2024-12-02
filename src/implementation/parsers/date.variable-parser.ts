import {VariableParser} from 'src/domain/parsers/variable.parser';
import {Variable} from 'src/domain/models/variable';
import {DateParser} from 'src/domain/parsers/date.parser';
import {Event} from 'src/domain/events/event';
import {Day} from 'src/domain/models/day';
import {Week} from 'src/domain/models/week';
import {Month} from 'src/domain/models/month';
import {Year} from 'src/domain/models/year';

export class DateVariableParser implements VariableParser {
    private variable: Variable;
    private date: Date;

    constructor(
        dailyNoteEvent: Event<Day>,
        weeklyNoteEvent: Event<Week>,
        monthlyNoteEvent: Event<Month>,
        quarterlyNoteEvent: Event<Month>,
        yearlyNoteEvent: Event<Year>,
        private readonly dateParser: DateParser
    ) {
        dailyNoteEvent.onEvent('DateVariableParser', day => this.date = this.getDateForDay(day));
        weeklyNoteEvent.onEvent('DateVariableParser', week => this.date = this.getDateForWeek(week));
        monthlyNoteEvent.onEvent('DateVariableParser', month => this.date = this.getDateForMonth(month));
        quarterlyNoteEvent.onEvent('DateVariableParser', month => this.date = this.getDateForMonth(month));
        yearlyNoteEvent.onEvent('DateVariableParser', year => this.date = this.getDateForYear(year));
    }

    public create(variable: Variable): DateVariableParser {
        this.variable = variable;
        return this;
    }

    public tryParse(text: string): string {
        if (!this.variable?.template || !this.date) {
            return text;
        }

        return this.dateParser.parse(this.date, this.variable.template);
    }

    private getDateForDay(day: Day): Date {
        return day.completeDate;
    }

    private getDateForWeek(week: Week): Date {
        if (week.days.length <= 0) {
            return new Date();
        }

        return week.days[0].completeDate;
    }

    private getDateForMonth(month: Month): Date {
        if (month.weeks.length <= 0 || month.weeks[0].days.length <= 0) {
            return new Date();
        }

        return month.weeks[0].days[0].completeDate;
    }

    private getDateForYear(year: Year): Date {
        if (year.months.length <= 0 || year.months[0].weeks.length <= 0 || year.months[0].weeks[0].days.length <= 0) {
            return new Date();
        }

        return year.months[0].weeks[0].days[0].completeDate;
    }
}