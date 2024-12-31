import {Event} from 'src/domain/events/event';
import {Note} from 'src/domain/models/note';

export class DeleteNoteEvent extends Event<Note> {}