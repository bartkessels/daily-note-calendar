import {DEFAULT_DISPLAY_NOTES_SETTINGS} from 'src/domain/settings/display-notes.settings';
import {SortNotes} from 'src/domain/models/note.model';

describe('DisplayNotesSettings', () => {
    describe('DEFAULT_DISPLAY_NOTES_SETTINGS', () => {
        it('should have correct displayDateTemplate', () => {
            expect(DEFAULT_DISPLAY_NOTES_SETTINGS.displayDateTemplate).toBe('HH:mm');
        });

        it('should have correct createdOnDatePropertyName', () => {
            expect(DEFAULT_DISPLAY_NOTES_SETTINGS.createdOnDatePropertyName).toBe('created_on');
        });

        it('should have correct createdOnPropertyFormat', () => {
            expect(DEFAULT_DISPLAY_NOTES_SETTINGS.createdOnPropertyFormat).toBe('yyyy/MM/dd HH:mm');
        });

        it('should have useCreatedOnDateFromProperties set to false', () => {
            expect(DEFAULT_DISPLAY_NOTES_SETTINGS.useCreatedOnDateFromProperties).toBe(false);
        });

        it('should have sortNotes set to Ascending', () => {
            expect(DEFAULT_DISPLAY_NOTES_SETTINGS.sortNotes).toBe(SortNotes.Ascending);
        });
    });
});
