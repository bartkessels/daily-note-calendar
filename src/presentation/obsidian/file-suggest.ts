import {AbstractInputSuggest, App, TFile} from 'obsidian';

export class FileSuggest extends AbstractInputSuggest<TFile> {
    constructor(
        app: App,
        inputEl: HTMLInputElement,
        private readonly onSelectCallback: (file: TFile) => void
    ) {
        super(app, inputEl);
        this.limit = 20;
    }

    getSuggestions(query: string): TFile[] {
        const files = this.app.vault.getMarkdownFiles();
        const lowerQuery = query.toLowerCase();

        return files
            .filter(file => {
                const pathWithoutExt = file.path.replace(/\.md$/, '');
                return pathWithoutExt.toLowerCase().includes(lowerQuery);
            })
            .sort((a, b) => {
                const aPath = a.path.toLowerCase();
                const bPath = b.path.toLowerCase();
                const aStartsWith = aPath.startsWith(lowerQuery);
                const bStartsWith = bPath.startsWith(lowerQuery);

                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.path.length - b.path.length;
            });
    }

    renderSuggestion(file: TFile, el: HTMLElement): void {
        el.setText(file.path.replace(/\.md$/, ''));
    }

    selectSuggestion(file: TFile, _evt: MouseEvent | KeyboardEvent): void {
        const pathWithoutExt = file.path.replace(/\.md$/, '');
        this.setValue(pathWithoutExt);
        this.onSelectCallback(file);
        this.close();
    }
}
