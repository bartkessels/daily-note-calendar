import {NoteUiModel} from 'src/presentation/models/note.ui-model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {NotesUiModel} from 'src/presentation/models/notes.ui-model';
import React from 'react';
import {useNotesViewModel} from 'src/presentation/context/notes-view-model.context';
import {NoteComponent} from 'src/presentation/components/note.component';

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
                    <NoteComponent
                        key={note.filePath}
                        note={note}
                        onClick={(note) => viewModel?.selectNote(note)}
                        onDelete={(note) => viewModel?.deleteNote(note)} />
                )}
            </ul>
        </div>
    );
}