import {Day} from 'src/domain/models/day';
import { DateParser } from 'src/domain/parsers/date.parser';
import {Variable} from 'src/domain/models/variable';
import {VariableParser} from 'src/domain/parsers/variable.parser';

export class DayVariableParser implements VariableParser<Day> {
    private day?: Day;

    constructor(
        private readonly dateParser: DateParser
    ) {

    }

    public setValue(value: Day) {
        this.day = value;
    }

    public tryParse(variable: Variable, text: string): string {
        if (!variable.template || !this.day) {
            return text;
        }

        return this.dateParser.parse(this.day.completeDate, variable.template);
    }
}