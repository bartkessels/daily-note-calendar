import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';
import {NameBuilder} from 'src-new/business/contracts/name-builder';
import {PeriodNameBuilder} from 'src-new/business/builders/period.name-builder';
import {DateParserFactory} from 'src-new/infrastructure/contracts/date-parser-factory';

export class DefaultNameBuilderFactory implements NameBuilderFactory {
    constructor(
        private readonly dateParserFactory: DateParserFactory
    ) {

    }

    public getNameBuilder<T>(type: NameBuilderType): NameBuilder<T> {
        switch (type) {
            case NameBuilderType.PeriodicNote:
                return new PeriodNameBuilder(this.dateParserFactory.getParser()) as unknown as NameBuilder<T>;
        }
    }
}