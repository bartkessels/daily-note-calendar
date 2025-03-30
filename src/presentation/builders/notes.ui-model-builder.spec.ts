import {mockDateParser} from 'src/test-helpers/parser.mocks';
import {NotesUiModelBuilder} from 'src/presentation/builders/notes.ui-model-builder';
import {mockDateParserFactory} from 'src/test-helpers/factory.mocks';
import {when} from 'jest-when';
import {DEFAULT_PLUGIN_SETTINGS, PluginSettings} from 'src/domain/settings/plugin.settings';
import {Note} from 'src/domain/models/note.model';
import {DEFAULT_DISPLAY_NOTES_SETTINGS} from 'src/domain/settings/display-notes.settings';

describe('NotesUiModelBuilder', () => {
    const dateParser = mockDateParser;

    let builder: NotesUiModelBuilder;

    beforeEach(() => {
        const dateParserFactory = mockDateParserFactory(dateParser);

        builder = new NotesUiModelBuilder(dateParserFactory);

        when(dateParserFactory.getParser).mockReturnValue(dateParser);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('withSettings', () => {
        it('should throw an exception when the settings have not been set', async () => {
            // Act
            const act = async () => await builder.build();

            // Assert
            await expect(act).rejects.toThrow('Settings must be provided before building the UI model');
        });

        it('should only build the uiModel when the settings have been set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            builder.withSettings(settings);
            const result = await builder.build();

            // Assert
            expect(result).not.toBeNull();
        });
    });

    describe('withValue', () => {
        const notes = [
            <Note>{
                createdOn: {date: new Date(2023, 9, 2)},
                createdOnProperty: {date: new Date(2023, 9, 3)},
                name: 'note',
                path: 'path/to/note.md',
                properties: new Map()
            }
        ];

        it('should return empty notes if no value is set', async () => {
            // Arrange
            const settings = DEFAULT_PLUGIN_SETTINGS;

            // Act
            builder.withSettings(settings);
            const result = await builder.build();

            // Assert
            expect(result.notes).toHaveLength(0);
        });

        it('should build the note ui model based on the note', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS, notesSettings: {
                    ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                    displayDateTemplate: 'dd-MM-yyyy'
                }
            };
            when(dateParser.fromDate)
                .calledWith(notes[0].createdOn.date, settings.notesSettings.displayDateTemplate)
                .mockReturnValue('02-10-2023');

            // Act
            builder.withSettings(settings);
            const result = await builder.withValue(notes).build();

            // Assert
            expect(result.notes).toHaveLength(1);
            expect(result.notes[0].note).toBe(notes[0]);
            expect(result.notes[0].date).toBe('02-10-2023');
            expect(result.notes[0].name).toBe('note');
            expect(result.notes[0].filePath).toBe('path/to/note');
        });

        it('should display the createdOn date based on the property if the settings have the useCreatedOnDateFromProperties flag set', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS, notesSettings: {
                    ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                    useCreatedOnDateFromProperties: true
                }
            };

            // Act
            builder.withSettings(settings);
            await builder.withValue(notes).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(notes[0].createdOnProperty?.date, settings.notesSettings.displayDateTemplate);
        });

        it('should display the createdOn date based on the created value if the settings have the useCreatedOnDateFromProperties flag set but the createdOnProperty is null', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS, notesSettings: {
                    ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                    useCreatedOnDateFromProperties: true
                }
            };
            const notes = [
                <Note>{
                    createdOn: {date: new Date(2023, 9, 2)},
                    createdOnProperty: null,
                    name: 'note',
                    path: 'path/to/note.md',
                    properties: new Map()
                }
            ]

            // Act
            builder.withSettings(settings);
            await builder.withValue(notes).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(notes[0].createdOn.date, settings.notesSettings.displayDateTemplate);
        });

        it('should display the createdOn date based on the created value if the settings have the useCreatedOnDateFromProperties flag is not set', async () => {
            // Arrange
            const settings = <PluginSettings>{
                ...DEFAULT_PLUGIN_SETTINGS, notesSettings: {
                    ...DEFAULT_DISPLAY_NOTES_SETTINGS,
                    useCreatedOnDateFromProperties: false
                }
            };

            // Act
            builder.withSettings(settings);
            await builder.withValue(notes).build();

            // Assert
            expect(dateParser.fromDate).toHaveBeenCalledWith(notes[0].createdOn.date, settings.notesSettings.displayDateTemplate);
        });
    });
});