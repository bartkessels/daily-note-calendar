import {DateManagerFactory} from 'src/business/contracts/date-manager-factory';
import {DateManager} from 'src/business/contracts/date.manager';
import {RepositoryDateManager} from 'src/business/managers/repository.date-manager';
import {DateRepositoryFactory} from 'src/infrastructure/contracts/date-repository-factory';

export class DefaultDateManagerFactory implements DateManagerFactory {
    constructor(
        private readonly dateRepositoryFactory: DateRepositoryFactory
    ) {

    }

    public getManager(): DateManager {
        return new RepositoryDateManager(this.dateRepositoryFactory);
    }
}