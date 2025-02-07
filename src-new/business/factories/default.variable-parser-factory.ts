import {VariableParserFactory} from 'src-new/business/contracts/variable-parser-factory';
import {VariableParser} from 'src-new/business/contracts/variable-parser';
import {VariableType} from 'src-new/domain/models/variable.model';
import {VariableFactory} from 'src-new/business/contracts/variable-factory';
import {DateParserFactory} from 'src-new/infrastructure/contracts/date-parser-factory';
import {ActiveFileVariableParser} from 'src-new/business/parsers/active-file.variable-parser';
import {PeriodVariableParser} from 'src-new/business/parsers/period.variable-parser';

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