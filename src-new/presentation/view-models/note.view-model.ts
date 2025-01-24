import {OpenManager} from 'src-new/business/contracts/open-manager';
import {Note} from 'src-new/domain/models/note.model';
import {DeleteManager} from 'src-new/business/contracts/delete-manager';

export interface NoteViewModel {
    open(note: Note): Promise<void>;

    delete(note: Note): Promise<void>;
}

export class DefaultNoteViewModel {
    constructor(
        private readonly openManager: OpenManager<Note>,
        private readonly deleteManager: DeleteManager<Note>
    ) {
    }

    public async open(note: Note): Promise<void> {
        await this.openManager.open(note);
    }

    public async delete(note: Note): Promise<void> {
        await this.deleteManager.delete(note);
    }
}