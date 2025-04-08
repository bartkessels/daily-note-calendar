import {Period} from 'src/domain/models/period.model';
import React, {ReactElement} from 'react';
import {useQuarterlyNoteViewModel} from 'src/presentation/context/view-model.context';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {isSelectModifierKey} from 'src/domain/models/modifier-key';

interface QuarterlyNoteProperties {
    quarter: Period;
    onSelect: (period: Period) => void;
}

export const QuarterlyNoteComponent = (props: QuarterlyNoteProperties): ReactElement => {
    const viewModel = useQuarterlyNoteViewModel();
    const [hasPeriodicNote, setHasPeriodicNote] = React.useState<boolean>(false);

    viewModel?.hasPeriodicNote(props.quarter).then(setHasPeriodicNote.bind(this));

    return (
        <PeriodComponent
            name={props.quarter.name}
            isSelected={false}
            isToday={false}
            hasPeriodNote={hasPeriodicNote}
            onClick={(key) => {
                props.onSelect(props.quarter);

                if (!isSelectModifierKey(key)) {
                    viewModel?.openNote(key, props.quarter);
                }
            }}
            onOpenInHorizontalSplitViewClick={(key) => {
                props.onSelect(props.quarter);
                viewModel?.openNoteInHorizontalSplitView(key, props.quarter);
            }}
            onOpenInVerticalSplitViewClick={(key) => {
                props.onSelect(props.quarter);
                viewModel?.openNoteInVerticalSplitView(key, props.quarter);
            }}
            onDelete={() => viewModel?.deleteNote(props.quarter)} />
    );
}