import {VariableParser} from 'src/business/contracts/variable-parser';
import {VariableFactory} from 'src/business/contracts/variable-factory';
import {Period} from 'src/domain/models/period.model';
import {DateParser} from 'src/infrastructure/contracts/date-parser';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';

export class PeriodVariableParser implements VariableParser<Period> {
    private static readonly variablePattern = /{{date.*?}}/g;
    private readonly dateParser: DateParser;

    constructor(
        private readonly variableFactory: VariableFactory,
        dateParserFactory: DateParserFactory
    ) {
        this.dateParser = dateParserFactory.getParser();
    }

    public parseVariables(content: string, value: Period): string {
        return content.replace(PeriodVariableParser.variablePattern, (variableDeclaration: string, _: any): string => {
            const variable = this.variableFactory.getVariable(variableDeclaration);
            return this.dateParser.fromDate(value.date.calculate(variable.calculus), variable.template!);
        });
    }
}