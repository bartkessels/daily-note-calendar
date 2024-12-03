import {PeriodicVariableParserStep} from 'src/implementation/pipelines/steps/periodic.variable-parser.step';
import {DateParser} from 'src/domain/parsers/date.parser';
import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {Week} from 'src/domain/models/week';

export class WeekVariableParserStep extends PeriodicVariableParserStep<Week> {
    constructor(fileAdapter: FileAdapter, variableBuilder: VariableBuilder, dateParser: DateParser) {
        super(fileAdapter, variableBuilder, dateParser);
    }

    protected override getDate(value: Week): Date {
        return value.days[0].completeDate;
    }
}