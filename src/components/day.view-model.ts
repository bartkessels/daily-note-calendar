import {Day} from 'src/domain/models/day';
import {getDailyNoteEvent} from 'src/components/providers/daily-note-event.context';

export interface DayViewModel {
    openDailyNote: (day?: Day) => void;
}

export const useDayViewModel = (): DayViewModel => {
    const dailyNoteEvent = getDailyNoteEvent();

    const openDailyNote = (day?: Day): void => {
        dailyNoteEvent?.emitEvent(day);
    };

    return <DayViewModel> {
        openDailyNote
    };
};