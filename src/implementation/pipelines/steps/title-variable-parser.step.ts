import {VariableParserStep} from 'src/domain/pipeline/steps/variable-parser.step';
import {PreCreateStep} from 'src/domain/pipeline/pipeline';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {Note} from 'src/domain/models/note';
import {NoteAdapter} from 'src/domain/adapters/note.adapter';

export class TitleVariableParserStep implements VariableParserStep<any>, PreCreateStep<any> {
    private readonly variableDeclarationRegex = /{{title?}}/g;
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
        console.log(this.activeNote?.name);
        const content = await this.fileAdapter.readFileContents(filePath);
        const updatedContent = content.replace(this.variableDeclarationRegex, () => {
            console.log('ho');
            return this.activeNote?.name ?? '';
        });

        await this.fileAdapter.writeFileContents(filePath, updatedContent);
    }
}