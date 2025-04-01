import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {Period} from 'src/domain/models/period.model';
import React, {ReactElement} from 'react';
import {useMonthlyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import {PeriodComponent} from 'src/presentation/components/period.component';

interface MonthlyNoteProperties {
    initialUiModel?: PeriodUiModel;
    month: Period;
}

export const MonthlyNoteComponent = (props: MonthlyNoteProperties): ReactElement => {
    const viewModel = useMonthlyNoteViewModel();
    const [uiModel, setUiModel] = React.useState<PeriodUiModel | null>(props.initialUiModel ?? null);

    React.useEffect(() => {
        viewModel?.setUpdateUiModel(setUiModel);
        viewModel?.initialize(props.month);
    }, [viewModel, setUiModel, props.month]);

    return (
        <PeriodComponent
            name={props.month.name}
            isSelected={false}
            isToday={false}
            hasPeriodNote={uiModel?.hasPeriodNote ?? false}
            onClick={(key) => viewModel?.openNote(key, props.month)}
            onOpenInHorizontalSplitViewClick={(key) => viewModel?.openNoteInHorizontalSplitView(key, props.month)}
            onOpenInVerticalSplitViewClick={(key) => viewModel?.openNoteInVerticalSplitView(key, props.month)}
            onDelete={() => viewModel?.deleteNote(props.month)} />
    );
}