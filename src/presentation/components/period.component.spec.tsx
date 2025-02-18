import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {ModifierKey} from 'src/presentation/models/modifier-key';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {fireEvent, render, screen} from '@testing-library/react';
import {PeriodComponent} from 'src/presentation/components/period.component';
import React, { ReactElement } from 'react';
import '@testing-library/jest-dom';

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

    describe('No uiModel provided', () => {
        it('should return an empty element', () => {
            // Act
            render(
                <PeriodComponent
                    onClick={() => {}} />
            );

            // Assert
            expect(screen.queryByText(periodUiModel.period.name)).toBeNull();
        });
    });

    describe('period is selected', () => {
        it('should add the selected day class when isSelected is true', () => {
            // Act
            render(setupContent(periodUiModel, () => {}, true));

            // Assert
            expect(screen.getByText(periodUiModel.period.name)).toHaveClass('selected-day');
        });

        it('should not add the selected day class when isSelected is false', () => {
            // Act
            render(setupContent(periodUiModel, () => {}, false));

            // Assert
            expect(screen.getByText(periodUiModel.period.name)).not.toHaveClass('selected-day');
        });
    });

    describe('period has note', () => {
        it('should add the has-note class when model has a note', () => {
            // Arrange
            const periodUiModelWithNote = {...periodUiModel, hasPeriodNote: true } as PeriodUiModel;

            // Act
            render(setupContent(periodUiModelWithNote, () => {}, true));

            // Assert
            expect(screen.getByText(periodUiModelWithNote.period.name)).toHaveClass('has-note');
        });

        it('should not add the has-note class when model has no note', () => {
            // Act
            render(setupContent(periodUiModel, () => {}, false));

            // Assert
            expect(screen.getByText(periodUiModel.period.name)).not.toHaveClass('has-note');
        });
    });

    describe('Period is today', () => {
        it('should set the today id when isToday is true', () => {
            // Act
            render(setupContent(periodUiModel, () => {}, false, true));

            // Assert
            expect(screen.getByText(periodUiModel.period.name)).toHaveAttribute('id', 'today');
        });

        it('should not set the today id when isToday is false', () => {
            // Act
            render(setupContent(periodUiModel, () => {}, false, false));

            // Assert
            expect(screen.getByText(periodUiModel.period.name)).not.toHaveAttribute('id', 'today');
        });
    });

    describe('Period has notes', () => {
        it('should display the number of notes for the period in the title if it has more than 0 notes', () => {
            // Arrange
            const periodUiModelWithNotes = {...periodUiModel, noNotes: 5 } as PeriodUiModel;

            // Act
            render(setupContent(periodUiModelWithNotes, () => {}, true));

            // Assert
            expect(screen.getByText(periodUiModelWithNotes.period.name)).toHaveAttribute('title', 'Number of notes: 5');
        });

        it('should not display the number of notes for the period in the title if it has 0 notes', () => {
            // Arrange
            const periodUiModelWithNotes = {...periodUiModel, noNotes: 0 } as PeriodUiModel;

            // Act
            render(setupContent(periodUiModelWithNotes, () => {}, true));

            // Assert
            expect(screen.getByText(periodUiModelWithNotes.period.name)).not.toHaveAttribute('title');
        });
    });

    describe('Click on the period', () => {
        it('should call the onClick with the meta modifier key if the meta key is pressed', () => {
            // Arrange
            const onClick = jest.fn();
            render(setupContent(periodUiModel, onClick));

            // Act
            fireEvent.click(screen.getByText(periodUiModel.period.name), { metaKey: true });

            // Assert
            expect(onClick).toHaveBeenCalledWith(ModifierKey.Meta, periodUiModel);
        });

        it('should call the onClick with the alt modifier key if the alt key is pressed', () => {
            // Arrange
            const onClick = jest.fn();
            render(setupContent(periodUiModel, onClick));

            // Act
            fireEvent.click(screen.getByText(periodUiModel.period.name), { altKey: true });

            // Assert
            expect(onClick).toHaveBeenCalledWith(ModifierKey.Alt, periodUiModel);
        });

        it('should call the onClick with the shift modifier key if the shift key is pressed', () => {
            // Arrange
            const onClick = jest.fn();
            render(setupContent(periodUiModel, onClick));

            // Act
            fireEvent.click(screen.getByText(periodUiModel.period.name), { shiftKey: true });

            // Assert
            expect(onClick).toHaveBeenCalledWith(ModifierKey.Shift, periodUiModel);
        });

        it('should call the onClick with the none modifier key if no modifier key is pressed', () => {
            // Arrange
            const onClick = jest.fn();
            render(setupContent(periodUiModel, onClick));

            // Act
            fireEvent.click(screen.getByText(periodUiModel.period.name));

            // Assert
            expect(onClick).toHaveBeenCalledWith(ModifierKey.None, periodUiModel);
        });
    });
});

function setupContent(
    model: PeriodUiModel,
    onClick: (key: ModifierKey, model: PeriodUiModel) => void = (): void => { },
    isSelected: boolean = false,
    isToday: boolean = false
): ReactElement {
    return (
        <PeriodComponent
            model={model}
            onClick={onClick}
            isSelected={isSelected}
            isToday={isToday}/>
    );
}