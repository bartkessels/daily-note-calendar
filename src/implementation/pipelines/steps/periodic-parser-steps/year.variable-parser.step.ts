import {PeriodicVariableParserStep} from 'src/implementation/pipelines/steps/periodic.variable-parser.step';
import {DateParser} from 'src/domain/parsers/date.parser';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {Year} from 'src/domain/models/year';

export class YearVariableParserStep extends PeriodicVariableParserStep<Year> {
    constructor(fileAdapter: FileAdapter, variableBuilder: VariableBuilder, dateParser: DateParser) {
        super(fileAdapter, variableBuilder, dateParser);
    }

    protected override getDate(value: Year): Date {
        return value.months[0].weeks[0].days[0].completeDate;
    }
}