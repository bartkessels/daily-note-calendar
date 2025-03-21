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
    private model: WeekModel[] | null = null;

    constructor(
        private readonly weekBuilder: UiModelBuilder<WeekModel, WeekUiModel>,
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

    public dropFirstWeek(): UiModelBuilder<WeekModel[], CalendarUiModel> {
        this.model?.pop();
        return this;
    }

    public dropLastWeek(): UiModelBuilder<WeekModel[], CalendarUiModel> {
        this.model?.shift();
        return this;
    }

    public withValue(value: WeekModel[]): UiModelBuilder<WeekModel[], CalendarUiModel> {
        this.model = value;
        return this;
    }

    public withoutValue(): UiModelBuilder<WeekModel[], CalendarUiModel> {
        this.model = null;
        return this;
    }

    public async build(): Promise<CalendarUiModel> {
        if (!this.settings) {
            throw new Error('Settings not set');
        }

        const today = this.today ? await this.periodBuilder.withValue(this.today).build() : null;
        const selectedPeriod = this.selectedPeriod ? await this.periodBuilder.withValue(this.selectedPeriod).build() : null;
        const startWeekOnMonday = this.settings.firstDayOfWeek === DayOfWeek.Monday;

        if (!this.model) {
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

        const weekUiModels = await Promise.all(this.model.map(async week => await this.weekBuilder.withValue(week).build()));
        const month = this.getMiddleWeek(weekUiModels).month;
        const quarter = this.getMiddleWeek(weekUiModels).quarter;
        const year = this.getMiddleWeek(weekUiModels).year;

        return <CalendarUiModel>{
            lastUpdateRequest: new Date(),
            today: today,
            startWeekOnMonday: startWeekOnMonday,
            selectedPeriod: selectedPeriod,
            weeks: weekUiModels,
            month: month,
            quarter: quarter,
            year: year
        };
    }

    private getMiddleWeek(weeks: WeekUiModel[]): WeekUiModel {
        return weeks[Math.floor(weeks.length / 2)];
    }
}