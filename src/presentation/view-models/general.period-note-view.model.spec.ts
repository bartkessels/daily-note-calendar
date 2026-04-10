import {GeneralPeriodNoteViewModel} from './general.period-note-view.model';
import {PeriodService} from 'src/presentation/contracts/period-service';
import {MessageAdapter} from 'src/presentation/adapters/message.adapter';
import {mockDailyNoteSettings} from 'src/test-helpers/model.mocks';
import {ModifierKey} from 'src/domain/models/modifier-key';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {DEFAULT_PLUGIN_SETTINGS} from 'src/domain/settings/plugin.settings';

// Test-only concrete implementation
class TestPeriodNoteViewModel extends GeneralPeriodNoteViewModel {
    constructor(
        settings: any,
        periodService: PeriodService,
        messageAdapter: MessageAdapter,
    ) {
        super(settings, periodService, messageAdapter);
    }
}

describe('GeneralPeriodNoteViewModel', () => {
    let viewModel: TestPeriodNoteViewModel;
    let mockPeriodService: jest.Mocked<PeriodService>;
    let mockMessageAdapter: jest.Mocked<MessageAdapter>;
    let mockPeriod: Period;

    beforeEach(() => {
        mockPeriodService = {
            initialize: jest.fn(),
            hasPeriodicNote: jest.fn(),
            openNoteInCurrentTab: jest.fn(),
            openNoteInHorizontalSplitView: jest.fn(),
            openNoteInVerticalSplitView: jest.fn(),
            deleteNote: jest.fn(),
        } as any;

        mockMessageAdapter = {
            show: jest.fn(),
        } as any;

        mockPeriod = {
            name: '2026-04-08',
            formattedName: 'April 8, 2026',
            date: new Date(2024, 3, 8),
            type: PeriodType.Day,
        } as Period;

        viewModel = new TestPeriodNoteViewModel(
            mockDailyNoteSettings,
            mockPeriodService,
            mockMessageAdapter,
        );
    });

    describe('updateSettings', () => {
        it('calls periodService.initialize with new settings', () => {
            const newSettings = {...DEFAULT_PLUGIN_SETTINGS};

            viewModel.updateSettings(newSettings);

            expect(mockPeriodService.initialize).toHaveBeenCalledWith(newSettings);
        });
    });

    describe('hasPeriodicNote', () => {
        it('returns false when displayNoteIndicator is false', async () => {
            const settings = {
                ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: {
                    ...DEFAULT_PLUGIN_SETTINGS.generalSettings,
                    displayNoteIndicator: false,
                },
            };
            mockPeriodService.hasPeriodicNote.mockResolvedValue(true);
            viewModel.updateSettings(settings);

            const result = await viewModel.hasPeriodicNote(mockPeriod);

            expect(result).toBe(false);
        });

        it('returns false when displayNoteIndicator is true but note does not exist', async () => {
            const settings = {
                ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: {
                    ...DEFAULT_PLUGIN_SETTINGS.generalSettings,
                    displayNoteIndicator: true,
                },
            };
            mockPeriodService.hasPeriodicNote.mockResolvedValue(false);
            viewModel.updateSettings(settings);

            const result = await viewModel.hasPeriodicNote(mockPeriod);

            expect(result).toBe(false);
        });

        it('returns true when displayNoteIndicator is true and note exists', async () => {
            const settings = {
                ...DEFAULT_PLUGIN_SETTINGS,
                generalSettings: {
                    ...DEFAULT_PLUGIN_SETTINGS.generalSettings,
                    displayNoteIndicator: true,
                },
            };
            mockPeriodService.hasPeriodicNote.mockResolvedValue(true);
            viewModel.updateSettings(settings);

            const result = await viewModel.hasPeriodicNote(mockPeriod);

            expect(result).toBe(true);
        });
    });

    describe('openNote', () => {
        it('opens note in horizontal split when key is MetaAlt', async () => {
            await viewModel.openNote(ModifierKey.MetaAlt, mockPeriod);

            expect(mockPeriodService.openNoteInHorizontalSplitView).toHaveBeenCalledWith(
                ModifierKey.MetaAlt,
                mockPeriod,
                mockDailyNoteSettings,
            );
        });

        it('opens note in current tab for other modifier keys', async () => {
            await viewModel.openNote(ModifierKey.Meta, mockPeriod);

            expect(mockPeriodService.openNoteInCurrentTab).toHaveBeenCalledWith(
                ModifierKey.Meta,
                mockPeriod,
                mockDailyNoteSettings,
            );
        });

        it('shows error message when Error is thrown', async () => {
            const error = new Error('Test error');
            mockPeriodService.openNoteInCurrentTab.mockRejectedValue(error);

            await viewModel.openNote(ModifierKey.None, mockPeriod);

            expect(mockMessageAdapter.show).toHaveBeenCalledWith('Test error');
        });

        it('shows string message when non-Error is thrown', async () => {
            mockPeriodService.openNoteInCurrentTab.mockRejectedValue('String error');

            await viewModel.openNote(ModifierKey.None, mockPeriod);

            expect(mockMessageAdapter.show).toHaveBeenCalledWith('String error');
        });
    });

    describe('openNoteInHorizontalSplitView', () => {
        it('delegates to periodService.openNoteInHorizontalSplitView', async () => {
            await viewModel.openNoteInHorizontalSplitView(ModifierKey.Meta, mockPeriod);

            expect(mockPeriodService.openNoteInHorizontalSplitView).toHaveBeenCalledWith(
                ModifierKey.Meta,
                mockPeriod,
                mockDailyNoteSettings,
            );
        });

        it('shows error message when operation fails', async () => {
            const error = new Error('Split error');
            mockPeriodService.openNoteInHorizontalSplitView.mockRejectedValue(error);

            await viewModel.openNoteInHorizontalSplitView(ModifierKey.Meta, mockPeriod);

            expect(mockMessageAdapter.show).toHaveBeenCalledWith('Split error');
        });
    });

    describe('openNoteInVerticalSplitView', () => {
        it('delegates to periodService.openNoteInVerticalSplitView', async () => {
            await viewModel.openNoteInVerticalSplitView(ModifierKey.Meta, mockPeriod);

            expect(mockPeriodService.openNoteInVerticalSplitView).toHaveBeenCalledWith(
                ModifierKey.Meta,
                mockPeriod,
                mockDailyNoteSettings,
            );
        });

        it('shows error message when operation fails', async () => {
            const error = new Error('Vertical split error');
            mockPeriodService.openNoteInVerticalSplitView.mockRejectedValue(error);

            await viewModel.openNoteInVerticalSplitView(ModifierKey.Meta, mockPeriod);

            expect(mockMessageAdapter.show).toHaveBeenCalledWith('Vertical split error');
        });
    });

    describe('deleteNote', () => {
        it('delegates to periodService.deleteNote', async () => {
            await viewModel.deleteNote(mockPeriod);

            expect(mockPeriodService.deleteNote).toHaveBeenCalledWith(
                mockPeriod,
                mockDailyNoteSettings,
            );
        });
    });
});
