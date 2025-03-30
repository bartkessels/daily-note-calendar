import {NameBuilderFactory, NameBuilderType} from 'src/business/contracts/name-builder-factory';
import {NameBuilder} from 'src/business/contracts/name-builder';
import {PeriodNameBuilder} from 'src/business/builders/period.name-builder';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';

export class DefaultNameBuilderFactory implements NameBuilderFactory {
    constructor(
        private readonly dateParserFactory: DateParserFactory
    ) {

    }

    public getNameBuilder<T>(type: NameBuilderType): NameBuilder<T> {
        switch (type) {
            case NameBuilderType.PeriodicNote:
                return new PeriodNameBuilder(this.dateParserFactory) as NameBuilder<T>;
        }
    }
}