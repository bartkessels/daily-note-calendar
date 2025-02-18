import {arePeriodsEqual, Period, PeriodType} from 'src/domain/models/period.model';

describe('Period', () => {
    describe('arePeriodsEqual', () => {
        it('should return false if both periods are undefined', () => {
            // Arrange
            const periodA = undefined;
            const periodB = undefined;

            // Act
            const result = arePeriodsEqual(periodA, periodB);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false if periodA is undefined', () => {
            // Arrange
            const periodA = undefined;
            const periodB = <Period> {
                date: new Date(),
                name: '',
                type: PeriodType.Day
            };

            // Act
            const result = arePeriodsEqual(periodA, periodB);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false if periodB is undefined', () => {
            // Arrange
            const periodA = <Period> {
                date: new Date(),
                name: '',
                type: PeriodType.Day
            };
            const periodB = undefined;

            // Act
            const result = arePeriodsEqual(periodA, periodB);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false if both periods have different dates', () => {
            // Arrange
            const periodA = <Period> {
                date: new Date(2023, 9, 2),
                name: '',
                type: PeriodType.Day
            };
            const periodB = <Period> {
                date: new Date(2023, 9, 3),
                name: '',
                type: PeriodType.Day
            };

            // Act
            const result = arePeriodsEqual(periodA, periodB);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false if both periods have different types', () => {
            // Arrange
            const periodA = <Period> {
                date: new Date(2023, 9, 2),
                name: '',
                type: PeriodType.Day
            };
            const periodB = <Period> {
                date: new Date(2023, 9, 2),
                name: '',
                type: PeriodType.Week
            };

            // Act
            const result = arePeriodsEqual(periodA, periodB);

            // Assert
            expect(result).toBe(false);
        });

        it('should return true if both periods have the same date and type', () => {
            // Arrange
            const periodA = <Period> {
                date: new Date(2023, 9, 2),
                name: '',
                type: PeriodType.Day
            };
            const periodB = <Period> {
                date: new Date(2023, 9, 2),
                name: '',
                type: PeriodType.Day
            };

            // Act
            const result = arePeriodsEqual(periodA, periodB);

            // Assert
            expect(result).toBe(true);
        });
    });
});