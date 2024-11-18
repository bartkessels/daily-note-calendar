import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';
import {Day} from 'src/domain/models/day';
import {useState} from 'react';
import {Note} from 'src/domain/models/note';
import {getNoteEvent} from 'src/components/providers/note-event.context';
import {getNotesManager} from 'src/components/providers/notes-manager.context';

export const NotesComponent = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const dailyNoteEvent = getDailyNoteEvent();
    const noteEvent = getNoteEvent();
    const notesManager = getNotesManager();

    dailyNoteEvent?.onEvent(async (day: Day) => {
        const notes = await notesManager?.getNotesCreatedOn(day);
        setNotes(notes ?? []);
    });

    return (
        <ul>
            {notes.map((note: Note) => (
                <li key={note.path} title={note.path} onClick={() => noteEvent?.emitEvent(note)}>
                    <span className="note-title">{note.name}</span><br/>
                    <span className="note-date">Created at {note.createdOn.toLocaleTimeString()}</span><br/>
                    <span className="note-path">{note.path}</span>
                </li>
            ))}
        </ul>
    );
}