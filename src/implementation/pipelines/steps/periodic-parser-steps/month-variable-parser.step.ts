import {PeriodicVariableParserStep} from 'src/implementation/pipelines/steps/periodic-variable-parser.step';
import {DateParser} from 'src/domain/parsers/date.parser';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {Month} from 'src/domain/models/month';

export class MonthVariableParserStep extends PeriodicVariableParserStep<Month> {
    constructor(fileAdapter: FileAdapter, variableBuilder: VariableBuilder, dateParser: DateParser) {
        super(fileAdapter, variableBuilder, dateParser);
    }

    protected override getDate(value: Month): Date | null {
        if (value.weeks.length === 0) {
            return null;
        } else if (value.weeks[0].days.length === 0) {
            return null;
        }

        return value.weeks[0].days[0].completeDate;
    }
}