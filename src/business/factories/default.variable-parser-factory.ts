import {VariableParserFactory} from 'src/business/contracts/variable-parser-factory';
import {VariableParser} from 'src/business/contracts/variable-parser';
import {VariableType} from 'src/domain/models/variable.model';
import {VariableFactory} from 'src/business/contracts/variable-factory';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';
import {ActiveFileVariableParser} from 'src/business/parsers/active-file.variable-parser';
import {PeriodVariableParser} from 'src/business/parsers/period.variable-parser';

export class DefaultVariableParserFactory implements VariableParserFactory {
    constructor(
        private readonly variableFactory: VariableFactory,
        private readonly dateParserFactory: DateParserFactory
    ) {

    }

    public getVariableParser<T>(type: VariableType): VariableParser<T> {
        switch (type) {
            case VariableType.Title:
                return new ActiveFileVariableParser() as VariableParser<T>;
            case VariableType.Date:
                return new PeriodVariableParser(this.variableFactory, this.dateParserFactory.getParser()) as VariableParser<T>;
            case VariableType.Today:
                return new PeriodVariableParser(this.variableFactory, this.dateParserFactory.getParser()) as VariableParser<T>;
        }
    }
}