import React, {ReactElement} from 'react';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {arePeriodsEqual, Period} from 'src/domain/models/period.model';
import {useWeeklyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import {DailyNoteComponent} from 'src/presentation/components/day.component';
import {Week} from 'src/domain/models/week';

interface WeeklyNoteProperties {
    week: Week;
    days: Period[];
    today: Period;
    selectedPeriod: Period | null;
    currentMonth: Period | null;
    onSelect: (period: Period) => void;
}

export const WeeklyNoteComponent = (props: WeeklyNoteProperties): ReactElement => {
    const viewModel = useWeeklyNoteViewModel();
    const [hasPeriodicNote, setHasPeriodicNote] = React.useState<boolean>(false);
    const isSelected = arePeriodsEqual(props.selectedPeriod, props.week);

    viewModel?.hasPeriodicNote(props.week).then(setHasPeriodicNote.bind(this));

    return (
        <tr>
            <td height="35" className="weekNumber">
                <PeriodComponent
                    name={props.week.name}
                    isSelected={isSelected}
                    isToday={false}
                    hasPeriodNote={hasPeriodicNote}
                    onClick={(key) => {
                        props.onSelect(props.week);
                        viewModel?.openNote(key, props.week);
                    }}
                    onOpenInHorizontalSplitViewClick={(key) => {
                        props.onSelect(props.week);
                        viewModel?.openNoteInHorizontalSplitView(key, props.week);
                    }}
                    onOpenInVerticalSplitViewClick={(key) => {
                        props.onSelect(props.week);
                        viewModel?.openNoteInVerticalSplitView(key, props.week);
                    }}
                    onDelete={() => viewModel?.deleteNote(props.week)}
                />
            </td>

            {props.days.map((day, index) => (
                <td height="35" key={index}>
                    <DailyNoteComponent
                        day={day}
                        selectedPeriod={props.selectedPeriod}
                        today={props.today}
                        isSameMonth={day.date.isSameMonth(props.currentMonth)}
                        onSelect={() => props.onSelect(day)} />
                </td>
            ))}
        </tr>
    );
};
