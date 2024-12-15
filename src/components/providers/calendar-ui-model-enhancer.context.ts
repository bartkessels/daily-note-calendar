import {createContext, useContext} from 'react';
import { CalendarUiModelEnhancer } from '../enhancers/calendar.ui-model.enhancer';

export const CalendarUiModelEnhancerContext = createContext<CalendarUiModelEnhancer | null>(null);
export const getCalendarUiModelEnhancer = (): CalendarUiModelEnhancer | null => {
    return useContext(CalendarUiModelEnhancerContext);
}