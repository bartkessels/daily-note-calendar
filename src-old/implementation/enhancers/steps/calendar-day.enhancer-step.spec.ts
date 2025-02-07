import { CalendarDayEnhancerStep } from 'src-old/implementation/enhancers/steps/calendar-day.enhancer-step';
import { SettingsRepository } from 'src-old/domain/repositories/settings.repository';
import { NameBuilder } from 'src-old/domain/builders/name.builder';
import { FileAdapter } from 'src-old/domain/adapters/file.adapter';
import { CalendarUiModel } from 'src-old/components/models/calendar.ui-model';
import { DailyNotesPeriodicNoteSettings } from 'src-old/domain/models/settings/daily-notes.periodic-note-settings';
import { Day, DayOfWeek } from 'src-old/domain/models/day';
import { WeekUiModel } from 'src-old/components/models/week.ui-model';
import { DayUiModel } from 'src-old/components/models/day.ui-model';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src-old/domain/models/settings/general.settings';

describe('CalendarDayEnhancerStep', () => {
    const generalSettingsRepository = {
        storeSettings: jest.fn(),
        getSettings: jest.fn()
    } as jest.Mocked<SettingsRepository<GeneralSettings>>;
    const settingsRepository = {
        storeSettings: jest.fn(),
        getSettings: jest.fn()
    } as jest.Mocked<SettingsRepository<DailyNotesPeriodicNoteSettings>>;
    const nameBuilder = {
        withPath: jest.fn().mockReturnThis(),
        withNameTemplate: jest.fn().mockReturnThis(),
        withValue: jest.fn().mockReturnThis(),
        build: jest.fn()
    } as jest.Mocked<NameBuilder<Day>>;
    const fileAdapter = {
        doesFileExist: jest.fn()
    } as unknown as jest.Mocked<FileAdapter>;
    let enhancerStep: CalendarDayEnhancerStep;

    beforeEach(() => {
        enhancerStep = new CalendarDayEnhancerStep(generalSettingsRepository, settingsRepository, nameBuilder, fileAdapter);
    });

    afterEach(() => {
        nameBuilder.build.mockReset();
        fileAdapter.doesFileExist.mockReset();
    });

    it('should return the calendar unchanged if currentMonth or weeks are not defined', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue(DEFAULT_GENERAL_SETTINGS);
        const calendar: CalendarUiModel = { currentMonth: undefined, startWeekOnMonday: true };

        const result = await enhancerStep.execute(calendar);

        expect(result).toBe(calendar);
    });

    it('should return the calendar unchanged if the setting to display a note indicator is disabled', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue({...DEFAULT_GENERAL_SETTINGS, displayNoteIndicator: false });

        const day: DayUiModel = {
            currentDay: { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' },
            isSelected: false,
            isToday: false,
            hasNote: false
        };
        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 2), weekNumber: '2', days: [] },
            days: [day],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] }, startWeekOnMonday: true };

        const result = await enhancerStep.execute(calendar);

        expect(result).toBe(calendar);
    });

    it('should enhance the days with note existence information', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue({...DEFAULT_GENERAL_SETTINGS, displayNoteIndicator: true });
        const settings: DailyNotesPeriodicNoteSettings = {
            folder: '/notes',
            nameTemplate: 'yyyy-MM-dd',
            templateFile: 'template.md'
        };
        settingsRepository.getSettings.mockResolvedValue(settings);

        const day: DayUiModel = {
            currentDay: { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' },
            isSelected: false,
            isToday: false,
            hasNote: false
        };
        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 2), weekNumber: '2', days: [] },
            days: [day],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] }, startWeekOnMonday: true };

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
        generalSettingsRepository.getSettings.mockResolvedValue(DEFAULT_GENERAL_SETTINGS);
        const settings: DailyNotesPeriodicNoteSettings = {
            folder: '/notes',
            nameTemplate: 'yyyy-MM-dd',
            templateFile: 'template.md'
        };
        settingsRepository.getSettings.mockResolvedValue(settings);

        const day: DayUiModel = {
            currentDay: undefined,
            isSelected: false,
            isToday: false,
            hasNote: false
        };
        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 2), weekNumber: '2', days: [] },
            days: [day],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] }, startWeekOnMonday: true };

        const result = await enhancerStep.execute(calendar);

        expect(result?.currentMonth?.weeks[0].days[0].hasNote).toBe(false);
        expect(nameBuilder.build).not.toHaveBeenCalled();
        expect(fileAdapter.doesFileExist).not.toHaveBeenCalled();
    });
});