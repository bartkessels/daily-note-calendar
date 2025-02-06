import {DateManager} from 'src-new/business/contracts/date.manager';

export interface DateManagerFactory {
    getManager(): DateManager;
}