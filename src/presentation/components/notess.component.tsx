import React, {Suspense, useEffect, useMemo} from 'react';
import {NoteComponent} from 'src/presentation/components/note.component';
import {Period} from 'src/domain/models/period.model';
import {Note} from 'src/domain/models/note.model';
import {useNotesViewModel} from 'src/presentation/context/view-model.context';

export interface NotesComponentProperties {
    period: Period;
}

export const NotessComponent = (props: NotesComponentProperties) => {
    const viewModel = useNotesViewModel();
    const [loading, setLoading] = React.useState(true);
    const [notes, setNotes] = React.useState<Note[]>([]);
    const worker: Worker = useMemo(() => new Worker(new URL('../workers/note.worker.ts')), []);

    const loadNotes = () => {
        setLoading(true);
        worker.postMessage(async () => {
            return viewModel?.loadNotes(props.period);
        });
    }

    React.useEffect(() => {
        worker.onmessage = (message: MessageEvent<Note[]>) => setNotes(message.data);
        viewModel?.initializeCallbacks(loadNotes);
        loadNotes();
    }, [viewModel, setNotes, setLoading, props.period]);

    if (loading) {
        return (<p>Loading...</p>)
    }

    return (
        <div className="dnc">
            <ul>
                {notes.map((note: Note) =>
                    <NoteComponent
                        key={note.path}
                        note={note}
                        onOpenInHorizontalSplitView={(note) => viewModel?.openNoteInHorizontalSplitView(note)}
                        onOpenInVerticalSplitView={(note) => viewModel?.openNoteInVerticalSplitView(note)}
                        onClick={(note) => viewModel?.openNote(note)}
                        onDelete={(note) => viewModel?.deleteNote(note)}/>
                )}
            </ul>
        </div>
    );
};