import {VariableParser} from 'src/business/contracts/variable-parser';
import {VariableFactory} from 'src/business/contracts/variable-factory';
import {DateParser} from 'src/infrastructure/contracts/date-parser';

export class TodayVariableParser implements VariableParser<Date> {
    private static readonly variablePattern = /{{today.*?}}/g;

    constructor(
        private readonly variableFactory: VariableFactory,
        private readonly dateParser: DateParser
    ) {

    }

    public parseVariables(content: string, value: Date): string {
        return content.replace(TodayVariableParser.variablePattern, (variableDeclaration: string, _: any): string => {
            const variable = this.variableFactory.getVariable(variableDeclaration);
            return this.dateParser.fromDate(value.calculate(variable.calculus), variable.template!);
        });
    }
}