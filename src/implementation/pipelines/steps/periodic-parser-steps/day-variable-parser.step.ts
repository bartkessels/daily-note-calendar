import {Day} from 'src/domain/models/day';
import {PeriodicVariableParserStep} from 'src/implementation/pipelines/steps/periodic-variable-parser.step';
import {DateParser} from 'src/domain/parsers/date.parser';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {FileAdapter} from 'src/domain/adapters/file.adapter';

export class DayVariableParserStep extends PeriodicVariableParserStep<Day> {
    constructor(fileAdapter: FileAdapter, variableBuilder: VariableBuilder, dateParser: DateParser) {
        super(fileAdapter, variableBuilder, dateParser);
    }

    protected override getDate(value: Day): Date {
        return value.completeDate;
    }
}