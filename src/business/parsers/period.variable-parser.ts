import {VariableParser} from 'src/business/contracts/variable-parser';
import {VariableFactory} from 'src/business/contracts/variable-factory';
import {Period} from 'src/domain/models/period.model';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';

export class PeriodVariableParser implements VariableParser<Period> {
    private static readonly variablePattern = /{{date.*?}}/g;

    constructor(
        private readonly variableFactory: VariableFactory,
        private readonly dateParserFactory: DateParserFactory
    ) {

    }

    public parseVariables(content: string, value: Period): string {
        const dateParser = this.dateParserFactory.getParser();

        return content.replace(PeriodVariableParser.variablePattern, (variableDeclaration: string, _: any): string => {
            const variable = this.variableFactory.getVariable(variableDeclaration);
            return dateParser.fromDate(value.date.calculate(variable.calculus), variable.template!);
        });
    }
}