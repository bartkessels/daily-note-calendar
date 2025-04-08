import {Period} from 'src/domain/models/period.model';
import React, {ReactElement} from 'react';
import {useMonthlyNoteViewModel} from 'src/presentation/context/view-model.context';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {isSelectModifierKey} from 'src/domain/models/modifier-key';

interface MonthlyNoteProperties {
    month: Period;
    onSelect: (period: Period) => void;
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
            onClick={(key) => {
                props.onSelect(props.month);

                if (!isSelectModifierKey(key)) {
                    viewModel?.openNote(key, props.month);
                }
            }}
            onOpenInHorizontalSplitViewClick={(key) => {
                props.onSelect(props.month);
                viewModel?.openNoteInHorizontalSplitView(key, props.month);
            }}
            onOpenInVerticalSplitViewClick={(key) => {
                props.onSelect(props.month);
                viewModel?.openNoteInVerticalSplitView(key, props.month);
            }}
            onDelete={() => viewModel?.deleteNote(props.month)} />
    );
}