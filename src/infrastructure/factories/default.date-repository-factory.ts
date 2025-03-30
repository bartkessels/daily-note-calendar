import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';
import {DateFnsDateRepository} from 'src/infrastructure/repositories/date-fns.date-repository';
import {DateParserFactory} from 'src/infrastructure/contracts/date-parser-factory';

export class DefaultDateRepositoryFactory implements DateRepositoryFactory {
    constructor(
        private readonly dateParserFactory: DateParserFactory
    ) {

    }

    public getRepository(): DateRepository {
        return new DateFnsDateRepository(this.dateParserFactory);
    }
}