import {Day} from 'src/domain/models/day';
import React, {useMemo} from 'react';
import {DayViewModel, useDayViewModel} from 'src/components/calendar/day.view-model';

interface DayProps {
    day?: Day;
    viewModel: DayViewModel;
}

export const DayComponent = ({ day, viewModel }: DayProps) => {
    const isToday = viewModel.isToday(day);
    const isSelected = viewModel.isSelected(day);

    return (
        <td
            id={isToday ? 'today' : ''}
            className={isSelected ? 'selected-day' : ''}
            onClick={() => viewModel.openDailyNote(day)}
        >{day?.name}</td>
    )
};