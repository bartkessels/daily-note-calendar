import {Month} from 'src/domain/models/month';
import React from 'react';
import {WeekComponent} from 'src/components/calendar/week.component';

interface MonthProps {
    month?: Month;
}

export const MonthComponent = ({ month }: MonthProps) => {
    return (
        <>
            {month?.weeks.map((week, weekIndex) =>
                <WeekComponent key={weekIndex} week={week} />
            )}
        </>
    );
};