import {VariableParser} from 'src/domain/parsers/variable.parser';
import {Variable, VariableType} from 'src/domain/models/variable';
import {DateParser} from 'src/domain/parsers/date.parser';

export class DateVariableParser extends VariableParser {

    constructor(
        private readonly dateParser: DateParser
    ) {
        super();
    }

    protected override parseVariable(date: Date, type: string, template?: string): Variable {
        let value: string | null = null;

        if (template) {
            value = this.dateParser.parse(date, template);
        }

        return <Variable>{
            name: type,
            template: template,
            value: value,
            type: VariableType.Date
        };
    }
}