import {Day, dayEquals} from 'src-old/domain/models/day';

export interface DayUiModel {
    currentDay?: Day;
    isSelected: boolean;
    isToday: boolean;
    hasNote: boolean;
}

export const EMPTY_DAY = <DayUiModel>{
    currentDay: undefined,
    isSelected: false,
    isToday: false,
    hasNote: false
};

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