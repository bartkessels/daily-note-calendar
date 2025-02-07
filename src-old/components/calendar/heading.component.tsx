import React, {ReactElement} from 'react';
import {Year} from 'src-old/domain/models/year';
import {CalendarHeart, ChevronLeft, ChevronRight} from 'lucide-react';
import {MonthUiModel} from 'src-old/components/models/month.ui-model';
import {Month} from 'src-old/domain/models/month';
import { ManageAction } from 'src-old/domain/events/manage.event';
import {getManageMonthEvent, getManageYearEvent} from 'src-old/components/context/periodic-note-event.context';

export interface HeadingProps {
    month?: MonthUiModel;
    year?: Year;
    navigateToPreviousMonth?: () => void;
    navigateToNextMonth?: () => void;
    navigateToCurrentMonth?: () => void;
}

export const HeadingComponent = ({
    month,
    year,
    navigateToPreviousMonth,
    navigateToNextMonth,
    navigateToCurrentMonth
}: HeadingProps): ReactElement => {
    const manageMonthEvent = getManageMonthEvent();
    const manageYearEvent = getManageYearEvent();

    return (
        <div className="header">
            <span className="title">
                <h1 onClick={() => manageMonthEvent?.emitEvent(ManageAction.Open, month?.month)}>{month?.month?.name}</h1>&nbsp;
                <h1 onClick={() => manageYearEvent?.emitEvent(ManageAction.Open, year)}>{year?.name}</h1>&nbsp;
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