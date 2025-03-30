import {UiModelBuilder} from 'src/presentation/contracts/ui-model-builder';
import {WeekModel} from 'src/domain/models/week.model';
import {CalendarUiModel} from 'src/presentation/models/calendar.ui-model';
import {Note} from 'src/domain/models/note.model';
import {NotesUiModel} from 'src/presentation/models/notes.ui-model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {Period} from 'src/domain/models/period.model';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';

export const mockCalendarUiModelBuilder = {
    withSettings: jest.fn(),
    withValue: jest.fn(),
    build: jest.fn()
} as jest.Mocked<UiModelBuilder<WeekModel[], CalendarUiModel>>;

export const mockNotesUiModelBuilder = {
    withSettings: jest.fn(),
    withValue: jest.fn(),
    build: jest.fn()
} as jest.Mocked<UiModelBuilder<Note[], NotesUiModel>>;

export const mockPeriodUiModelBuilder = {
    withSettings: jest.fn(),
    withValue: jest.fn(),
    build: jest.fn()
} as jest.Mocked<UiModelBuilder<Period, PeriodUiModel>>;

export const mockWeekUiModelBuilder = {
    withSettings: jest.fn(),
    withValue: jest.fn(),
    build: jest.fn()
} as jest.Mocked<UiModelBuilder<WeekModel[], WeekUiModel[]>>;