import React from "react";
import { NoteComponent } from "src/presentation/components/note.component";
import { Period } from "src/domain/models/period.model";
import { Note } from "src/domain/models/note.model";
import { useNotesViewModel } from "src/presentation/context/view-model.context";

export interface NotesComponentProperties {
  period: Period | null;
}

export const NotesComponent = (props: NotesComponentProperties) => {
  const viewModel = useNotesViewModel();
  const [notes, setNotes] = React.useState<Note[]>([]);

  const loadNotes = () => {
    if (props.period) {
      viewModel?.loadNotes(props.period).then(setNotes);
    }
  };

  React.useEffect(() => {
    if (props.period) {
      viewModel?.loadNotes(props.period).then(setNotes);
    }
  }, [viewModel, props.period]);

  viewModel?.initializeCallbacks(loadNotes);

  if (notes.length > 0) {
    return (
      <div className="dnc">
        <ul>
          {notes.map((note: Note) => (
            <NoteComponent
              key={note.path}
              note={note}
              onOpenInHorizontalSplitView={(note) =>
                viewModel?.openNoteInHorizontalSplitView(note)
              }
              onOpenInVerticalSplitView={(note) =>
                viewModel?.openNoteInVerticalSplitView(note)
              }
              onClick={(note) => viewModel?.openNote(note)}
              onDelete={(note) => viewModel?.deleteNote(note)}
            />
          ))}
        </ul>
      </div>
    );
  } else {
    return <></>;
  }
};
