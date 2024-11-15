import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {Day} from 'src/domain/models/day';
import {useState} from 'react';
import {getDayNoteRepository} from 'src/components/providers/day-note-repository.context';
import {Note} from 'src/domain/models/note';

export const NotesComponent = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const dailyNoteEvent = getDailyNoteEvent();
    const dayNoteRepository = getDayNoteRepository();

    dailyNoteEvent?.onEvent((day: Day) => {
        dayNoteRepository?.getNotesCreatedOn(day).then((notes: Note[]) => {
            setNotes(notes);
        });
    });

    return (
        <ul>
            {notes.map((note: Note) => (
                <li key={note.path}>
                    <span className='note-title'>{note.name}</span><br />
                    <span className='note-date'>{note.createdOn.toLocaleDateString()}</span>
                </li>
            ))}
        </ul>
    );
}