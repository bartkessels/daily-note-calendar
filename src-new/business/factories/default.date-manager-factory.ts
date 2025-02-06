import {DateManagerFactory} from 'src-new/business/contracts/date-manager-factory';
import {DateManager} from 'src-new/business/contracts/date.manager';
import {RepositoryDateManager} from 'src-new/business/managers/repository.date-manager';
import {DateRepositoryFactory} from 'src-new/infrastructure/contracts/date-repository-factory';

export class DefaultDateManagerFactory implements DateManagerFactory {
    constructor(
        private readonly dateRepositoryFactory: DateRepositoryFactory
    ) {

    }

    public getManager(): DateManager {
        return new RepositoryDateManager(this.dateRepositoryFactory);
    }
}