import {mockNoteManager} from 'src/test-helpers/manager.mocks';
import {DefaultNoteService} from 'src/presentation/services/default.note-service';
import {mockNoteManagerFactory} from 'src/test-helpers/factory.mocks';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {Note} from 'src/domain/models/note.model';

describe('defaultNoteService', () => {
    const noteManager = mockNoteManager;
    const period = <Period> {
        date: new Date(2023, 9, 2),
        name: '02',
        type: PeriodType.Day
    };
    const note: Note = {
        createdOn: period,
        createdOnProperty: null,
        name: 'My note',
        path: 'path/to/note',
        properties: new Map()
    };

    let service: DefaultNoteService;

    beforeEach(() => {
        const noteManagerFactory = mockNoteManagerFactory(noteManager);

        service = new DefaultNoteService(noteManagerFactory);
    });

    describe('getNotesForPeriod', () => {
        it('should call the manager', async () => {
            // Act
            await service.getNotesForPeriod(period);

            // Assert
            expect(noteManager.getNotesForPeriod).toHaveBeenCalledWith(period);
        });
    });

    describe('openNote', () => {
        it('should call the manager', async () => {
            // Act
            await service.openNote(note);

            // Assert
            expect(noteManager.openNote).toHaveBeenCalledWith(note);
        });
    });

    describe('openNoteInHorizontalSplitView', () => {
        it('should call the manager', async () => {
            // Act
            await service.openNoteInHorizontalSplitView(note);

            // Assert
            expect(noteManager.openNoteInHorizontalSplitView).toHaveBeenCalledWith(note);
        });
    });

    describe('openNoteInVerticalSplitView', () => {
        it('should call the manager', async () => {
            // Act
            await service.openNoteInVerticalSplitView(note);

            // Assert
            expect(noteManager.openNoteInVerticalSplitView).toHaveBeenCalledWith(note);
        });
    });

    describe('deleteNote', () => {
        it('should call the manager', async () => {
            // Act
            await service.deleteNote(note);

            // Assert
            expect(noteManager.deleteNote).toHaveBeenCalledWith(note);
        });
    });
});