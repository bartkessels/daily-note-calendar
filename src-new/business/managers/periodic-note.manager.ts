import {Period} from 'src-new/domain/models/date.model';
import {DeleteManager} from 'src-new/business/contracts/delete-manager';
import {OpenManager} from 'src-new/business/contracts/open-manager';
import {CreateManager} from 'src-new/business/contracts/create-manager';
import {Settings} from 'src-new/domain/settings/settings';
import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';
import {NameBuilder} from 'src-new/business/contracts/name-builder';

export class PeriodicNoteManager<T extends Period, S extends Settings> implements CreateManager<T>, OpenManager<T>, DeleteManager<T> {
    private readonly nameBuilder: NameBuilder<T>;

    constructor(
        nameBuilderFactory: NameBuilderFactory
    ) {
        this.nameBuilder = nameBuilderFactory.getNameBuilder(NameBuilderType.PeriodicNote);
    }

    public async create(value: T): Promise<void> {
        // TODO: Get active file
        // TODO: Create file
        // TODO: Fix variables
    }

    public async open(value: T): Promise<void> {

    }

    public async delete(value: T): Promise<void> {

    }
}