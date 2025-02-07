import {Event} from 'src-old/domain/events/event';
import {Note} from 'src-old/domain/models/note';

export class RefreshNotesEvent extends Event<Note[]> {}