import React from 'react';
import {render, screen} from '@testing-library/react';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {ContextMenuAdapterContext} from 'src/presentation/context/context-menu-adapter.context';
import {mockContextMenuAdapter} from 'src/test-helpers/context-menu.mocks';

describe('PeriodComponent', () => {
    const defaultProps = {
        name: '7',
        isSelected: false,
        isToday: false,
        hasPeriodNote: false,
        onClick: jest.fn(),
        onOpenInHorizontalSplitViewClick: jest.fn(),
        onOpenInVerticalSplitViewClick: jest.fn(),
        onDelete: jest.fn()
    };

    const wrapper = ({children}: {children: React.ReactNode}) => (
        <ContextMenuAdapterContext.Provider value={mockContextMenuAdapter}>
            {children}
        </ContextMenuAdapterContext.Provider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the period name', () => {
        render(<PeriodComponent {...defaultProps} />, {wrapper});
        expect(screen.getByText('7')).toBeDefined();
    });

    it('does not render a note-count badge when noteCount is 0', () => {
        const {container} = render(
            <PeriodComponent {...defaultProps} noteCount={0} />,
            {wrapper}
        );
        expect(container.querySelector('.note-count')).toBeNull();
    });

    it('does not render a note-count badge when noteCount is not provided', () => {
        const {container} = render(
            <PeriodComponent {...defaultProps} />,
            {wrapper}
        );
        expect(container.querySelector('.note-count')).toBeNull();
    });

    it('renders a note-count badge when noteCount is greater than 0', () => {
        const {container} = render(
            <PeriodComponent {...defaultProps} noteCount={3} />,
            {wrapper}
        );
        const badge = container.querySelector('.note-count');
        expect(badge).not.toBeNull();
        expect(badge?.textContent).toBe('3');
        expect(badge?.getAttribute('aria-label')).toBe('3 notes');
        expect(badge?.getAttribute('title')).toBe('3 notes');
    });

    it('applies selected-day class when isSelected is true', () => {
        const {container} = render(
            <PeriodComponent {...defaultProps} isSelected={true} />,
            {wrapper}
        );
        expect(container.firstElementChild?.classList.contains('selected-day')).toBe(true);
    });

    it('applies has-note class when hasPeriodNote is true', () => {
        const {container} = render(
            <PeriodComponent {...defaultProps} hasPeriodNote={true} />,
            {wrapper}
        );
        expect(container.firstElementChild?.classList.contains('has-note')).toBe(true);
    });

    it('sets id to "today" when isToday is true', () => {
        const {container} = render(
            <PeriodComponent {...defaultProps} isToday={true} />,
            {wrapper}
        );
        expect(container.firstElementChild?.id).toBe('today');
    });
});
