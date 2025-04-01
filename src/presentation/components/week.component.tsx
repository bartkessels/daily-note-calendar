import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import React, {ReactElement} from 'react';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {arePeriodsEqual, Period} from 'src/domain/models/period.model';
import {useWeeklyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import {DailyNoteComponent} from 'src/presentation/components/day.component';

interface WeeklyNoteProperties {
    initialUiModel?: PeriodUiModel;
    week: Period;
    days: Period[];
    today: Period | null;
    selectedPeriod: Period | null;
    onSelect: (period: Period) => void;
}

export const WeeklyNoteComponent = (props: WeeklyNoteProperties): ReactElement => {
    const viewModel = useWeeklyNoteViewModel();
    const [uiModel, setUiModel] = React.useState<PeriodUiModel | null>(props.initialUiModel ?? null);

    React.useEffect(() => {
        viewModel?.setUpdateUiModel(setUiModel);
        viewModel?.initialize(props.week);
    }, [viewModel, setUiModel, props.week]);

    const isSelected = arePeriodsEqual(props.selectedPeriod, props.week);

    return (
        <tr>
            <td height="35" className="weekNumber">
                <PeriodComponent
                    name={props.week.name}
                    isSelected={isSelected}
                    isToday={false}
                    hasPeriodNote={uiModel?.hasPeriodNote ?? false}
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
                        onSelect={() => props.onSelect(day)} />
                </td>
            ))}
        </tr>
    );
};
