import {Calculus} from 'src/domain/models/variable';

declare global {
    interface String {
        appendMarkdownExtension(): string;
        removeMarkdownExtension(): string;
    }
    interface Date {
        isToday(): boolean;
        calculate(calculus?: Calculus | null): Date;
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

Date.prototype.calculate = function (calculus?: Calculus): Date {
    if (!calculus) {
        return this;
    }

    const date = new Date(this);

    if (calculus.operator === '+') {
        switch (calculus.unit) {
            case 'd':
                date.setDate(date.getDate() + calculus.value);
                break;
            case 'w':
                date.setDate(date.getDate() + (calculus.value * 7));
                break;
            case 'm':
                date.setMonth(date.getMonth() + calculus.value);
                break;
            case 'y':
                date.setFullYear(date.getFullYear() + calculus.value);
                break;
        }
    } else if (calculus.operator === '-') {
        switch (calculus.unit) {
            case 'd':
                date.setDate(date.getDate() - calculus.value);
                break;
            case 'w':
                date.setDate(date.getDate() - (calculus.value * 7));
                break;
            case 'm':
                date.setMonth(date.getMonth() - calculus.value);
                break;
            case 'y':
                date.setFullYear(date.getFullYear() - calculus.value);
                break;
        }
    }

    return date;
}

export {}