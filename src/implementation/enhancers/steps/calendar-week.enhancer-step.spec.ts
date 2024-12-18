import { CalendarWeekEnhancerStep } from 'src/implementation/enhancers/steps/calendar-week.enhancer-step';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import { NameBuilder } from 'src/domain/builders/name.builder';
import { FileAdapter } from 'src/domain/adapters/file.adapter';
import { CalendarUiModel } from 'src/components/models/calendar.ui-model';
import { WeeklyNotesPeriodicNoteSettings } from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import { Week } from 'src/domain/models/week';
import { WeekUiModel } from 'src/components/models/week.ui-model';

describe('CalendarWeekEnhancerStep', () => {
    let settingsRepository: jest.Mocked<SettingsRepository<WeeklyNotesPeriodicNoteSettings>>;
    let nameBuilder: jest.Mocked<NameBuilder<Week>>;
    let fileAdapter: jest.Mocked<FileAdapter>;
    let enhancerStep: CalendarWeekEnhancerStep;

    beforeEach(() => {
        settingsRepository = {
            storeSettings: jest.fn(),
            getSettings: jest.fn()
        } as jest.Mocked<SettingsRepository<WeeklyNotesPeriodicNoteSettings>>;

        nameBuilder = {
            withPath: jest.fn().mockReturnThis(),
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            build: jest.fn()
        } as jest.Mocked<NameBuilder<Week>>;

        fileAdapter = {
            doesFileExist: jest.fn()
        } as unknown as jest.Mocked<FileAdapter>;

        enhancerStep = new CalendarWeekEnhancerStep(settingsRepository, nameBuilder, fileAdapter);
    });

    it('should return the calendar unchanged if currentMonth or weeks are not defined', async () => {
        const calendar: CalendarUiModel = { currentMonth: undefined };

        const result = await enhancerStep.execute(calendar);

        expect(result).toBe(calendar);
    });

    it('should enhance the weeks with note existence information', async () => {
        const settings: WeeklyNotesPeriodicNoteSettings = {
            folder: '/notes',
            nameTemplate: 'yyyy-ww',
            templateFile: 'template.md'
        };
        settingsRepository.getSettings.mockResolvedValue(settings);

        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 2), weekNumber: 40, days: [] },
            days: [],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] } };

        nameBuilder.build.mockReturnValue('/notes/2023-40.md');
        fileAdapter.doesFileExist.mockResolvedValue(true);

        const result = await enhancerStep.execute(calendar);

        expect(result?.currentMonth?.weeks[0].hasNote).toBe(true);
        expect(nameBuilder.withPath).toHaveBeenCalledWith('/notes');
        expect(nameBuilder.withNameTemplate).toHaveBeenCalledWith('yyyy-ww');
        expect(nameBuilder.withValue).toHaveBeenCalledWith(week.week);
        expect(nameBuilder.build).toHaveBeenCalled();
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('/notes/2023-40.md');
    });
});