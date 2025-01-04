import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {PeriodComponent} from './period-component';
import {ModifierKey} from 'src/domain/models/modifier-key';
import {ManageAction, ManageEvent} from 'src/domain/events/manage.event';
import {Day} from 'src/domain/models/day';
import {ContextMenuAdapter} from 'src/domain/adapters/context-menu.adapter';
import {NoteContextMenuContext} from 'src/components/context/note-context-menu.context';

describe('PeriodComponent', () => {
    const mockOnClick = jest.fn();
    const contextMenuAdapter = {
        show: jest.fn()
    } as unknown as ContextMenuAdapter;
    let manageDayEventMock: jest.Mocked<ManageEvent<Day>>;
    let day: Day;

    beforeEach(() => {
        mockOnClick.mockClear();
        manageDayEventMock = {
            emitEvent: jest.fn()
        } as unknown as jest.Mocked<ManageEvent<Day>>;
        day = {
            date: new Date(2024, 11, 17),
            dayOfWeek: 2,
            name: '17'
        };
    });

    it('renders the value', () => {
        render(<PeriodComponent value={day} displayValue="17" onClick={mockOnClick} />);
        expect(screen.getByText('17')).toBeInTheDocument();
    });

    it('renders nothing when the value is undefined', () => {
        const { container } = render(<PeriodComponent onClick={mockOnClick} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('Calls the manageNoteEvent with ModifierKey.None when clicked without modifier keys when onClick is not provided', () => {
        render(<PeriodComponent value={day} displayValue={day.name} manageEvent={manageDayEventMock} />);
        fireEvent.click(screen.getByText('17'));
        expect(manageDayEventMock.emitEvent).toHaveBeenCalledWith(ManageAction.Open, day, ModifierKey.None);
    });

    it('Calls the manageNoteEvent with ModifierKey.Shift when clicked with the shift modifier key when onClick is not provided', () => {
        render(<PeriodComponent value={day} displayValue={day.name} manageEvent={manageDayEventMock} />);
        fireEvent.click(screen.getByText('17'), { shiftKey: true });
        expect(manageDayEventMock.emitEvent).toHaveBeenCalledWith(ManageAction.Open, day, ModifierKey.Shift);
    });

    it('Calls the manageNoteEvent with ModifierKey.Meta when clicked with the shift modifier key when onClick is not provided', () => {
        render(<PeriodComponent value={day} displayValue={day.name} manageEvent={manageDayEventMock} />);
        fireEvent.click(screen.getByText('17'), { metaKey: true });
        expect(manageDayEventMock.emitEvent).toHaveBeenCalledWith(ManageAction.Open, day, ModifierKey.Meta);
    });

    it('Calls the manageNoteEvent with ModifierKey.Alt when clicked with the shift modifier key when onClick is not provided', () => {
        render(<PeriodComponent value={day} displayValue={day.name} manageEvent={manageDayEventMock} />);
        fireEvent.click(screen.getByText('17'), { altKey: true });
        expect(manageDayEventMock.emitEvent).toHaveBeenCalledWith(ManageAction.Open, day, ModifierKey.Alt);
    });

    it('calls onClick with ModifierKey.None when clicked without modifier keys', () => {
        render(<PeriodComponent value={day} displayValue="17" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('17'));
        expect(mockOnClick).toHaveBeenCalledWith(ModifierKey.None);
    });

    it('calls onClick with ModifierKey.Shift when clicked with shift key', () => {
        render(<PeriodComponent value={day} displayValue="17" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('17'), { shiftKey: true });
        expect(mockOnClick).toHaveBeenCalledWith(ModifierKey.Shift);
    });

    it('calls onClick with ModifierKey.Meta when clicked with meta key', () => {
        render(<PeriodComponent value={day} displayValue="17" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('17'), { metaKey: true });
        expect(mockOnClick).toHaveBeenCalledWith(ModifierKey.Meta);
    });

    it('calls onClick with ModifierKey.Alt when clicked with alt key', () => {
        render(<PeriodComponent value={day} displayValue="17" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('17'), { altKey: true });
        expect(mockOnClick).toHaveBeenCalledWith(ModifierKey.Alt);
    });

    it('calls the context menu with the correct values when right clicked', () => {
        render(
            <NoteContextMenuContext value={contextMenuAdapter}>
                <PeriodComponent value={day} displayValue="17" manageEvent={manageDayEventMock} />
            </NoteContextMenuContext>
        );
        fireEvent.contextMenu(screen.getByText('17'));

        expect(contextMenuAdapter.show).toHaveBeenCalledWith(
            expect.any(Number),
            expect.any(Number),
            {
                onDelete: expect.any(Function) //() => manageDayEventMock.emitEvent(ManageAction.Delete, day)
            }
        );
    });
});