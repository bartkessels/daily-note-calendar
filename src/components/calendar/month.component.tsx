import React, {ReactElement} from 'react';
import {WeekComponent} from 'src/components/calendar/week.component';
import {MonthUiModel} from 'src/components/models/month.ui-model';

interface MonthProps {
    month?: MonthUiModel;
}

export const MonthComponent = ({ month }: MonthProps): ReactElement => {
    return (
        <>
            {month?.weeks.map((week, weekIndex) =>
                <WeekComponent key={weekIndex} week={week} />
            )}
        </>
    );
};