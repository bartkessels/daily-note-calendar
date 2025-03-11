import {NoteUiModel} from 'src/presentation/models/note.ui-model';

export interface NotesComponentProperties {
    notes?: NoteUiModel[];
    onNoteClicked: (note: NoteUiModel) => void;
}

export const NotesComponent = (props: NotesComponentProperties) => {
    return (
        <div className="dnc">
            <ul>
                {props.notes?.map((note: NoteUiModel) =>
                    <li
                        key={note.filePath}
                        onClick={() => props.onNoteClicked(note)}>
                        <span className="note-title">{note.name}</span><br/>
                        <span className="note-date">Created at {note.date}</span><br/>
                        <span className="note-path">{note.filePath}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}