import {Note} from "src/domain/models/Note";

export interface NoteManager {


    getNotesCreatedOnDate(date: Date): Promise<Note[]>;
    tryOpenNote(note: Note): Promise<void>;
}