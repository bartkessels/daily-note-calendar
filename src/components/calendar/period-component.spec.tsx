import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PeriodComponent } from './period-component';
import { ModifierKey } from 'src/domain/models/modifier-key';

describe('PeriodComponent', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    it('renders the value', () => {
        render(<PeriodComponent value="17" onClick={mockOnClick} />);
        expect(screen.getByText('17')).toBeInTheDocument();
    });

    it('calls onClick with ModifierKey.None when clicked without modifier keys', () => {
        render(<PeriodComponent value="17" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('17'));
        expect(mockOnClick).toHaveBeenCalledWith(ModifierKey.None);
    });

    it('calls onClick with ModifierKey.Shift when clicked with shift key', () => {
        render(<PeriodComponent value="17" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('17'), { shiftKey: true });
        expect(mockOnClick).toHaveBeenCalledWith(ModifierKey.Shift);
    });

    it('calls onClick with ModifierKey.Meta when clicked with meta key', () => {
        render(<PeriodComponent value="17" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('17'), { metaKey: true });
        expect(mockOnClick).toHaveBeenCalledWith(ModifierKey.Meta);
    });

    it('calls onClick with ModifierKey.Alt when clicked with alt key', () => {
        render(<PeriodComponent value="17" onClick={mockOnClick} />);
        fireEvent.click(screen.getByText('17'), { altKey: true });
        expect(mockOnClick).toHaveBeenCalledWith(ModifierKey.Alt);
    });
});