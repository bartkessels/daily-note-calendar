import './extensions';

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