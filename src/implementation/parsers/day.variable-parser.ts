import {Day} from 'src/domain/models/day';
import { DateParser } from 'src/domain/parsers/date.parser';
import {Event} from 'src/domain/events/event';
import {Variable} from 'src/domain/models/variable';
import {VariableParser} from 'src/domain/parsers/variable.parser';

export class DayVariableParser implements VariableParser {
    private variable: Variable;
    private day: Day;

    constructor(
        event: Event<Day>,
        private readonly dateParser: DateParser
    ) {
        event.onEvent('DayVariableParser', day => this.day = day);
    }

    public create(variable: Variable): DayVariableParser {
        this.variable = variable;
        return this;
    }

    public tryParse(text: string): string {
        if (!this.variable?.template || !this.day) {
            return text;
        }

        return this.dateParser.parse(this.day.completeDate, this.variable.template);
    }
}