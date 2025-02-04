import {PeriodUiModel} from 'src-new/presentation/models/period.ui-model';
import {ModifierKey} from 'src-new/presentation/models/modifier-key';
import {PeriodView} from 'src-new/presentation/views/period.view';

interface HeadingViewProperties {
    month?: PeriodUiModel;
    year?: PeriodUiModel;
    onMonthClicked: (key: ModifierKey, model: PeriodUiModel) => void;
    onYearClicked: (key: ModifierKey, model: PeriodUiModel) => void;
}

export const HeadingView = ({month, year, onMonthClicked, onYearClicked}: HeadingViewProperties) => {
    return (
        <div className="header">
            <span className="title">
                <PeriodView onClick={onMonthClicked} model={month}/>&nbsp;
                <PeriodView onClick={onYearClicked} model={year}/>&nbsp;
            </span>
        </div>
    );
};