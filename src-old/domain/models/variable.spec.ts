import { fromRegex, Calculus, CalculusOperator } from 'src-old/domain/models/variable';

describe('fromRegex', () => {
    it('should return a Calculus object for a valid string with addition', () => {
        const result = fromRegex('+10d');
        expect(result).toEqual({
            unit: 'd',
            operator: CalculusOperator.Add,
            value: 10
        } as Calculus);
    });

    it('should return a Calculus object for a valid string with subtraction', () => {
        const result = fromRegex('-5m');
        expect(result).toEqual({
            unit: 'm',
            operator: CalculusOperator.Subtract,
            value: 5
        } as Calculus);
    });

    it('should return null for an invalid string', () => {
        const result = fromRegex('10d');
        expect(result).toBeNull();
    });

    it('should return null for a string with missing unit', () => {
        const result = fromRegex('+10');
        expect(result).toBeNull();
    });

    it('should return null for a string with missing operator', () => {
        const result = fromRegex('10d');
        expect(result).toBeNull();
    });

    it('should return null for a string with missing value', () => {
        const result = fromRegex('+d');
        expect(result).toBeNull();
    });
});