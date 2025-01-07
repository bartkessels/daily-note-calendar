import {Pipeline} from 'src/domain/pipeline/pipeline';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileService} from 'src/domain/services/file.service';
import {Period} from 'src/domain/models/period';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';
import {ManageAction, ManageEvent} from 'src/domain/events/manage.event';

export class PeriodicNotePipeline<S extends PeriodicNoteSettings> extends Pipeline<Period> {
    constructor(
        event: ManageEvent<Period>,
        fileService: FileService,
        generalSettingsRepository: SettingsRepository<GeneralSettings>,
        private readonly settingsRepository: SettingsRepository<S>,
        private readonly nameBuilder: NameBuilder<Period>
    ) {
        super(event, fileService, generalSettingsRepository);
        event.onEvent('PeriodicNotePipeline', (period, action) => this.managePeriodEvent(period, action));
    }

    protected override async getFilePath(value: Period): Promise<string> {
        const settings = await this.settingsRepository.getSettings();
        return this.nameBuilder
            .withNameTemplate(settings.nameTemplate)
            .withValue(value)
            .withPath(settings.folder)
            .build();
    }

    protected override async createFile(filePath: string): Promise<void> {
        const settings = await this.settingsRepository.getSettings();
        await this.fileService.createFileWithTemplate(filePath, settings.templateFile);
    }

    private async managePeriodEvent(period: Period, action: ManageAction): Promise<void> {
        if (action === ManageAction.Delete) {
            await this.tryDeletePeriod(period);
        }
    }

    private async tryDeletePeriod(period: Period): Promise<void> {
        const filePath = await this.getFilePath(period);
        await this.fileService.tryDeleteFile(filePath);
    }
}