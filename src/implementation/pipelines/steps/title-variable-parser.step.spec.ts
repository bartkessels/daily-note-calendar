import {TitleVariableParserStep} from 'src/implementation/pipelines/steps/title-variable-parser.step';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {NoteAdapter} from 'src/domain/adapters/note.adapter';
import {Note} from 'src/domain/models/note';

describe('TitleVariableParserStep', () => {
    let fileAdapter: FileAdapter;
    let noteAdapter: NoteAdapter;
    let step: TitleVariableParserStep;
    let activeNote: Note;

    beforeEach(() => {
        fileAdapter = {
            doesFileExist: jest.fn(),
            createFileFromTemplate: jest.fn(),
            openFile: jest.fn(),
            readFileContents: jest.fn(),
            writeFileContents: jest.fn(),
            deleteFile: jest.fn()
        } as FileAdapter;
        noteAdapter = {
            getActiveNote: jest.fn()
        } as unknown as NoteAdapter;
        activeNote = {
            createdOn: new Date(),
            name: 'Active Note Title',
            path: 'active-note.md'
        };

        step = new TitleVariableParserStep(fileAdapter, noteAdapter);
    });

    it('should set active note in executePreCreate', async () => {
        (noteAdapter.getActiveNote as jest.Mock).mockResolvedValue(activeNote);

        await step.executePreCreate({});

        expect(noteAdapter.getActiveNote).toHaveBeenCalled();
        expect(step['activeNote']).toBe(activeNote);
    });

    it('should replace {{title}} with the active note title in executePostCreate', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'The title is {{title}}.';
        const expectedContent = 'The title is Active Note Title.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);
        step['activeNote'] = activeNote;

        await step.executePostCreate(filePath, {});

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, expectedContent);
    });

    it('should not modify the file if no {{title}} variables are present', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'No title variables here.';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);
        step['activeNote'] = activeNote;

        await step.executePostCreate(filePath, {});

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, fileContent);
    });

    it('should replace {{title}} with an empty string if active note is null', async () => {
        const filePath = 'test-file.md';
        const fileContent = 'The title is {{title}}.';
        const expectedContent = 'The title is .';

        (fileAdapter.readFileContents as jest.Mock).mockResolvedValue(fileContent);
        step['activeNote'] = null;

        await step.executePostCreate(filePath, {});

        expect(fileAdapter.readFileContents).toHaveBeenCalledWith(filePath);
        expect(fileAdapter.writeFileContents).toHaveBeenCalledWith(filePath, expectedContent);
    });
});