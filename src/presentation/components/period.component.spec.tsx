import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {Period, PeriodType} from 'src/domain/models/period.model';

describe('PeriodComponent', () => {
    const periodUiModel = {
        period: {
            date: new Date(2023, 9, 2),
            name: '17',
            type: PeriodType.Day
        } as Period,
        hasPeriodNote: false,
        noNotes: 0
    } as PeriodUiModel;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add the selected day class when isSelected is true', () => {

    });

    it('should add the has-note class when model has a note', () => {

    });

    it('should set the today id when isToday is true', () => {

    });

    it('should call onClick with the correct modifier key when clicked', () => {

    });

    it('should display the number of notes for the period in the title', () => {
        // Arrange
    });
});

function renderPeriod(
    model: PeriodUiModel,
    onClick: (key: ModifierKey,model: PeriodUiModel) => void = (): void => {},
    isSelected: boolean = false,
    isToday: boolean = false
): void {

}