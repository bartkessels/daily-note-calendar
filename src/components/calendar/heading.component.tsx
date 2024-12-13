import React from 'react';
import {Year} from 'src/domain/models/year';
import {Month} from 'src/domain/models/month';
import {CalendarHeart, ChevronLeft, ChevronRight} from 'lucide-react';
import {HeadingViewModel} from 'src/components/calendar/heading.view-model';

export interface HeadingProps {
    month?: Month;
    year?: Year;
    viewModel: HeadingViewModel;
    navigateToPreviousMonth: () => void;
    navigateToNextMonth: () => void;
    navigateToCurrentMonth: () => void;
}

export const HeadingComponent = ({
    month,
    year,
    viewModel,
    navigateToPreviousMonth,
    navigateToNextMonth,
    navigateToCurrentMonth
}: HeadingProps) => {
    return (
        <div className="header">
            <span className="title">
                <h1 onClick={() => viewModel.openMonthlyNote(month)}>{month?.name}</h1>&nbsp;
                <h1 onClick={() => viewModel.openYearlyNote(year)}>{year?.name}</h1>&nbsp;
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