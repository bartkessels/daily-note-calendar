declare global {
    interface String {
        appendMarkdownExtension(): string;
    }
}

String.prototype.appendMarkdownExtension = function() {
    const extension = '.md';

    if (this.endsWith(extension)) {
        return this;
    }

    return this + extension;
};

export {}