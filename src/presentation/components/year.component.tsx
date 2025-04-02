import {Period} from 'src/domain/models/period.model';
import {useYearlyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import React, {ReactElement} from 'react';
import {PeriodComponent} from 'src/presentation/components/period.component';

interface YearlyNoteProperties {
    year: Period;
}

export const YearlyNoteComponent = (props: YearlyNoteProperties): ReactElement => {
    const viewModel = useYearlyNoteViewModel();
    const [hasPeriodicNote, setHasPeriodicNote] = React.useState<boolean>(false);

    viewModel?.hasPeriodicNote(props.year).then(setHasPeriodicNote.bind(this));

    return (
        <PeriodComponent
            name={props.year.name}
            isSelected={false}
            isToday={false}
            hasPeriodNote={hasPeriodicNote}
            onClick={(key) => viewModel?.openNote(key, props.year)}
            onOpenInHorizontalSplitViewClick={(key) => viewModel?.openNoteInHorizontalSplitView(key, props.year)}
            onOpenInVerticalSplitViewClick={(key) => viewModel?.openNoteInVerticalSplitView(key, props.year)}
            onDelete={() => viewModel?.deleteNote(props.year)} />
    );
}