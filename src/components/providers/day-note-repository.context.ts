import {createContext, useContext} from 'react';
import {Day} from 'src/domain/models/day';
import {NoteRepository} from 'src/domain/repositories/note.repository';

export const DayNoteRepositoryContext = createContext<NoteRepository<Day> | null>(null);
export const getDayNoteRepository = (): NoteRepository<Day> | null => {
    return useContext(DayNoteRepositoryContext);
}
