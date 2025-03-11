import { UiModelBuilder } from 'src/presentation/contracts/ui-model-builder';
import {DayOfWeek} from 'src/domain/models/week.model';
import { CalendarUiModel } from 'src/presentation/models/calendar.ui-model';
import {WeekUiModel} from 'src/presentation/models/week.ui-model';
import {PluginSettings} from 'src/domain/settings/plugin.settings';
import {Period} from 'src/domain/models/period.model';
import {PeriodUiModel} from 'src/presentation/models/period.ui-model';

export class CalendarUiModelBuilder implements UiModelBuilder<WeekUiModel[], CalendarUiModel> {
    private settings: PluginSettings | null = null;
    private selectedPeriod: Period | null = null;
    private today: Period | null = null;
    private model: WeekUiModel[] | null = null;

    constructor(
        private readonly periodBuilder: UiModelBuilder<Period, PeriodUiModel>
    ) {

    }

    public withSettings(settings: PluginSettings): void {
        this.settings = settings;
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

    public withValue(value: WeekUiModel[]): UiModelBuilder<WeekUiModel[], CalendarUiModel> {
        this.model = value;
        return this;
    }

    public dropFirstWeek(): UiModelBuilder<WeekUiModel[], CalendarUiModel> {
        if (this.model) {
            this.model = this.model?.slice(1);
        }

        return this;
    }

    public dropLastWeek(): UiModelBuilder<WeekUiModel[], CalendarUiModel> {
        if (this.model) {
            this.model = this.model?.slice(0, this.model.length - 1);
        }

        return this;
    }

    public withoutValue(): UiModelBuilder<WeekUiModel[], CalendarUiModel> {
        this.model = null;
        return this;
    }

    public async build(): Promise<CalendarUiModel> {
        const today = this.today ? await this.periodBuilder.withValue(this.today).build() : null;
        const selectedPeriod = this.selectedPeriod ? await this.periodBuilder.withValue(this.selectedPeriod).build() : null;
        const firstDayOfWeek = this.settings?.generalSettings.firstDayOfWeek;

        if (!this.model) {
            return <CalendarUiModel>{
                lastUpdateRequest: new Date(),
                today: today,
                startWeekOnMonday: firstDayOfWeek === DayOfWeek.Monday,
                selectedPeriod: selectedPeriod,
                weeks: [],
                month: undefined,
                quarter: undefined,
                year: undefined
            };
        }

        const month = this.getMiddleWeek(this.model).month;
        const quarter = this.getMiddleWeek(this.model).quarter;
        const year = this.getMiddleWeek(this.model).year;

        return <CalendarUiModel>{
            lastUpdateRequest: new Date(),
            today: today,
            startWeekOnMonday: firstDayOfWeek === DayOfWeek.Monday,
            selectedPeriod: selectedPeriod,
            weeks: this.model ? this.model : [null, null, null, null, null],
            month: month,
            quarter: quarter,
            year: year
        };
    }

    private getMiddleWeek(weeks: WeekUiModel[]): WeekUiModel {
        return weeks[Math.floor(weeks.length / 2)];
    }
}