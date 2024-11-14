import 'src/extensions/extensions';

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