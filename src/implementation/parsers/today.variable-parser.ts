import { Variable } from 'src/domain/models/variable';
import { DateParser } from 'src/domain/parsers/date.parser';
import {VariableParser} from 'src/domain/parsers/variable.parser';

export class TodayVariableParser implements VariableParser {
    private variable: Variable;
    private readonly today: Date;

    constructor(
        private readonly dateParser: DateParser
    ) {
        this.today = new Date();
    }

    public create(variable: Variable): TodayVariableParser {
        this.variable = variable;
        return this;
    }

    tryParse(text: string): string {
        if (!this.variable?.template) {
            return text;
        }

        return this.dateParser.parse(this.today, this.variable.template);
    }
}