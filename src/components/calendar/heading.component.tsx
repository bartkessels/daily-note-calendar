import { useDateManager } from "../providers/date-manager.context";
import React from 'react';
import {Year} from 'src/domain/models/year';
import {Month} from 'src/domain/models/month';
import { getMonthlyNoteEvent } from "../providers/monthly-note-event.context";
import { getQuarterlyNoteEvent } from "../providers/quarterly-note-event.context";
import { getYearlyNoteEvent } from "../providers/yearly-note-event.context";
import {CalendarHeart, ChevronLeft, ChevronRight} from 'lucide-react';

export const HeadingComponent = () => {
    const dateManager = useDateManager();
    const [currentYear, setCurrentYear] = React.useState<Year | undefined>();
    const [currentMonth, setCurrentMonth] = React.useState<Month | undefined>();

    const monthlyNoteEvent = getMonthlyNoteEvent();
    const quarterlyNoteEvent = getQuarterlyNoteEvent();
    const yearlyNoteEvent = getYearlyNoteEvent();

    const updateMonth = (month?: Month): void => {
        setCurrentMonth(month);
        setCurrentYear(dateManager?.getYear(month));
    };

    const goToCurrentMonth = (): void => { updateMonth(dateManager?.getCurrentMonth()) };
    const goToNextMonth = (): void => { updateMonth(dateManager?.getNextMonth(currentMonth)) };
    const goToPreviousMonth = (): void => { updateMonth(dateManager?.getPreviousMonth(currentMonth)) };

    return (
        <div className="header">
            <span className="title">
                <h1 onClick={() => monthlyNoteEvent?.emitEvent(currentMonth)}>{currentMonth?.name}</h1>&nbsp;
                <h1 onClick={() => yearlyNoteEvent?.emitEvent(currentYear)}>{currentYear?.name}</h1>&nbsp;
            </span>

            <div className="buttons">
                <ChevronLeft
                    size={18}
                    strokeWidth={1}
                    onClick={goToPreviousMonth}/>
                <CalendarHeart
                    size={18}
                    strokeWidth={1}
                    onClick={goToCurrentMonth}/>
                <ChevronRight
                    size={18}
                    strokeWidth={1}
                    onClick={goToNextMonth}/>
            </div>
        </div>
    );
};