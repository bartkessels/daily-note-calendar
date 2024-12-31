import {useNotesViewModel} from 'src/components/viewmodels/notes.view-model.provider';
import {NoteUiModel} from 'src/components/models/note.ui-model';
import {NoteComponent} from 'src/components/notes/note.component';

export const NotesComponent = () => {
    const viewModel = useNotesViewModel();
    const uiModel = viewModel?.viewState.notes;

    return (
        <div className="dnc">
            <ul>
                {uiModel?.map((note: NoteUiModel) =>
                    <NoteComponent key={note.displayFilePath} note={note} />
                )}
            </ul>
        </div>
    );
}