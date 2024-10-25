declare global {
    interface String {
        appendMarkdownExtension(): string;
    }
    interface Date {
        isToday(): boolean;
    }
}

String.prototype.appendMarkdownExtension = function() {
    const extension = '.md';

    if (this.endsWith(extension)) {
        return this;
    }

    return this + extension;
};

Date.prototype.isToday = function() {
    const today = new Date();
    return this.toDateString() === today.toDateString();
}

export {}