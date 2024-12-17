import {createContext, useContext} from 'react';
import {CalendarUiModel} from 'src/components/calendar.ui-model';
import {Enhancer} from 'src/domain/enhancers/enhancer';

export const CalendarEnhancerContext = createContext<Enhancer<CalendarUiModel> | null>(null);
export const useCalenderEnhancer = (): Enhancer<CalendarUiModel> | null => {
    return useContext(CalendarEnhancerContext);
}