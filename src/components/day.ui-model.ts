import {Day, dayEquals} from 'src/domain/models/day';

export interface DayUiModel {
    currentDay?: Day;
    isSelected: boolean;
    isToday: boolean;
    hasNote: boolean;
}

export function createDayUiModel(day: Day, selectedDay?: Day): DayUiModel {
    const isSelected = dayEquals(day, selectedDay);
    const isToday = day.date.isToday();

    return <DayUiModel>{
        currentDay: day,
        isSelected: isSelected,
        isToday: isToday,
        hasNote: false
    };
}