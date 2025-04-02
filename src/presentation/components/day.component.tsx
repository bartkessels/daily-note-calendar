import {arePeriodsEqual, Period} from 'src/domain/models/period.model';
import React, {ReactElement} from 'react';
import {useDailyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {isSelectModifierKey} from 'src/presentation/models/modifier-key';

interface DailyNoteProperties {
    day: Period;
    today: Period | null;
    selectedPeriod: Period | null;
    isSameMonth: boolean;
    onSelect: (period: Period) => void;
}

export const DailyNoteComponent = (props: DailyNoteProperties): ReactElement => {
    const viewModel = useDailyNoteViewModel();
    const [hasPeriodicNote, setHasPeriodicNote] = React.useState<boolean>(false);
    const isSelected = arePeriodsEqual(props.day, props.selectedPeriod);
    const isToday = arePeriodsEqual(props.day, props.today);

    viewModel?.hasPeriodicNote(props.day).then(setHasPeriodicNote.bind(this));

    return (
        <PeriodComponent
            name={props.day.name}
            classNames={!props.isSameMonth ? ['other-month'] : []}
            isSelected={isSelected}
            isToday={isToday}
            hasPeriodNote={hasPeriodicNote}
            onClick={(key) => {
                props.onSelect(props.day);

                if (!isSelectModifierKey(key)) {
                    viewModel?.openNote(key, props.day);
                }
            }}
            onOpenInHorizontalSplitViewClick={(key) => {
                props.onSelect(props.day);
                viewModel?.openNoteInHorizontalSplitView(key, props.day);
            }}
            onOpenInVerticalSplitViewClick={(key) => {
                props.onSelect(props.day);
                viewModel?.openNoteInVerticalSplitView(key, props.day);
            }}
            onDelete={() => viewModel?.deleteNote(props.day)}/>
    );
}