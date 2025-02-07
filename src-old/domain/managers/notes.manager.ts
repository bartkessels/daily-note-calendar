import {NoteManager} from 'src-old/domain/managers/note.manager';
import {Note} from 'src-old/domain/models/note';
import {Day} from 'src-old/domain/models/day';

export interface NotesManager extends NoteManager<Note> {
    refreshNotes(day: Day): Promise<void>;
}