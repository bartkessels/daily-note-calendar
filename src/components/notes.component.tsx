import {useState} from 'react';
import {Note} from 'src/domain/models/note';
import {getRefreshNotesEvent} from 'src/components/providers/refresh-notes-event.context';
import {getNoteEvent} from 'src/components/providers/note-event.context';

export const NotesComponent = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const noteEvent = getNoteEvent();
    const refreshNotesEvent = getRefreshNotesEvent();

    refreshNotesEvent?.onEvent(NotesComponent, (notes: Note[]) => {
       setNotes(notes);
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