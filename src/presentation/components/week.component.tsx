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

export const WeekComponent = (
    {
        model,
        currentMonth,
        selectedPeriod,
        currentPeriod,
        onWeekClick,
        onDeleteWeekClick,
        onDayClick,
        onDeleteDayClick
    }: WeekComponentProperties
): ReactElement => {
    if (!model) {
        return (
            <tr>
                <td colSpan={8} className="dnc-skeleton dnc-skeleton-week"/>
            </tr>
        );
    }

    return (
        <tr>
            <td height="35" className="weekNumber" key={model.weekNumber}>
                <PeriodComponent
                    model={model}
                    isSelected={arePeriodUiModelsEqual(model, selectedPeriod)}
                    onClick={onWeekClick}
                    onDelete={onDeleteWeekClick}
                />
            </td>

            {model.days.map((day, index) => (
                <td height="35" key={index}
                    className={day.period.date.isSameMonth(currentMonth?.period) ? '' : 'other-month'}>
                    <PeriodComponent
                        model={day}
                        isToday={arePeriodUiModelsEqual(day, currentPeriod)}
                        isSelected={arePeriodUiModelsEqual(day, selectedPeriod)}
                        onClick={onDayClick}
                        onDelete={onDeleteDayClick}
                    />
                </td>
            ))}
        </tr>
    );
}