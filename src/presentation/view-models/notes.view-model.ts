import {NoteUiModel} from 'src/presentation/models/note.ui-model';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {NotesUiModel} from 'src/presentation/models/notes.ui-model';
import {NoteManager} from 'src/business/contracts/note.manager';
import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {Note} from 'src/domain/models/note.model';
import {NoteManagerFactory} from 'src/business/contracts/note-manager-factory';

export interface NotesViewModel {
    setUpdateUiModel(callback: (model: NotesUiModel) => void): void;
    initialize(settings: PluginSettings): void;
    selectNote(note: NoteUiModel): Promise<void>
    loadNotes(period: PeriodUiModel): Promise<void>;
}

export class DefaultNotesViewModel {
    private settings: PluginSettings = DEFAULT_PLUGIN_SETTINGS;
    private uiModel: NotesUiModel | null = null;
    private updateUiModel: (model: NotesUiModel) => void;

    constructor(
        private readonly noteManagerFactory: NoteManagerFactory,
        private readonly notesUiModelBuilder: UiModelBuilder<Note[], NotesUiModel>
    ) {

    }

    public setUpdateUiModel(callback: (model: NotesUiModel) => void): void {
        this.updateUiModel = callback;
    }

    private setModel(model: NotesUiModel): void {
        // Only update the UI model if it's the latest version of the UI model
        if (!this.uiModel || model.lastUpdated > this.uiModel.lastUpdated) {
            this.uiModel = model;
            this.updateUiModel(model);
        }
    }

    public initialize(settings: PluginSettings): void {
        this.settings = settings;
        this.notesUiModelBuilder.withSettings(settings);
    }

    public async selectNote(note: NoteUiModel): Promise<void> {
        await this.noteManagerFactory.getManager().openNote(note.note);
    }

    public async loadNotes(period: PeriodUiModel): Promise<void> {
        const notes = await this.noteManagerFactory.getManager().getNotesForPeriod(period.period);
        const uiModel = await this.notesUiModelBuilder
            .withValue(notes)
            .build();

        this.setModel(uiModel);
    }
}