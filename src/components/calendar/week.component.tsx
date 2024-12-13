import {Week} from 'src/domain/models/week';
import {DayComponent, DayProps} from 'src/components/calendar/day.component';
import * as React from 'react';
import {DayViewModel} from 'src/components/calendar/day.view-model';

export interface WeekProps {
    week?: Week;
    viewModel: WeekViewModel;
    dayViewModel: DayViewModel;
}

export const WeekComponent = ({ week, viewModel, dayViewModel }: WeekProps) => {
    const sortedDays = viewModel.sortDays(week);

    return (
        <tr>
            <td
                className="weekNumber"
                key={week?.weekNumber}
                onClick={() => viewModel.openWeeklyNote(week)}
            >{week?.weekNumber}</td>

            {sortedDays.map((day, dayIndex) => {
                return (<DayComponent key={dayIndex} day={day} viewModel={dayViewModel}/>);
            })}
        </tr>
    );
}