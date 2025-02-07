import {VariableParser} from 'src/business/contracts/variable-parser';
import {VariableFactory} from 'src/business/contracts/variable-factory';
import {Period} from 'src/domain/models/period.model';
import {DateParser} from 'src/infrastructure/contracts/date-parser';

export class PeriodVariableParser implements VariableParser<Period> {
    private static readonly variablePattern = /{{date.*?}}/g;

    constructor(
        private readonly variableFactory: VariableFactory,
        private readonly dateParser: DateParser
    ) {

    }

    public parseVariables(content: string, value: Period): string {
        return content.replace(PeriodVariableParser.variablePattern, (variableDeclaration: string, _: any): string => {
            const variable = this.variableFactory.getVariable(variableDeclaration);
            return this.dateParser.fromDate(value.date.calculate(variable.calculus), variable.template!);
        });
    }
}