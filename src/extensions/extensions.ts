declare global {
    interface String {
        appendMarkdownExtension(): string;
        removeMarkdownExtension(): string;
    }
    interface Date {
        isToday(): boolean;
    }
}

String.prototype.appendMarkdownExtension = function(): string {
    const extension = '.md';

    if (this.endsWith(extension)) {
        return this;
    }

    return this + extension;
};

String.prototype.removeMarkdownExtension = function(): string {
    const extension = '.md';

    if (!this.endsWith(extension)) {
        return this;
    }

    return this.replace(extension, '');
};

Date.prototype.isToday = function() {
    const today = new Date();
    return this.toDateString() === today.toDateString();
}

export {}