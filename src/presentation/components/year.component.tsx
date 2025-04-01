import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {Period} from 'src/domain/models/period.model';
import {useYearlyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import React, {ReactElement} from 'react';
import {PeriodComponent} from 'src/presentation/components/period.component';

interface YearlyNoteProperties {
    initialUiModel?: PeriodUiModel;
    year: Period;
}

export const YearlyNoteComponent = (props: YearlyNoteProperties): ReactElement => {
    const viewModel = useYearlyNoteViewModel();
    const [uiModel, setUiModel] = React.useState<PeriodUiModel | null>(props.initialUiModel ?? null);

    React.useEffect(() => {
        viewModel?.setUpdateUiModel(setUiModel);
        viewModel?.initialize(props.year);
    }, [viewModel, setUiModel, props.year]);

    return (
        <PeriodComponent
            name={props.year.name}
            isSelected={false}
            isToday={false}
            hasPeriodNote={uiModel?.hasPeriodNote ?? false}
            onClick={(key) => viewModel?.openNote(key, props.year)}
            onOpenInHorizontalSplitViewClick={(key) => viewModel?.openNoteInHorizontalSplitView(key, props.year)}
            onOpenInVerticalSplitViewClick={(key) => viewModel?.openNoteInVerticalSplitView(key, props.year)}
            onDelete={() => viewModel?.deleteNote(props.year)} />
    );
}