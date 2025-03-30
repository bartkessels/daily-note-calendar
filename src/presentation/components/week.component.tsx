import {ModifierKey} from 'src/presentation/models/modifier-key';
import {arePeriodUiModelsEqual, PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {ReactElement} from 'react';
import {PeriodComponent} from 'src/presentation/components/period.component';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {Period} from 'src/domain/models/period.model';

interface WeekComponentProperties {
    model: WeekUiModel | null;
    currentMonth: PeriodUiModel | undefined;
    selectedPeriod?: PeriodUiModel;
    currentPeriod?: PeriodUiModel;
    onWeekClick: (key: ModifierKey, week: Period) => void;
    onDeleteWeekClick: (week: PeriodUiModel) => void;
    onDayClick: (key: ModifierKey, day: Period) => void;
    onDeleteDayClick: (day: PeriodUiModel) => void;
}

export const WeekComponent = (props: WeekComponentProperties): ReactElement => {
    if (!props || !props?.model) {
        return (
            <tr>
                <td colSpan={8} className="dnc-skeleton dnc-skeleton-week"/>
            </tr>
        );
    }

    return (
        <tr>
            <td height="35" className="weekNumber" key={props.model.weekNumber}>
                <PeriodComponent
                    model={props.model}
                    isSelected={arePeriodUiModelsEqual(props.model, props.selectedPeriod)}
                    onClick={props.onWeekClick}
                    onDelete={props.onDeleteWeekClick}
                />
            </td>

            {props.model.days.map((day, index) => (
                <td height="35" key={index}
                    className={day.period.date.isSameMonth(props.currentMonth?.period) ? '' : 'other-month'}>
                    <PeriodComponent
                        model={day}
                        isToday={arePeriodUiModelsEqual(day, props.currentPeriod)}
                        isSelected={arePeriodUiModelsEqual(day, props.selectedPeriod)}
                        onClick={props.onDayClick}
                        onDelete={props.onDeleteDayClick}
                    />
                </td>
            ))}
        </tr>
    );
}