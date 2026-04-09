import {
    DEFAULT_DAILY_NOTE_SETTINGS,
    DEFAULT_WEEKLY_NOTE_SETTINGS,
    DEFAULT_MONTHLY_NOTE_SETTINGS,
    DEFAULT_QUARTERLY_NOTE_SETTINGS,
    DEFAULT_YEARLY_NOTE_SETTINGS,
} from 'src/domain/settings/period-note.settings';

describe('PeriodNoteSettings', () => {
    describe('DEFAULT_DAILY_NOTE_SETTINGS', () => {
        it('should have correct nameTemplate', () => {
            expect(DEFAULT_DAILY_NOTE_SETTINGS.nameTemplate).toBe('yyyy-MM-dd');
        });

        it('should have correct folder', () => {
            expect(DEFAULT_DAILY_NOTE_SETTINGS.folder).toBe('Daily notes');
        });

        it('should have correct templateFile', () => {
            expect(DEFAULT_DAILY_NOTE_SETTINGS.templateFile).toBe('Templates/Daily note');
        });

        it('should not be an empty object', () => {
            expect(Object.keys(DEFAULT_DAILY_NOTE_SETTINGS).length).toBeGreaterThan(0);
        });
    });

    describe('DEFAULT_WEEKLY_NOTE_SETTINGS', () => {
        it('should have correct nameTemplate', () => {
            expect(DEFAULT_WEEKLY_NOTE_SETTINGS.nameTemplate).toBe('yyyy-ww');
        });

        it('should have correct folder', () => {
            expect(DEFAULT_WEEKLY_NOTE_SETTINGS.folder).toBe('Weekly notes');
        });

        it('should have correct templateFile', () => {
            expect(DEFAULT_WEEKLY_NOTE_SETTINGS.templateFile).toBe('Templates/Weekly note');
        });

        it('should not be an empty object', () => {
            expect(Object.keys(DEFAULT_WEEKLY_NOTE_SETTINGS).length).toBeGreaterThan(0);
        });
    });

    describe('DEFAULT_MONTHLY_NOTE_SETTINGS', () => {
        it('should have correct nameTemplate', () => {
            expect(DEFAULT_MONTHLY_NOTE_SETTINGS.nameTemplate).toBe('yyyy-MM');
        });

        it('should have correct folder', () => {
            expect(DEFAULT_MONTHLY_NOTE_SETTINGS.folder).toBe('Monthly notes');
        });

        it('should have correct templateFile', () => {
            expect(DEFAULT_MONTHLY_NOTE_SETTINGS.templateFile).toBe('Templates/Monthly note');
        });

        it('should not be an empty object', () => {
            expect(Object.keys(DEFAULT_MONTHLY_NOTE_SETTINGS).length).toBeGreaterThan(0);
        });
    });

    describe('DEFAULT_QUARTERLY_NOTE_SETTINGS', () => {
        it('should have correct nameTemplate', () => {
            expect(DEFAULT_QUARTERLY_NOTE_SETTINGS.nameTemplate).toBe('yyyy-qqq');
        });

        it('should have correct folder', () => {
            expect(DEFAULT_QUARTERLY_NOTE_SETTINGS.folder).toBe('Quarterly notes');
        });

        it('should have correct templateFile', () => {
            expect(DEFAULT_QUARTERLY_NOTE_SETTINGS.templateFile).toBe('Templates/Quarterly note');
        });

        it('should not be an empty object', () => {
            expect(Object.keys(DEFAULT_QUARTERLY_NOTE_SETTINGS).length).toBeGreaterThan(0);
        });
    });

    describe('DEFAULT_YEARLY_NOTE_SETTINGS', () => {
        it('should have correct nameTemplate', () => {
            expect(DEFAULT_YEARLY_NOTE_SETTINGS.nameTemplate).toBe('yyyy');
        });

        it('should have correct folder', () => {
            expect(DEFAULT_YEARLY_NOTE_SETTINGS.folder).toBe('Yearly notes');
        });

        it('should have correct templateFile', () => {
            expect(DEFAULT_YEARLY_NOTE_SETTINGS.templateFile).toBe('Templates/Yearly note');
        });

        it('should not be an empty object', () => {
            expect(Object.keys(DEFAULT_YEARLY_NOTE_SETTINGS).length).toBeGreaterThan(0);
        });
    });
});
