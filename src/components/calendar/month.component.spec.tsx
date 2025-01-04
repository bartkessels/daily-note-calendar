import React, {ReactElement} from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MonthComponent } from './month.component';
import {createMonthUiModel, MonthUiModel} from 'src/components/models/month.ui-model';
import {Month} from 'src/domain/models/month';
import 'src/extensions/extensions';

describe('MonthComponent', () => {
    let month: Month;
    let uiModel: MonthUiModel;

    beforeEach(() => {
        month = {
            date: new Date(2023, 9),
            name: 'October',
            quarter: {
                date: new Date(2023),
                quarter: 3,
                year: 2023
            },
            weeks: [
                {
                    date: new Date(2023, 9, 1),
                    weekNumber: '40',
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
        };
        uiModel = createMonthUiModel(month);
    });

    it('displays all weeks of the month', () => {
        render(setupContent(uiModel));

        expect(screen.getByText('40')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
    });
});

function setupContent(month: MonthUiModel): ReactElement {
    return (
        <table>
            <tbody>
                <MonthComponent month={month} />
            </tbody>
        </table>
    );
}