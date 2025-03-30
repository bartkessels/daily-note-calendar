import {VariableParser} from 'src/business/contracts/variable-parser';
import {VariableFactory} from 'src/business/contracts/variable-factory';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import 'src/extensions/extensions';

export class TodayVariableParser implements VariableParser<Date> {
    private static readonly variablePattern = /{{today.*?}}/g;

    constructor(
        private readonly variableFactory: VariableFactory,
        private readonly dateParserFactory: DateParserFactory
    ) {

    }

    public parseVariables(content: string, value: Date): string {
        const dateParser = this.dateParserFactory.getParser();

        return content.replace(TodayVariableParser.variablePattern, (variableDeclaration: string, _: any): string => {
            const variable = this.variableFactory.getVariable(variableDeclaration);
            return dateParser.fromDate(value.calculate(variable.calculus), variable.template!);
        });
    }
}