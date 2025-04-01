import {arePeriodsEqual, Period} from 'src/domain/models/period.model';
import React, {ReactElement} from 'react';
import {useDailyNoteViewModel} from 'src/presentation/context/period-view-model.context';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {PeriodComponent} from 'src/presentation/components/period.component';

interface DailyNoteProperties {
    initialUiModel?: PeriodUiModel;
    day: Period;
    today?: Period;
    selectedPeriod?: Period;
    onSelect: (period: Period) => void;
}

export const DailyNoteComponent = (props: DailyNoteProperties): ReactElement => {
    const viewModel = useDailyNoteViewModel();
    const [uiModel, setUiModel] = React.useState<PeriodUiModel | null>(props.initialUiModel ?? null);

    React.useEffect(() => {
        viewModel?.setUpdateUiModel(setUiModel);
    }, [viewModel, setUiModel]);

    const isSelected = arePeriodsEqual(props.day, props.today);
    const isToday = arePeriodsEqual(props.day, props.selectedPeriod);

    return (
        <PeriodComponent
            name={props.day.name}
            isSelected={isSelected}
            isToday={isToday}
            hasPeriodNote={uiModel?.hasPeriodNote ?? false}
            onClick={(key) => {
                props.onSelect(props.day);
                viewModel?.openNote(key, props.day);
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