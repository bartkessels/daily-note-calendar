import {NoteManager} from "src/domain/managers/note.manager";
import {FileAdapter} from "src/domain/adapters/file.adapter";
import {Note} from "src/domain/models/Note";

export class AdapterNoteManager implements NoteManager {
    constructor(
        private readonly fileAdapter: FileAdapter
    ) {
    }

    public async getNotesCreatedOnDate(date: Date): Promise<Note[]> {
        return await this.fileAdapter.getNotesCreatedOnDate(date);
    }

    public async tryOpenNote(note: Note): Promise<void> {
        const doesNoteExist = await this.fileAdapter.doesFileExist(note.filePath);

        if (!doesNoteExist) {
            throw new Error(`Note '${note.name}' does not exist: ${note.filePath}.`);
        }

        return this.fileAdapter.openFile(note.filePath);
    }
}