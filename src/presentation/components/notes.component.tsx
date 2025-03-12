import {NoteUiModel} from 'src/presentation/models/note.ui-model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {NotesUiModel} from 'src/presentation/models/notes.ui-model';
import React from 'react';
import {useNotesViewModel} from 'src/presentation/context/notes-view-model.context';

export interface NotesComponentProperties {
    period?: PeriodUiModel;
    initialUiModel?: NotesUiModel;
}

export const NotesComponent = (props: NotesComponentProperties) => {
    const [uiModel, setUiModel] = React.useState<NotesUiModel | undefined>(props.initialUiModel);
    const viewModel = useNotesViewModel();

    viewModel?.setUpdateUiModel(setUiModel);

    React.useEffect(() => {
        if (props.period) {
            viewModel?.loadNotes(props.period);
        }
    }, [viewModel, props.period]);

    return (
        <div className="dnc">
            <ul>
                {uiModel?.notes.map((note: NoteUiModel) =>
                    <li
                        key={note.filePath}
                        onClick={() => viewModel?.selectNote(note)}>
                        <span className="note-title">{note.name}</span><br/>
                        <span className="note-date">Created at {note.date}</span><br/>
                        <span className="note-path">{note.filePath}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}