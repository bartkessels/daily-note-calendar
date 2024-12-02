import {VariableParser} from 'src/domain/parsers/variable.parser';
import {Week} from 'src/domain/models/week';
import {Variable} from 'src/domain/models/variable';
import {DateParser} from 'src/domain/parsers/date.parser';

export class WeekVariableParser implements VariableParser<Week> {
    private variable?: Variable;
    private week?: Week;

    constructor(
        private readonly dateParser: DateParser
    ) {

    }

    public setValue(value: Week) {
        this.week = value;
    }

    public create(variable: Variable): WeekVariableParser {
        this.variable = variable;
        return this;
    }

    public tryParse(text: string): string {
        if (!this.variable?.template || !this.week?.days || this.week.days.length <= 0) {
            return text;
        }

        const date = this.week.days[0].completeDate;
        return this.dateParser.parse(date, this.variable.template);
    }
}