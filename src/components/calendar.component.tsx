import * as React from 'react';
import {useDateManager} from 'src/components/providers/date-manager.context';
import {getMonthlyNoteEvent} from 'src/components/providers/monthly-note-event.context';
import {Month} from 'src/domain/models/month';
import {getQuarterlyNoteEvent} from 'src/components/providers/quarterly-note-event.context';
import {MonthComponent} from 'src/components/calendar/month.component';
import {HeadingComponent} from 'src/components/calendar/heading.component';

export const CalendarComponent = () => {
    const dateManager = useDateManager();
    const [currentMonth, setCurrentMonth] = React.useState<Month | undefined>(dateManager?.getCurrentMonth());

    const monthlyNoteEvent = getMonthlyNoteEvent();
    const quarterlyNoteEvent = getQuarterlyNoteEvent();

    monthlyNoteEvent?.onEvent('CalendarComponent', (month) => setCurrentMonth(month));

    return (
        <div className="dnc">
            <HeadingComponent />

            <table>
                <thead>
                <tr>
                    <th className="quarter" onClick={() => quarterlyNoteEvent?.emitEvent(currentMonth)}>Q{currentMonth?.quarter}</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                </tr>
                </thead>
                <tbody>
                    <MonthComponent month={currentMonth} />
                </tbody>
            </table>
        </div>
    );
};
