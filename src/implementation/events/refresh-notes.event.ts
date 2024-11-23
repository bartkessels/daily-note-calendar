import {Event} from 'src/domain/events/event';
import {Note} from 'src/domain/models/note';

export class RefreshNotesEvent extends Event<Note[]> {
}