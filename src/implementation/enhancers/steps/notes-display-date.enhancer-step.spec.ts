import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import {NotesSettings} from 'src/domain/models/settings/notes.settings';
import {NotesDisplayDateEnhancerStep} from 'src/implementation/enhancers/steps/notes-display-date.enhancer-step';
import {DateParser} from 'src/domain/parsers/date.parser';
import {createNoteUiModel} from 'src/components/models/note.ui-model';
import {Note} from 'src/domain/models/note';
import 'src/extensions/extensions';

describe('CalendarWeekEnhancerStep', () => {
    const settingsRepository = {
        storeSettings: jest.fn(),
        getSettings: jest.fn()
    } as jest.Mocked<SettingsRepository<NotesSettings>>;
    const dateParser = {
        parse: jest.fn()
    } as jest.Mocked<DateParser>;
    let enhancerStep: NotesDisplayDateEnhancerStep;

    beforeEach(() => {
        enhancerStep = new NotesDisplayDateEnhancerStep(settingsRepository, dateParser);
    });

    it('should enhance the notes with the correct date setting', async () => {
        settingsRepository.getSettings.mockResolvedValue({
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