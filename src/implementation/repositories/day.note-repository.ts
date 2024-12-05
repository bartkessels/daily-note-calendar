import {Day} from 'src/domain/models/day';
import {NoteRepository} from 'src/domain/repositories/note.repository';
import {Note} from 'src/domain/models/note';
import {NoteAdapter} from 'src/domain/adapters/note.adapter';

export class DayNoteRepository implements NoteRepository<Day> {
    constructor(
        private readonly noteRepository: NoteAdapter
    ) {

    }

    public async getNotesCreatedOn(date: Day): Promise<Note[]> {
        return await this.noteRepository.getNotesCreatedOn(date.date);
    }
}