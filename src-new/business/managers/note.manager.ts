import {OpenManager} from 'src-new/business/contracts/open-manager';
import {Note} from 'src-new/domain/models/note.model';
import {DeleteManager} from 'src-new/business/contracts/delete-manager';
import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';

export class NoteManager implements OpenManager<Note>, DeleteManager<Note> {
    constructor(
        private readonly fileAdapter: FileAdapter
    ) {

    }

    public async open(value: Note): Promise<void> {
        await this.fileAdapter.open(value.path);
    }

    public async delete(value: Note): Promise<void> {
        await this.fileAdapter.delete(value.path);
    }
}