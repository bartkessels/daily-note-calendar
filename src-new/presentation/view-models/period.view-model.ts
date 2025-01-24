import {Period} from 'src-new/domain/models/date.model';
import {OpenManager} from 'src-new/business/contracts/open-manager';
import {DeleteManager} from 'src-new/business/contracts/delete-manager';
import {CreateManager} from 'src-new/business/contracts/create-manager';

export interface PeriodViewModel {
    create(period: Period): Promise<void>;
    open(period: Period): Promise<void>;
    delete(period: Period): Promise<void>;
}

export class DefaultPeriodViewModel implements PeriodViewModel {
    constructor(
        private readonly createManager: CreateManager<Period>,
        private readonly openManager: OpenManager<Period>,
        private readonly deleteManager: DeleteManager<Period>
    ) {
    }

    public async create(period: Period): Promise<void> {
        await this.createManager.create(period);
    }

    public async open(period: Period): Promise<void> {
        await this.openManager.open(period);
    }

    public async delete(period: Period): Promise<void> {
        await this.deleteManager.delete(period);
    }
}