import {NoteManager} from 'src/domain/managers/note.manager';
import {Note} from 'src/domain/models/note';
import {Day} from 'src/domain/models/day';

export interface NotesManager extends NoteManager<Note> {
    refreshNotes(day: Day): Promise<void>;
}