import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MonthComponent } from './month.component';
import { MonthUiModel } from 'src/components/month.ui-model';
import { WeekComponent } from 'src/components/calendar/week.component';
import {Month} from 'src/domain/models/month';

jest.mock('src/components/calendar/week.component');

describe('MonthComponent', () => {
    let month: Month;
    let uiModel: MonthUiModel;

    // const mockWeekComponent = WeekComponent as jest.MockedFunction<typeof WeekComponent>;

    beforeEach(() => {
        month = {
            date: new Date(2023, 9),
            name: 'October',
            quarter: 4,
            weeks: [
                {
                    date: new Date(2023, 9, 1),
                    weekNumber: 40,
                    days: [
                        { dayOfWeek: 1, date: new Date(2023, 9, 2), name: '2' },
                        { dayOfWeek: 2, date: new Date(2023, 9, 3), name: '3' },
                        { dayOfWeek: 3, date: new Date(2023, 9, 4), name: '4' },
                        { dayOfWeek: 4, date: new Date(2023, 9, 5), name: '5' },
                        { dayOfWeek: 5, date: new Date(2023, 9, 6), name: '6' },
                        { dayOfWeek: 6, date: new Date(2023, 9, 7), name: '7' },
                    ]
                }
            ]
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with weeks', () => {
        const month: MonthUiModel = {
            month: { name: 'December' },
            weeks: [
                { index: 1, days: [] },
                { index: 2, days: [] }
            ]
        };

        render(<MonthComponent month={month} />);

        expect(screen.getByText('Week 1')).toBeInTheDocument();
        expect(screen.getByText('Week 2')).toBeInTheDocument();
    });

    it('renders nothing if no month is provided', () => {
        const { container } = render(<MonthComponent month={undefined} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing if month has no weeks', () => {
        const month: MonthUiModel = {
            month: { name: 'December' },
            weeks: []
        };

        const { container } = render(<MonthComponent month={month} />);
        expect(container).toBeEmptyDOMElement();
    });
});

function setupContent(month: MonthUiModel) {
    return <MonthComponent month={month} />;
}