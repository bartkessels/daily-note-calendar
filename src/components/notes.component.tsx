import {getNoteEvent} from 'src/components/providers/note-event.context';
import {useNotesViewModel} from 'src/components/viewmodels/notes.view-model.provider';
import {NoteUiModel} from 'src/components/models/note.ui-model';

export const NotesComponent = () => {
    const viewModel = useNotesViewModel();
    const noteEvent = getNoteEvent();
    const uiModel = viewModel?.viewState.notes;

    return (
        <div className="dnc">
            <ul>
                {uiModel?.map((note: NoteUiModel) => (
                    <li key={note.displayFilePath} title={note.displayFilePath} onClick={() => noteEvent?.emitEvent(note?.note)}>
                        <span className="note-title">{note.displayName}</span><br/>
                        <span className="note-date">Created at {note.displayDate}</span><br/>
                        <span className="note-path">{note.displayFilePath}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}