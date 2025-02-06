import { DateRepository } from 'src-new/infrastructure/contracts/date-repository';

export interface DateRepositoryFactory {
    getRepository(): DateRepository;
}