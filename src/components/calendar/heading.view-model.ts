import {Year} from 'src/domain/models/year';
import {Month} from 'src/domain/models/month';
import {getMonthlyNoteEvent} from 'src/components/providers/monthly-note-event.context';
import {getYearlyNoteEvent} from 'src/components/providers/yearly-note-event.context';

export interface HeadingViewModel {
    openYearlyNote: (year?: Year) => void;
    openMonthlyNote: (month?: Month) => void;
}

export const useHeadingViewModel = (): HeadingViewModel => {
    const monthlyNoteEvent = getMonthlyNoteEvent();
    const yearlyNoteEvent = getYearlyNoteEvent();

    const openYearlyNote = (year?: Year): void => yearlyNoteEvent?.emitEvent(year);
    const openMonthlyNote = (month?: Month): void => monthlyNoteEvent?.emitEvent(month);

    return <HeadingViewModel>{
        openYearlyNote,
        openMonthlyNote
    };
};