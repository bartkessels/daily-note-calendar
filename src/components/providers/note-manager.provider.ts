import {createContext, useContext} from "react";
import {NoteManager} from "src/domain/managers/note.manager";

export const NoteManagerContext = createContext<NoteManager | null>(null);
export const useNoteManager = (): NoteManager | null => {
    return useContext(NoteManagerContext);
}