import { DefaultEnhancer } from 'src/implementation/enhancers/default.enhancer';
import { EnhancerStep } from 'src/domain/enhancers/enhancer-step';
import { CalendarUiModel } from 'src/components/models/calendar.ui-model';
import {WeekUiModel} from 'src/components/models/week.ui-model';
import {MonthUiModel} from 'src/components/models/month.ui-model';
import {Month} from 'src/domain/models/month';
import {Week} from 'src/domain/models/week';

describe('DefaultEnhancer', () => {
    let enhancer: DefaultEnhancer<CalendarUiModel>;
    const mockStep: jest.Mocked<EnhancerStep<CalendarUiModel>> = {
        execute: jest.fn()
    } as jest.Mocked<EnhancerStep<CalendarUiModel>>;

    beforeEach(() => {
        enhancer = new DefaultEnhancer<CalendarUiModel>();
        mockStep.execute.mockReset();
    });

    it('should return an undefined value if no value is provided and no steps are added', async () => {
        const result = await enhancer.build();

        expect(result).toBeUndefined();
    });

    it('should return an undefined value if no value is provided and steps are added', async () => {
        mockStep.execute.mockResolvedValue(undefined);

        const result = await enhancer
            .withStep(mockStep)
            .build();

        expect(result).toBeUndefined();
    });

    it('should return the initial value if no steps are added', async () => {
        const week: Week = { date: new Date(2023, 0, 1), weekNumber: '1', days: [] };
        const month: Month = { date: new Date(2023, 0), name: 'January', quarter: 1, weeks: [week] };

        const initialWeekUiModel: WeekUiModel = { week: week, days: [], hasNote: false };
        const initialMonthUiModel: MonthUiModel = { month: month, weeks: [initialWeekUiModel] };
        const initialCalendarUiModel: CalendarUiModel = { currentMonth: initialMonthUiModel, startWeekOnMonday: true };

        const result = await enhancer
            .withValue(initialCalendarUiModel)
            .build();

        expect(result).toBe(initialCalendarUiModel);
    });

    it('should execute steps in order and return the final value', async () => {
        const week: Week = { date: new Date(2023, 0, 1), weekNumber: '1', days: [] };
        const month: Month = { date: new Date(2023, 0), name: 'January', quarter: 1, weeks: [week] };

        const initialWeekUiModel: WeekUiModel = { week: week, days: [], hasNote: false };
        const initialMonthUiModel: MonthUiModel = { month: month, weeks: [initialWeekUiModel] };
        const initialCalendarUiModel: CalendarUiModel = { currentMonth: initialMonthUiModel, startWeekOnMonday: true };

        const enhancedWeekUiModel: WeekUiModel = { week: week, days: [], hasNote: true };
        const enhancedMonthUiModel: MonthUiModel = { month: month, weeks: [enhancedWeekUiModel] };
        const enhancedCalendarUiModel: CalendarUiModel = { currentMonth: enhancedMonthUiModel, startWeekOnMonday: true };

        mockStep.execute.mockResolvedValue(enhancedCalendarUiModel);

        const result = await enhancer
            .withStep(mockStep)
            .withValue(initialCalendarUiModel)
            .build();

        expect(result).toBe(enhancedCalendarUiModel);
        expect(mockStep.execute).toHaveBeenCalledTimes(1);
        expect(mockStep.execute).toHaveBeenCalledWith(initialCalendarUiModel);
    });
});