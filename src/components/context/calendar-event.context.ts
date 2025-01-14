import {Event} from 'src/domain/events/event';
import {CalendarUiModel} from 'src/components/models/calendar.ui-model';
import React from 'react';

export interface CalendarEvent {
    enhancedCalendarEvent?: Event<CalendarUiModel>;
}

export const CalendarEventContext = React.createContext<CalendarEvent | null>(null);

export const getEnhancedCalendarEvent = (): Event<CalendarUiModel> | null => {
    return React.useContext(CalendarEventContext)?.enhancedCalendarEvent ?? null;
}