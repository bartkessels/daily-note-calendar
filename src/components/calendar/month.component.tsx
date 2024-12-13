import {Month} from 'src/domain/models/month';
import React from 'react';
import {WeekComponent} from 'src/components/calendar/week.component';
import {WeekViewModel} from 'src/components/calendar/week.view-model';
import {DayViewModel} from 'src/components/calendar/day.view-model';

interface MonthProps {
    month?: Month;
    weekViewModel: WeekViewModel;
    dayViewModel: DayViewModel;
}

export const MonthComponent = ({ month, weekViewModel, dayViewModel }: MonthProps) => {
    return (
        <>
            {month?.weeks.map((week, weekIndex) =>
                <WeekComponent key={weekIndex} week={week} viewModel={weekViewModel} dayViewModel={dayViewModel} />
            )}
        </>
    );
};