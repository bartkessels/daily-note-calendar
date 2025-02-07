import {PostCreateStep, PreCreateStep} from 'src-old/domain/pipeline/pipeline';
import {FileAdapter} from 'src-old/domain/adapters/file.adapter';
import {Note} from 'src-old/domain/models/note';
import {NoteAdapter} from 'src-old/domain/adapters/note.adapter';

export class TitleVariableParserStep implements PostCreateStep<any>, PreCreateStep<any> {
    private readonly variableDeclarationRegex = /{{title}}/g;
    private activeNote: Note | null;

    constructor(
        private readonly fileAdapter: FileAdapter,
        private readonly noteAdapter: NoteAdapter
    ) {

    }

    public async executePreCreate(_: any): Promise<void> {
        this.activeNote = await this.noteAdapter.getActiveNote();
    }

    public async executePostCreate(filePath: string, _: any): Promise<void> {
        const content = await this.fileAdapter.readFileContents(filePath);
        const updatedContent = content.replace(this.variableDeclarationRegex, () => {
            return this.activeNote?.name ?? '';
        });

        await this.fileAdapter.writeFileContents(filePath, updatedContent);
    }
}