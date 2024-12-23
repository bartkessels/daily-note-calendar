import { CalendarWeekEnhancerStep } from 'src/implementation/enhancers/steps/calendar-week.enhancer-step';
import { SettingsRepository } from 'src/domain/repositories/settings.repository';
import { NameBuilder } from 'src/domain/builders/name.builder';
import { FileAdapter } from 'src/domain/adapters/file.adapter';
import { CalendarUiModel } from 'src/components/models/calendar.ui-model';
import {
    DEFAULT_WEEKLY_NOTES_PERIODIC_SETTINGS,
    WeeklyNotesPeriodicNoteSettings
} from 'src/domain/models/settings/weekly-notes.periodic-note-settings';
import { Week } from 'src/domain/models/week';
import { WeekUiModel } from 'src/components/models/week.ui-model';
import {DEFAULT_GENERAL_SETTINGS, GeneralSettings} from 'src/domain/models/settings/general.settings';
import { DayOfWeek } from 'src/domain/models/day';
import {EMPTY_DAY} from 'src/components/models/day.ui-model';

describe('CalendarWeekEnhancerStep', () => {
    const generalSettingsRepository = {
        storeSettings: jest.fn(),
        getSettings: jest.fn()
    } as jest.Mocked<SettingsRepository<GeneralSettings>>;
    const settingsRepository = {
        storeSettings: jest.fn(),
        getSettings: jest.fn()
    } as jest.Mocked<SettingsRepository<WeeklyNotesPeriodicNoteSettings>>;
    const nameBuilder = {
        withPath: jest.fn().mockReturnThis(),
        withNameTemplate: jest.fn().mockReturnThis(),
        withValue: jest.fn().mockReturnThis(),
        build: jest.fn()
    } as jest.Mocked<NameBuilder<Week>>;
    const fileAdapter = {
        doesFileExist: jest.fn()
    } as unknown as jest.Mocked<FileAdapter>;
    let enhancerStep: CalendarWeekEnhancerStep;

    beforeEach(() => {
        enhancerStep = new CalendarWeekEnhancerStep(generalSettingsRepository, settingsRepository, nameBuilder, fileAdapter);

        settingsRepository.getSettings.mockResolvedValue(DEFAULT_WEEKLY_NOTES_PERIODIC_SETTINGS);
    });

    it('should return the calendar unchanged if currentMonth or weeks are not defined', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue(DEFAULT_GENERAL_SETTINGS);
        const calendar: CalendarUiModel = { currentMonth: undefined, startWeekOnMonday: true };

        const result = await enhancerStep.execute(calendar);

        expect(result).toBe(calendar);
    });

    it('should return the calendar unchanged if the setting to display a note indicator is disabled', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue({...DEFAULT_GENERAL_SETTINGS, displayNoteIndicator: false });
        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 2), weekNumber: '40', days: [] },
            days: [],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] }, startWeekOnMonday: true };

        const result = await enhancerStep.execute(calendar);

        expect(result).toBe(calendar);
    });

    it('should enhance the weeks with note existence information', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue({ ...DEFAULT_GENERAL_SETTINGS, displayNoteIndicator: true });
        const settings: WeeklyNotesPeriodicNoteSettings = {
            folder: '/notes',
            nameTemplate: 'yyyy-ww',
            templateFile: 'template.md'
        };
        settingsRepository.getSettings.mockResolvedValue(settings);

        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 2), weekNumber: '40', days: [] },
            days: [],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] }, startWeekOnMonday: true };

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

    it('should order days of the week starting with Sunday', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue({...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Sunday });
        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 1), weekNumber: '40', days: [] },
            days: [
                { currentDay: { date: new Date(2023, 9, 1), dayOfWeek: DayOfWeek.Sunday, name: '1' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 3), dayOfWeek: DayOfWeek.Tuesday, name: '3' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 4), dayOfWeek: DayOfWeek.Wednesday, name: '4' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 5), dayOfWeek: DayOfWeek.Thursday, name: '5' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 6), dayOfWeek: DayOfWeek.Friday, name: '6' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 7), dayOfWeek: DayOfWeek.Saturday, name: '7' }, isSelected: false, hasNote: false, isToday: false },
            ],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] }, startWeekOnMonday: false };

        const result = await enhancerStep.execute(calendar);

        expect(result?.currentMonth?.weeks[0].days[0].currentDay?.dayOfWeek).toBe(DayOfWeek.Sunday);
    });

    it('should order days of the week starting with Monday', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue({...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Monday });
        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 2), weekNumber: '40', days: [] },
            days: [
                { currentDay: { date: new Date(2023, 9, 2), dayOfWeek: DayOfWeek.Monday, name: '2' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 3), dayOfWeek: DayOfWeek.Tuesday, name: '3' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 4), dayOfWeek: DayOfWeek.Wednesday, name: '4' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 5), dayOfWeek: DayOfWeek.Thursday, name: '5' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 6), dayOfWeek: DayOfWeek.Friday, name: '6' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 7), dayOfWeek: DayOfWeek.Saturday, name: '7' }, isSelected: false, hasNote: false, isToday: false },
                { currentDay: { date: new Date(2023, 9, 8), dayOfWeek: DayOfWeek.Sunday, name: '8' }, isSelected: false, hasNote: false, isToday: false },
            ],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] }, startWeekOnMonday: true };

        const result = await enhancerStep.execute(calendar);

        expect(result?.currentMonth?.weeks[0].days[0].currentDay?.dayOfWeek).toBe(DayOfWeek.Monday);
    });

    it('should map days that arent from the current month EMPTY_DAY', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue({...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Monday });
        const weekWithMissingDays: WeekUiModel = {
            week: {
                date: new Date(2024, 11, 1),
                weekNumber: '48',
                days: [
                    {dayOfWeek: DayOfWeek.Sunday, date: new Date(2024, 11, 1), name: '1'},
                ]
            },
            days: [
                { currentDay: { date: new Date(2024, 11, 1), dayOfWeek: DayOfWeek.Sunday, name: '1' }, isSelected: false, hasNote: false, isToday: false },
            ],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [weekWithMissingDays] }, startWeekOnMonday: true };

        const result = await enhancerStep.execute(calendar);

        expect(result?.currentMonth?.weeks[0]?.days[0]).toBe(EMPTY_DAY);
        expect(result?.currentMonth?.weeks[0]?.days[1]).toBe(EMPTY_DAY);
        expect(result?.currentMonth?.weeks[0]?.days[2]).toBe(EMPTY_DAY);
        expect(result?.currentMonth?.weeks[0]?.days[3]).toBe(EMPTY_DAY);
        expect(result?.currentMonth?.weeks[0]?.days[4]).toBe(EMPTY_DAY);
        expect(result?.currentMonth?.weeks[0]?.days[5]).toBe(EMPTY_DAY);
        expect(result?.currentMonth?.weeks[0]?.days[6].currentDay?.dayOfWeek).toBe(DayOfWeek.Sunday);
    });

    it('should set startWeekOnMonday property on CalendarUiModel', async () => {
        generalSettingsRepository.getSettings.mockResolvedValue({...DEFAULT_GENERAL_SETTINGS, firstDayOfWeek: DayOfWeek.Monday });
        const week: WeekUiModel = {
            week: { date: new Date(2023, 9, 2), weekNumber: '40', days: [] },
            days: [],
            hasNote: false
        };
        const calendar: CalendarUiModel = { currentMonth: { weeks: [week] }, startWeekOnMonday: false };

        const result = await enhancerStep.execute(calendar);

        expect(result?.startWeekOnMonday).toBe(true);
    });
});