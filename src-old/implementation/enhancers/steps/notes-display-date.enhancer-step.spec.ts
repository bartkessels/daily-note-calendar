import { SettingsRepository } from 'src-old/domain/repositories/settings.repository';
import {DEFAULT_NOTES_SETTINGS, NotesSettings} from 'src-old/domain/models/settings/notes.settings';
import {NotesDisplayDateEnhancerStep} from 'src-old/implementation/enhancers/steps/notes-display-date.enhancer-step';
import {DateParser} from 'src-old/domain/parsers/date.parser';
import {createNoteUiModel} from 'src-old/components/models/note.ui-model';
import {Note} from 'src-old/domain/models/note';
import 'src-old/extensions/extensions';

describe('CalendarWeekEnhancerStep', () => {
    const settingsRepository = {
        storeSettings: jest.fn(),
        getSettings: jest.fn()
    } as jest.Mocked<SettingsRepository<NotesSettings>>;
    const dateParser = {
        parse: jest.fn(),
        parseString: jest.fn()
    } as jest.Mocked<DateParser>;
    let enhancerStep: NotesDisplayDateEnhancerStep;

    beforeEach(() => {
        enhancerStep = new NotesDisplayDateEnhancerStep(settingsRepository, dateParser);
    });

    it('should enhance the notes with the correct date setting', async () => {
        settingsRepository.getSettings.mockResolvedValue({
            ...DEFAULT_NOTES_SETTINGS,
            displayDateTemplate: 'HH:mm',
            useCreatedOnDateFromProperties: false,
            createdOnDatePropertyName: ''
        });
        dateParser.parse.mockReturnValue('23:59');

        const note = <Note>{
            createdOn: new Date(2023, 9, 2, 23, 59),
            name: 'Daily note',
            path: 'templates/Daily Note'
        };
        const uiModel = createNoteUiModel(note);

        const result = await enhancerStep.execute([uiModel]);

        expect(result?.[0].displayDate).toBe('23:59');
    });
});