import {DefaultSettingsRepositoryFactory} from 'src/infrastructure/factories/default.settings-repository-factory';
import {mockSettingsAdapter} from 'src/test-helpers/adapter.mocks';
import {SettingsType} from 'src/infrastructure/contracts/settings-repository-factory';
import {PluginSettingsRepository} from 'src/infrastructure/repositories/plugin.settings-repository';
import {DisplayNotesSettingsRepository} from 'src/infrastructure/repositories/display-notes.settings-repository';
import {GeneralSettingsRepository} from 'src/infrastructure/repositories/general.settings-repository';
import {DailyNoteSettingsRepository} from 'src/infrastructure/repositories/daily-note.settings.repository';
import {WeeklyNoteSettingsRepository} from 'src/infrastructure/repositories/weekly-note.settings-repository';
import {MonthlyNoteSettingsRepository} from 'src/infrastructure/repositories/monthly-note.settings-repository';
import {QuarterlyNoteSettingsRepository} from 'src/infrastructure/repositories/quarterly-note.settings-repository';
import {YearlyNoteSettingsRepository} from 'src/infrastructure/repositories/yearly-note.settings-repository';

describe('DefaultSettingsRepositoryFactory', () => {
    let factory: DefaultSettingsRepositoryFactory;

    beforeEach(() => {
        factory = new DefaultSettingsRepositoryFactory(mockSettingsAdapter);
    });

    describe('getRepository', () => {
        it('should return the plugin settings repository', () => {
            // Arrange
            const type = SettingsType.Plugin;

            // Act
            const result = factory.getRepository(type);

            // Assert
            expect(result).toBeInstanceOf(PluginSettingsRepository);
        });

        it('should return the display note settings repository', () => {
            // Arrange
            const type = SettingsType.DisplayNotes;

            // Act
            const result = factory.getRepository(type);

            // Assert
            expect(result).toBeInstanceOf(DisplayNotesSettingsRepository);
        });

        it('should return the general settings repository', () => {
            // Arrange
            const type = SettingsType.General;

            // Act
            const result = factory.getRepository(type);

            // Assert
            expect(result).toBeInstanceOf(GeneralSettingsRepository);
        });

        it('should return the daily note settings repository', () => {
            // Arrange
            const type = SettingsType.DailyNote;

            // Act
            const result = factory.getRepository(type);

            // Assert
            expect(result).toBeInstanceOf(DailyNoteSettingsRepository);
        });

        it('should return the weekly note settings repository', () => {
            // Arrange
            const type = SettingsType.WeeklyNote;

            // Act
            const result = factory.getRepository(type);

            // Assert
            expect(result).toBeInstanceOf(WeeklyNoteSettingsRepository);
        });

        it('should return the monthly note settings repository', () => {
            // Arrange
            const type = SettingsType.MonthlyNote;

            // Act
            const result = factory.getRepository(type);

            // Assert
            expect(result).toBeInstanceOf(MonthlyNoteSettingsRepository);
        });

        it('should return the quarterly note settings repository', () => {
            // Arrange
            const type = SettingsType.QuarterlyNote;

            // Act
            const result = factory.getRepository(type);

            // Assert
            expect(result).toBeInstanceOf(QuarterlyNoteSettingsRepository);
        });

        it('should return the yearly note settings repository', () => {
            // Arrange
            const type = SettingsType.YearlyNote;

            // Act
            const result = factory.getRepository(type);

            // Assert
            expect(result).toBeInstanceOf(YearlyNoteSettingsRepository);
        });
    });
});