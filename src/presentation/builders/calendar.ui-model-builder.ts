import { UiModelBuilder } from 'src/presentation/contracts/ui-model-builder';
import {DayOfWeek, WeekModel} from 'src/domain/models/week.model';
import { CalendarUiModel } from 'src/presentation/models/calendar.ui-model';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';
import {GeneralSettings} from 'src/domain/settings/general.settings';

export class CalendarUiModelBuilder implements UiModelBuilder<WeekModel[], CalendarUiModel> {
    private settings: GeneralSettings | null = null;
    private selectedPeriod: Period | null = null;
    private today: Period | null = null;
    private value: WeekModel[] = [];

    constructor(
        private readonly weekBuilder: UiModelBuilder<WeekModel[], WeekUiModel[]>,
        private readonly periodBuilder: UiModelBuilder<Period, PeriodUiModel>
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.settings = settings.generalSettings;
        this.weekBuilder.withSettings(settings);
        this.periodBuilder.withSettings(settings);
    }

    public withSelectedPeriod(period: Period): CalendarUiModelBuilder {
        this.selectedPeriod = period;
        return this;
    }

    public withToday(today: Period): CalendarUiModelBuilder {
        this.today = today;
        return this;
    }

    public withValue(value: WeekModel[]): UiModelBuilder<WeekModel[], CalendarUiModel> {
        this.value = value;
        return this;
    }

    public async build(): Promise<CalendarUiModel> {
        if (!this.settings) {
            throw new Error('Settings not set');
        }

        const today = this.today ? await this.periodBuilder.withValue(this.today).build() : null;
        const selectedPeriod = this.selectedPeriod ? await this.periodBuilder.withValue(this.selectedPeriod).build() : null;
        const startWeekOnMonday = this.settings.firstDayOfWeek === DayOfWeek.Monday;

        if (this.value.length <= 0) {
            return <CalendarUiModel>{
                lastUpdateRequest: new Date(),
                today: today,
                startWeekOnMonday: startWeekOnMonday,
                selectedPeriod: selectedPeriod,
                weeks: [],
                month: undefined,
                quarter: undefined,
                year: undefined
            };
        }

        const weeks = await this.weekBuilder.withValue(this.value).build();
        const month = this.getMiddleWeek(weeks).month;
        const quarter = this.getMiddleWeek(weeks).quarter;
        const year = this.getMiddleWeek(weeks).year;

        return <CalendarUiModel>{
            lastUpdateRequest: new Date(),
            today: today,
            startWeekOnMonday: startWeekOnMonday,
            selectedPeriod: selectedPeriod,
            weeks: weeks,
            month: month,
            quarter: quarter,
            year: year
        };
    }

    private getMiddleWeek(weeks: WeekUiModel[]): WeekUiModel {
        return weeks[Math.floor(weeks.length / 2)];
    }
}