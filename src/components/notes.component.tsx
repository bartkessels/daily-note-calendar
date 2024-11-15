import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {Day} from 'src/domain/models/day';
import {useState} from 'react';
import {getDayNoteRepository} from 'src/components/providers/day-note-repository.context';
import {Note} from 'src/domain/models/note';

export const NotesComponent = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const dailyNoteEvent = getDailyNoteEvent();
    const dayNoteRepository = getDayNoteRepository();

    dailyNoteEvent?.onEvent(async (day: Day) => {
        const notes = await dayNoteRepository?.getNotesCreatedOn(day);
        setNotes(notes ?? []);
    });

    return (
        <ul>
            {notes.map((note: Note) => (
                <li key={note.path} title={note.path}>
                    <span className="note-title">{note.name}</span><br/>
                    <span className="note-date">Created at {note.createdOn.toLocaleTimeString()}</span><br/>
                    <span className="note-path">{note.path}</span>
                </li>
            ))}
        </ul>
    );
}