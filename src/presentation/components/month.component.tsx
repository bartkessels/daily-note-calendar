import {Period} from 'src/domain/models/period.model';
import React, {ReactElement} from 'react';
import {useMonthlyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import {PeriodComponent} from 'src/presentation/components/period.component';

interface MonthlyNoteProperties {
    month: Period;
}

export const MonthlyNoteComponent = (props: MonthlyNoteProperties): ReactElement => {
    const viewModel = useMonthlyNoteViewModel();
    const [hasPeriodicNote, setHasPeriodicNote] = React.useState<boolean>(false);

    viewModel?.hasPeriodicNote(props.month).then(setHasPeriodicNote.bind(this));

    return (
        <PeriodComponent
            name={props.month.name}
            isSelected={false}
            isToday={false}
            hasPeriodNote={hasPeriodicNote}
            onClick={(key) => viewModel?.openNote(key, props.month)}
            onOpenInHorizontalSplitViewClick={(key) => viewModel?.openNoteInHorizontalSplitView(key, props.month)}
            onOpenInVerticalSplitViewClick={(key) => viewModel?.openNoteInVerticalSplitView(key, props.month)}
            onDelete={() => viewModel?.deleteNote(props.month)} />
    );
}