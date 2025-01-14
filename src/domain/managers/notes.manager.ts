import {OpenNoteManager} from 'src/domain/managers/open-note.manager';
import {Note} from 'src/domain/models/note';
import {Day} from 'src/domain/models/day';

export interface NotesManager extends OpenNoteManager<Note> {
    refreshNotes(day: Day): Promise<void>;
}