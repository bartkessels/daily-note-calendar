import {Period} from 'src-new/domain/models/date.model';
import {DeleteManager} from 'src-new/business/contracts/delete-manager';
import {OpenManager} from 'src-new/business/contracts/open-manager';
import {CreateManager} from 'src-new/business/contracts/create-manager';
import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';
import {NameBuilder} from 'src-new/business/contracts/name-builder';
import {VariableFactory} from 'src-new/business/contracts/variable-factory';
import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {PeriodNoteSettings} from 'src-new/domain/settings/period-note.settings';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';

export class PeriodicNoteManager<T extends Period> implements CreateManager<T>, OpenManager<T>, DeleteManager<T> {
    private readonly nameBuilder: NameBuilder<T>;

    constructor(
        nameBuilderFactory: NameBuilderFactory,
        private readonly fileAdapter: FileAdapter,
        private readonly settingsRepository: SettingsRepository<PeriodNoteSettings>,
        private readonly variableFactory: VariableFactory
    ) {
        this.nameBuilder = nameBuilderFactory.getNameBuilder(NameBuilderType.PeriodicNote);
    }

    public async create(value: T): Promise<void> {


        // TODO: Get active file
        // TODO: Create file
        // TODO: Fix variables
    }

    public async open(value: T): Promise<void> {
        const filePath = await this.getFilePath(value);
        await this.fileAdapter.open(filePath);
    }

    public async delete(value: T): Promise<void> {

    }

    private async getFilePath(value: T): Promise<string> {
        const settings = await this.settingsRepository.get();
        return this.nameBuilder
            .withPath(settings.folderTemplate)
            .withName(settings.nameTemplate)
            .withValue(value)
            .build();
    }
}