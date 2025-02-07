import {createContext, useContext} from 'react';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';

export const CalendarViewModelContext = createContext<CalendarViewModel | null>(null);
export const useCalendarViewModel = (): CalendarViewModel | null => {
    return useContext(CalendarViewModelContext);
};