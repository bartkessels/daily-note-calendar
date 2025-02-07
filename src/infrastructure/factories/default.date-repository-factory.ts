import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';
import {DateRepository} from 'src/infrastructure/contracts/date-repository';
import {DateFnsDateRepository} from 'src/infrastructure/repositories/date-fns.date-repository';

export class DefaultDateRepositoryFactory implements DateRepositoryFactory {
    public getRepository(): DateRepository {
        return new DateFnsDateRepository();
    }
}