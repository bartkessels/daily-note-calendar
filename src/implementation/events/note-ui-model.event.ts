import {Event} from 'src/domain/events/event';
import {NoteUiModel} from 'src/components/models/note.ui-model';

export class NoteUiModelEvent extends Event<NoteUiModel[]> { }