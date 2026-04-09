import 'src/extensions/extensions';
import {Calculus, CalculusOperator} from 'src/domain/models/variable.model';

describe('String.prototype.appendMarkdownExtension', () => {
    it('should append .md if not present', () => {
        // Arrange
        const filename = 'note';
        
        // Act
        const result = filename.appendMarkdownExtension();
        
        // Assert
        expect(result).toBe('note.md');
    });

    it('should not append .md if already present', () => {
        // Arrange
        const filename = 'note.md';
        
        // Act
        const result = filename.appendMarkdownExtension();
        
        // Assert
        expect(result).toBe('note.md');
    });

    it('should handle empty strings', () => {
        // Arrange
        const filename = '';
        
        // Act
        const result = filename.appendMarkdownExtension();
        
        // Assert
        expect(result).toBe('.md');
    });

    it('should handle strings with different extensions', () => {
        // Arrange
        const filename = 'note.txt';
        
        // Act
        const result = filename.appendMarkdownExtension();
        
        // Assert
        expect(result).toBe('note.txt.md');
    });
});

describe('String.prototype.removeMarkdownExtension', () => {
    it('should remove .md if present', () => {
        // Arrange
        const filename = 'note.md';
        
        // Act
        const result = filename.removeMarkdownExtension();
        
        // Assert
        expect(result).toBe('note');
    });

    it('should not remove .md if not present', () => {
        // Arrange
        const filename = 'note';
        
        // Act
        const result = filename.removeMarkdownExtension();
        
        // Assert
        expect(result).toBe('note');
    });

    it('should handle empty strings', () => {
        // Arrange
        const filename = '';
        
        // Act
        const result = filename.removeMarkdownExtension();
        
        // Assert
        expect(result).toBe('');
    });

    it('should handle strings with different extensions', () => {
        // Arrange
        const filename = 'note.txt';
        
        // Act
        const result = filename.removeMarkdownExtension();
        
        // Assert
        expect(result).toBe('note.txt');
    });
});

describe('Date.prototype.calculate', () => {
    it('should return the same date if no calculus is provided', () => {
        // Arrange
        const date = new Date('2024-01-01');
        
        // Act
        const result = date.calculate();
        
        // Assert
        expect(result).toEqual(date);
    });

    it('should add days correctly', () => {
        // Arrange
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'd', value: 10};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(new Date('2024-01-11'));
    });

    it('should subtract days correctly', () => {
        // Arrange
        const date = new Date('2024-01-11');
        const calculus: Calculus = {operator: CalculusOperator.Subtract, unit: 'd', value: 10};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(new Date('2024-01-01'));
    });

    it('should add weeks correctly', () => {
        // Arrange
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'w', value: 2};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(new Date('2024-01-15'));
    });

    it('should subtract weeks correctly', () => {
        // Arrange
        const date = new Date('2024-01-15');
        const calculus: Calculus = {operator: CalculusOperator.Subtract, unit: 'w', value: 2};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(new Date('2024-01-01'));
    });

    it('should add months correctly', () => {
        // Arrange
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'm', value: 1};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(new Date('2024-02-01'));
    });

    it('should subtract months correctly', () => {
        // Arrange
        const date = new Date('2024-02-01');
        const calculus: Calculus = {operator: CalculusOperator.Subtract, unit: 'm', value: 1};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(new Date('2024-01-01'));
    });

    it('should add years correctly', () => {
        // Arrange
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'y', value: 1};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(new Date('2025-01-01'));
    });

    it('should subtract years correctly', () => {
        // Arrange
        const date = new Date('2025-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Subtract, unit: 'y', value: 1};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(new Date('2024-01-01'));
    });

    it('should handle invalid calculus operator', () => {
        // Arrange
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: 'x' as CalculusOperator, unit: 'd', value: 10};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(date);
    });

    it('should handle invalid calculus unit', () => {
        // Arrange
        const date = new Date('2024-01-01');
        const calculus: Calculus = {operator: CalculusOperator.Add, unit: 'x' as 'd', value: 10};
        
        // Act
        const result = date.calculate(calculus);
        
        // Assert
        expect(result).toEqual(date);
    });
});