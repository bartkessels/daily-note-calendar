import {arePeriodsEqual, Period} from 'src/domain/models/period.model';
import React, {ReactElement} from 'react';
import {useDailyNoteViewModel} from 'src/presentation/context/view-model.context';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {isSelectModifierKey} from 'src/domain/models/modifier-key';

interface DailyNoteProperties {
    day: Period;
    today: Period | null;
    selectedPeriod: Period | null;
    isSameMonth: boolean;
    noteCountToken: number;
    onSelect: (period: Period) => void;
}

export const DailyNoteComponent = (props: DailyNoteProperties): ReactElement => {
    const viewModel = useDailyNoteViewModel();
    const [hasPeriodicNote, setHasPeriodicNote] = React.useState<boolean>(false);
    const [noteCount, setNoteCount] = React.useState<number>(0);
    const isSelected = arePeriodsEqual(props.day, props.selectedPeriod);
    const isToday = arePeriodsEqual(props.day, props.today);

    React.useEffect(() => {
        viewModel?.hasPeriodicNote(props.day).then(setHasPeriodicNote);
        viewModel?.getNoteCount(props.day).then(setNoteCount);
    }, [props.day, viewModel, props.noteCountToken]);

    return (
        <PeriodComponent
            name={props.day.name}
            classNames={!props.isSameMonth ? ['other-month'] : []}
            isSelected={isSelected}
            isToday={isToday}
            hasPeriodNote={hasPeriodicNote}
            noteCount={noteCount}
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
};