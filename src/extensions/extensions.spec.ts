import 'src/extensions/extensions';
import {Calculus, CalculusOperator} from 'src/domain/models/variable.model';

describe('String.prototype.appendMarkdownExtension', () => {
    it('should append .md if not present', () => {
        const filename = 'note';
        const result = filename.appendMarkdownExtension();
        expect(result).toBe('note.md');
    });

    it('should not append .md if already present', () => {
        const filename = 'note.md';
        const result = filename.appendMarkdownExtension();
        expect(result).toBe('note.md');
    });

    it('should handle empty strings', () => {
        const filename = '';
        const result = filename.appendMarkdownExtension();
        expect(result).toBe('.md');
    });

    it('should handle strings with different extensions', () => {
        const filename = 'note.txt';
        const result = filename.appendMarkdownExtension();
        expect(result).toBe('note.txt.md');
    });
});

describe('String.prototype.removeMarkdownExtension', () => {
    it('should remove .md if present', () => {
        const filename = 'note.md';
        const result = filename.removeMarkdownExtension();
        expect(result).toBe('note');
    });

    it('should not remove .md if not present', () => {
        const filename = 'note';
        const result = filename.removeMarkdownExtension();
        expect(result).toBe('note');
    });

    it('should handle empty strings', () => {
        const filename = '';
        const result = filename.removeMarkdownExtension();
        expect(result).toBe('');
    });

    it('should handle strings with different extensions', () => {
        const filename = 'note.txt';
        const result = filename.removeMarkdownExtension();
        expect(result).toBe('note.txt');
    });
});

describe('Date.prototype.isToday', () => {
    it('should return true for todays date', () => {
        const today = new Date();
        const result = today.isToday();
        expect(result).toBe(true);
    });

    it('should return false for a past date', () => {
        const pastDate = new Date('2000-01-01');
        const result = pastDate.isToday();
        expect(result).toBe(false);
    });

    it('should return false for a future date', () => {
        const futureDate = new Date('3000-01-01');
        const result = futureDate.isToday();
        expect(result).toBe(false);
    });
});

describe('Date.prototype.calculate', () => {
    it('should return the same date if no calculus is provided', () => {
        const date = new Date('2024-01-01');
        const result = date.calculate();
        expect(result).toEqual(date);
    });

    it('should add days correctly', () => {
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'd', value: 10};
        const result = date.calculate(calculus);
        expect(result).toEqual(new Date('2024-01-11'));
    });

    it('should subtract days correctly', () => {
        const date = new Date('2024-01-11');
        const calculus: Calculus = {operator: CalculusOperator.Subtract, unit: 'd', value: 10};
        const result = date.calculate(calculus);
        expect(result).toEqual(new Date('2024-01-01'));
    });

    it('should add weeks correctly', () => {
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'w', value: 2};
        const result = date.calculate(calculus);
        expect(result).toEqual(new Date('2024-01-15'));
    });

    it('should subtract weeks correctly', () => {
        const date = new Date('2024-01-15');
        const calculus: Calculus = {operator: CalculusOperator.Subtract, unit: 'w', value: 2};
        const result = date.calculate(calculus);
        expect(result).toEqual(new Date('2024-01-01'));
    });

    it('should add months correctly', () => {
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'm', value: 1};
        const result = date.calculate(calculus);
        expect(result).toEqual(new Date('2024-02-01'));
    });

    it('should subtract months correctly', () => {
        const date = new Date('2024-02-01');
        const calculus: Calculus = {operator: CalculusOperator.Subtract, unit: 'm', value: 1};
        const result = date.calculate(calculus);
        expect(result).toEqual(new Date('2024-01-01'));
    });

    it('should add years correctly', () => {
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'y', value: 1};
        const result = date.calculate(calculus);
        expect(result).toEqual(new Date('2025-01-01'));
    });

    it('should subtract years correctly', () => {
        const date = new Date('2025-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Subtract, unit: 'y', value: 1};
        const result = date.calculate(calculus);
        expect(result).toEqual(new Date('2024-01-01'));
    });

    it('should handle invalid calculus operator', () => {
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: 'x' as CalculusOperator, unit: 'd', value: 10};
        const result = date.calculate(calculus);
        expect(result).toEqual(date);
    });

    it('should handle invalid calculus unit', () => {
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'x' as 'd', value: 10};
        const result = date.calculate(calculus);
        expect(result).toEqual(date);
    });
});