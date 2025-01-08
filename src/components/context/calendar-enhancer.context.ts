import {createContext, useContext} from 'react';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import {Enhancerold} from 'src/domain/enhancers/enhancerold';

export const CalendarEnhancerContext = createContext<Enhancerold<CalendarUiModel> | null>(null);
export const useCalenderEnhancer = (): Enhancerold<CalendarUiModel> | null => {
    return useContext(CalendarEnhancerContext);
}