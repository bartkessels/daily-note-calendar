import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {NoteComponent} from 'src/presentation/components/note.component';
import {ContextMenuAdapterContext} from 'src/presentation/context/context-menu-adapter.context';
import {mockContextMenuAdapter} from 'src/test-helpers/context-menu.mocks';
import {mockNoteWithCreatedOnProperty} from 'src/test-helpers/model.mocks';

describe('NoteComponent', () => {
    const note = mockNoteWithCreatedOnProperty;
    const onOpenInHorizontalSplitView = jest.fn();
    const onOpenInVerticalSplitView = jest.fn();
    const onClick = jest.fn();
    const onDelete = jest.fn();

    const wrapper = ({children}: {children: React.ReactNode}) => (
        <ContextMenuAdapterContext.Provider value={mockContextMenuAdapter}>
            {children}
        </ContextMenuAdapterContext.Provider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        const {container} = render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );
        expect(container.firstChild).toBeTruthy();
    });

    it('renders note name', () => {
        render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );
        expect(screen.getByText(note.name)).toBeTruthy();
    });

    it('renders note path', () => {
        render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );
        expect(screen.getByText(note.path)).toBeTruthy();
    });

    it('renders note creation date', () => {
        render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );
        expect(screen.getByText(/Created at/)).toBeTruthy();
    });

    it('calls onClick when clicked', () => {
        render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );

        const listItem = screen.getByText(note.name).closest('li');
        fireEvent.click(listItem!);

        expect(onClick).toHaveBeenCalledWith(note);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('shows context menu when right-clicked', () => {
        render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );

        const listItem = screen.getByText(note.name).closest('li');
        fireEvent.contextMenu(listItem!);

        expect(mockContextMenuAdapter.show).toHaveBeenCalledTimes(1);
        expect(mockContextMenuAdapter.show).toHaveBeenCalledWith(
            expect.any(Number),
            expect.any(Number),
            expect.objectContaining({
                openInHorizontalSplitView: expect.any(Function),
                openInVerticalSplitView: expect.any(Function),
                onDelete: expect.any(Function),
            }),
        );
    });

    it('calls onOpenInHorizontalSplitView when context menu callback invoked', () => {
        render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );

        const listItem = screen.getByText(note.name).closest('li');
        fireEvent.contextMenu(listItem!);

        const callbacks = mockContextMenuAdapter.show.mock.calls[0][2];
        callbacks.openInHorizontalSplitView();

        expect(onOpenInHorizontalSplitView).toHaveBeenCalledWith(note);
    });

    it('calls onOpenInVerticalSplitView when context menu callback invoked', () => {
        render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );

        const listItem = screen.getByText(note.name).closest('li');
        fireEvent.contextMenu(listItem!);

        const callbacks = mockContextMenuAdapter.show.mock.calls[0][2];
        callbacks.openInVerticalSplitView();

        expect(onOpenInVerticalSplitView).toHaveBeenCalledWith(note);
    });

    it('calls onDelete when context menu callback invoked', () => {
        render(
            <NoteComponent
                note={note}
                onOpenInHorizontalSplitView={onOpenInHorizontalSplitView}
                onOpenInVerticalSplitView={onOpenInVerticalSplitView}
                onClick={onClick}
                onDelete={onDelete}
            />,
            {wrapper},
        );

        const listItem = screen.getByText(note.name).closest('li');
        fireEvent.contextMenu(listItem!);

        const callbacks = mockContextMenuAdapter.show.mock.calls[0][2];
        callbacks.onDelete();

        expect(onDelete).toHaveBeenCalledWith(note);
    });
});
