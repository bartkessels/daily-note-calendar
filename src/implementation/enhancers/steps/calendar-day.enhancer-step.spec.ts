import {CalendarDayEnhancerStep} from 'src/implementation/enhancers/steps/calendar-day.enhancer-step';
import {SettingsRepository} from 'src/domain/repositories/settings.repository';
import {NameBuilder} from 'src/domain/builders/name.builder';
import {FileAdapter} from 'src/domain/adapters/file.adapter';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {DailyNotesPeriodicNoteSettings} from 'src/domain/models/settings/daily-notes.periodic-note-settings';
import {Day, DayOfWeek} from 'src/domain/models/day';
import {WeekUiModel} from 'src/components/models/week.ui-model';
import {DayUiModel} from 'src/components/models/day.ui-model';

describe('CalendarDayEnhancerStep', () => {
    let settingsRepository: jest.Mocked<SettingsRepository<DailyNotesPeriodicNoteSettings>>;
    let nameBuilder: jest.Mocked<NameBuilder<Day>>;
    let fileAdapter: jest.Mocked<FileAdapter>;
    let enhancerStep: CalendarDayEnhancerStep;

    beforeEach(() => {
        settingsRepository = {
            storeSettings: jest.fn(),
            getSettings: jest.fn()
        } as jest.Mocked<SettingsRepository<DailyNotesPeriodicNoteSettings>>;

        nameBuilder = {
            withPath: jest.fn().mockReturnThis(),
            withNameTemplate: jest.fn().mockReturnThis(),
            withValue: jest.fn().mockReturnThis(),
            build: jest.fn()
        } as jest.Mocked<NameBuilder<Day>>;

        fileAdapter = {
            doesFileExist: jest.fn()
        } as unknown as jest.Mocked<FileAdapter>;

        enhancerStep = new CalendarDayEnhancerStep(settingsRepository, nameBuilder, fileAdapter);
    });

    it('should return the calendar unchanged if currentMonth or weeks are not defined', async () => {
        const calendar: CalendarUiModel = { currentMonth: undefined };

        const result = await enhancerStep.execute(calendar);

        expect(result).toBe(calendar);
    });

    it('should enhance the days with note existence information', async () => {
        const settings: DailyNotesPeriodicNoteSettings = {
            folder: '/notes',
            nameTemplate: 'yyyy-MM-dd',
            templateFile: 'template.md'
        };
        settingsRepository.getSettings.mockResolvedValue(settings);

        const day: DayUiModel = { currentDay: { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' }, hasNote: false };
        const week: WeekUiModel = { days: [day] };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] } };

        nameBuilder.build.mockReturnValue('/notes/2023-10-02.md');
        fileAdapter.doesFileExist.mockResolvedValue(true);

        const result = await enhancerStep.execute(calendar);

        expect(result?.currentMonth?.weeks[0].days[0].hasNote).toBe(true);
        expect(nameBuilder.withPath).toHaveBeenCalledWith('/notes');
        expect(nameBuilder.withNameTemplate).toHaveBeenCalledWith('yyyy-MM-dd');
        expect(nameBuilder.withValue).toHaveBeenCalledWith(day.currentDay);
        expect(nameBuilder.build).toHaveBeenCalled();
        expect(fileAdapter.doesFileExist).toHaveBeenCalledWith('/notes/2023-10-02.md');
    });

    it('should handle days without currentDay gracefully', async () => {
        const settings: DailyNotesPeriodicNoteSettings = {
            folder: '/notes',
            nameTemplate: 'yyyy-MM-dd',
            templateFile: 'template.md'
        };
        settingsRepository.getSettings.mockResolvedValue(settings);

        const day: DayUiModel = { currentDay: undefined, hasNote: false };
        const week: WeekUiModel = { days: [day] };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] } };

        const result = await enhancerStep.execute(calendar);

        expect(result?.currentMonth?.weeks[0].days[0].hasNote).toBe(false);
        expect(nameBuilder.build).not.toHaveBeenCalled();
        expect(fileAdapter.doesFileExist).not.toHaveBeenCalled();
    });
});