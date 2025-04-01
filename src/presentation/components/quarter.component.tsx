import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {Period} from 'src/domain/models/period.model';
import React, {ReactElement} from 'react';
import {useQuarterlyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import {PeriodComponent} from 'src/presentation/components/period.component';

interface QuarterlyNoteProperties {
    initialUiModel?: PeriodUiModel;
    quarter: Period;
}

export const QuarterlyNoteComponent = (props: QuarterlyNoteProperties): ReactElement => {
    const viewModel = useQuarterlyNoteViewModel();
    const [uiModel, setUiModel] = React.useState<PeriodUiModel | null>(props.initialUiModel ?? null);

    React.useEffect(() => {
        viewModel?.setUpdateUiModel(setUiModel);
        viewModel?.initialize(props.quarter);
    }, [viewModel, setUiModel, props.quarter]);

    return (
        <PeriodComponent
            name={props.quarter.name}
            isSelected={false}
            isToday={false}
            hasPeriodNote={uiModel?.hasPeriodNote ?? false}
            onClick={(key) => viewModel?.openNote(key, props.quarter)}
            onOpenInHorizontalSplitViewClick={(key) => viewModel?.openNoteInHorizontalSplitView(key, props.quarter)}
            onOpenInVerticalSplitViewClick={(key) => viewModel?.openNoteInVerticalSplitView(key, props.quarter)}
            onDelete={() => viewModel?.deleteNote(props.quarter)} />
    );
}