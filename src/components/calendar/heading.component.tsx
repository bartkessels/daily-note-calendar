import React from 'react';
import {Year} from 'src/domain/models/year';
import {CalendarHeart, ChevronLeft, ChevronRight} from 'lucide-react';
import {MonthUiModel} from 'src/components/month.ui-model';
import {getYearlyNoteEvent} from 'src/components/providers/yearly-note-event.context';
import {getMonthlyNoteEvent} from 'src/components/providers/monthly-note-event.context';

export interface HeadingProps {
    month?: MonthUiModel;
    year?: Year;
    navigateToPreviousMonth: () => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
}

export const HeadingComponent = ({
    month,
    year,
    navigateToPreviousMonth,
    navigateToNextMonth,
    navigateToCurrentMonth
}: HeadingProps) => {
    const monthlyNoteEvent = getMonthlyNoteEvent();
    const yearlyNoteEvent = getYearlyNoteEvent();

    return (
        <div className="header">
            <span className="title">
                <h1 onClick={() => monthlyNoteEvent?.emitEvent(month?.month)}>{month?.month?.name}</h1>&nbsp;
                <h1 onClick={() => yearlyNoteEvent?.emitEvent(year)}>{year?.name}</h1>&nbsp;
            </span>

            <div className="buttons">
                <ChevronLeft
                    size={18}
                    strokeWidth={1}
                    onClick={navigateToPreviousMonth}/>
                <CalendarHeart
                    size={18}
                    strokeWidth={1}
                    onClick={navigateToCurrentMonth}/>
                <ChevronRight
                    size={18}
                    strokeWidth={1}
                    onClick={navigateToNextMonth}/>
            </div>
        </div>
    );
};