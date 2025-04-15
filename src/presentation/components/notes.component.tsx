import React, {Component, ContextType, ReactElement} from 'react';
import {Note} from 'src/domain/models/note.model';
import {NotesViewModel} from 'src/presentation/contracts/notes.view-model';
import {Period} from 'src/domain/models/period.model';
import {NoteComponent} from 'src/presentation/components/note.component';
import {ViewModelsContext} from 'src/presentation/context/view-model.context';

export interface NotesComponentProperties {
    period: Period;
}

export interface NotesComponentState {
    notes: Note[] | null;
}

export class NotesComponent extends Component<NotesComponentProperties, NotesComponentState> {
    private viewModel: NotesViewModel | null = null;
    static contextType = ViewModelsContext;

    constructor(properties: NotesComponentProperties) {
        super(properties);
    }

    public async componentDidMount(): Promise<void> {
        const context = this.context as ContextType<typeof ViewModelsContext>;
        this.viewModel = context?.notesViewModel ?? null;
        this.viewModel?.initializeCallbacks(() => this.componentDidMount());

        const notes = await this.viewModel?.loadNotes(this.props.period);
        this.setState({notes: notes ?? null});
    }

    public render(): ReactElement {
        const notes = this.state?.notes;

        return (
            <div className="dnc">
                <ul>
                    {notes?.map((note: Note) =>
                        <NoteComponent
                            key={note.path}
                            note={note}
                            onOpenInHorizontalSplitView={(note) => this.viewModel?.openNoteInHorizontalSplitView(note)}
                            onOpenInVerticalSplitView={(note) => this.viewModel?.openNoteInVerticalSplitView(note)}
                            onClick={(note) => this.viewModel?.openNote(note)}
                            onDelete={(note) => this.viewModel?.deleteNote(note)}/>
                    )}
                </ul>
            </div>
        );
    }
}