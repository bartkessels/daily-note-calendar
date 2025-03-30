import {DateManager} from 'src/business/contracts/date.manager';

export interface DateManagerFactory {
    getManager(): DateManager;
}