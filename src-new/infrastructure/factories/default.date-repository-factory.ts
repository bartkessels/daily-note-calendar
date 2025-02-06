import {DateRepositoryFactory} from 'src-new/infrastructure/contracts/date-repository-factory';
import {DateRepository} from 'src-new/infrastructure/contracts/date-repository';
import {DateFnsDateRepository} from 'src-new/infrastructure/repositories/date-fns.date-repository';

export class DefaultDateRepositoryFactory implements DateRepositoryFactory {
    public getRepository(): DateRepository {
        return new DateFnsDateRepository();
    }
}