import {Period} from 'src/domain/models/period.model';
import {useYearlyNoteViewModel} from 'src/presentation/context/view-model.context';
import React, {ReactElement} from 'react';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {isSelectModifierKey} from 'src/domain/models/modifier-key';

interface YearlyNoteProperties {
    year: Period;
    onSelect: (period: Period) => void;
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
            onClick={(key) => {
                props.onSelect(props.year);
                viewModel?.openNote(key, props.year);
            }}
            onOpenInHorizontalSplitViewClick={(key) => {
                props.onSelect(props.year);

                if (!isSelectModifierKey(key)) {
                    viewModel?.openNoteInHorizontalSplitView(key, props.year);
                }
            }}
            onOpenInVerticalSplitViewClick={(key) => {
                props.onSelect(props.year);
                viewModel?.openNoteInVerticalSplitView(key, props.year);
            }}
            onDelete={() => viewModel?.deleteNote(props.year)} />
    );
}