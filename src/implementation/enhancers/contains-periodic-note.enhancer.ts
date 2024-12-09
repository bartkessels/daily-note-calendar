import {Enhancer} from 'src/domain/enhancers/enhancer';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import { NameBuilder } from 'src/domain/builders/name.builder';
import {Period} from 'src/domain/models/period';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import {PeriodicNoteSettings} from 'src/domain/models/settings/periodic-note.settings';

export class ContainsPeriodicNoteEnhancer<T extends Period, S extends PeriodicNoteSettings> implements Enhancer<T> {
    constructor(
        private readonly settingsRepository: SettingsRepository<S>,
        private readonly nameBuilder: NameBuilder<T>,
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async enhance(value: T): Promise<T> {
        const settings = await this.settingsRepository.getSettings();
        const path = this.nameBuilder
            .withPath(settings.folder)
            .withNameTemplate(settings.nameTemplate)
            .withValue(value)
            .build();

        const hasPeriodicNote = await this.fileAdapter.doesFileExist(path);
        return <T>{
            ...value,
            properties: {
                ...value.properties,
                hasPeriodicNote: hasPeriodicNote
            }
        };
    }
}