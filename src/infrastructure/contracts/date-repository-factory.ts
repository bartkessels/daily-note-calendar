import { DateRepository } from 'src/infrastructure/contracts/date-repository';

export interface DateRepositoryFactory {
    getRepository(): DateRepository;
}