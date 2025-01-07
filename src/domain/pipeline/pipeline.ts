import {FileService} from 'src/domain/services/file.service';
import {isCreateFileModifierKey, ModifierKey} from 'src/domain/models/modifier-key';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {GeneralSettings} from 'src/domain/models/settings/general.settings';
import {ManageAction, ManageEvent} from 'src/domain/events/manage.event';

export abstract class Pipeline<T> {
    private readonly preCreateSteps: PreCreateStep<T>[] = [];
    private readonly postCreateSteps: PostCreateStep<T>[] = [];

    protected constructor(
        event: ManageEvent<T>,
        protected readonly fileService: FileService,
        private readonly generalSettingsSettingsRepository: SettingsRepository<GeneralSettings>
    ) {
        event.onEventWithModifier('pipeline', this.process.bind(this));
    }

    public registerPreCreateStep(step: PreCreateStep<T>): Pipeline<T> {
        this.preCreateSteps.push(step);
        return this;
    }

    public registerPostCreateStep(step: PostCreateStep<T>): Pipeline<T> {
        this.postCreateSteps.push(step);
        return this;
    }

    protected abstract getFilePath(value: T): Promise<string>;
    protected abstract createFile(filePath: string): Promise<void>;

    public async process(value: T, action: ManageAction, modifierKey: ModifierKey): Promise<void> {
        if (action !== ManageAction.Open) {
            return;
        }

        const settings = await this.generalSettingsSettingsRepository.getSettings();
        const filePath = await this.getFilePath(value);
        const doesFileExist = await this.fileService.doesFileExist(filePath);
        const createNewFile = (settings.useModifierKeyToCreateNote && isCreateFileModifierKey(modifierKey)) || !settings.useModifierKeyToCreateNote;

        if (!doesFileExist && createNewFile) {
            await this.executePreCreateSteps(value);
            await this.createFile(filePath);
            await this.executePostCreateSteps(filePath, value);
        }

        if (doesFileExist || createNewFile) {
            await this.fileService.tryOpenFile(filePath);
        }
    }

    private async executePreCreateSteps(value: T): Promise<void> {
        for (const step of this.preCreateSteps) {
            await step.executePreCreate(value);
        }
    }

    private async executePostCreateSteps(filePath: string, value: T): Promise<void> {
        for (const step of this.postCreateSteps) {
            await step.executePostCreate(filePath, value);
        }
    }
}

export interface PreCreateStep<T> {
    executePreCreate(value: T): Promise<void>;
}

export interface PostCreateStep<T> {
    executePostCreate(filePath: string, value: T): Promise<void>;
}
