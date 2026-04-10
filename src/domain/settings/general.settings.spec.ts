import {DEFAULT_GENERAL_SETTINGS} from 'src/domain/settings/general.settings';
import {DayOfWeek, WeekNumberStandard} from 'src/domain/models/week';

describe('GeneralSettings', () => {
    describe('DEFAULT_GENERAL_SETTINGS', () => {
        it('should have displayNotesCreatedOnDate set to false', () => {
            expect(DEFAULT_GENERAL_SETTINGS.displayNotesCreatedOnDate).toBe(false);
        });

        it('should have displayNoteIndicator set to true', () => {
            expect(DEFAULT_GENERAL_SETTINGS.displayNoteIndicator).toBe(true);
        });

        it('should have displayCreatedNoteCountIndicator set to false', () => {
            expect(DEFAULT_GENERAL_SETTINGS.displayCreatedNoteCountIndicator).toBe(false);
        });

        it('should have useModifierKeyToCreateNote set to false', () => {
            expect(DEFAULT_GENERAL_SETTINGS.useModifierKeyToCreateNote).toBe(false);
        });

        it('should have firstDayOfWeek set to Monday', () => {
            expect(DEFAULT_GENERAL_SETTINGS.firstDayOfWeek).toBe(DayOfWeek.Monday);
        });

        it('should have weekNumberStandard set to ISO', () => {
            expect(DEFAULT_GENERAL_SETTINGS.weekNumberStandard).toBe(WeekNumberStandard.ISO);
        });
    });
});
