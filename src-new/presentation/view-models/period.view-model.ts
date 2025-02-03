import {Period} from 'src-new/domain/models/period.model';
import {GeneralSettings} from 'src-new/domain/settings/general.settings';
import {ModifierKey} from 'src/domain/models/modifier-key';

export interface PeriodViewModel {
    create(key: ModifierKey, period: Period): Promise<void>;
    open(period: Period): Promise<void>;
    delete(period: Period): Promise<void>;
}

export class DefaultPeriodViewModel implements PeriodViewModel {
    private settings: GeneralSettings;

    constructor(
        private readonly createManager: CreateManager<Period>,
        private readonly openManager: OpenManager<Period>,
        private readonly deleteManager: DeleteManager<Period>
    ) {
    }

    public setSettings(settings: GeneralSettings): void {
        this.settings = settings;
    }

    public async create(key: ModifierKey, period: Period): Promise<void> {
        if (this.settings.useModifierKeyToCreateNote && !this.isCreateFileModifierKey(key)) {
            return;
        }

        await this.createManager.create(period);
    }

    public async open(period: Period): Promise<void> {
        await this.openManager.open(period);
    }

    public async delete(period: Period): Promise<void> {
        await this.deleteManager.delete(period);
    }

    private isCreateFileModifierKey(modifierKey: ModifierKey): boolean {
        return modifierKey === ModifierKey.Alt || modifierKey === ModifierKey.Meta;
    }
}