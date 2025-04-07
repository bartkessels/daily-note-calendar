import {Period} from 'src/domain/models/period.model';
import {Calculus, CalculusOperator} from 'src/domain/models/variable.model';

declare global {
    interface String {
        appendMarkdownExtension(): string;
        removeMarkdownExtension(): string;
    }
    interface Date {
        isSameMonth(other: Period | null): boolean;
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

Date.prototype.isSameMonth = function(other: Period | null): boolean {
    if (!other) {
        return false;
    }

    return this.getMonth() === other.date.getMonth() && this.getFullYear() === other.date.getFullYear();
}

Date.prototype.calculate = function (calculus?: Calculus): Date {
    if (!calculus) {
        return this;
    }

    const date = new Date(this);

    switch (calculus.operator) {
        case CalculusOperator.Add: switch (calculus.unit) {
            case 'd': date.setDate(date.getDate() + calculus.value); break;
            case 'w': date.setDate(date.getDate() + (calculus.value * 7)); break;
            case 'm': date.setMonth(date.getMonth() + calculus.value); break;
            case 'y': date.setFullYear(date.getFullYear() + calculus.value); break;
        }
        break;
        case CalculusOperator.Subtract: switch (calculus.unit) {
            case 'd': date.setDate(date.getDate() - calculus.value); break;
            case 'w': date.setDate(date.getDate() - (calculus.value * 7)); break;
            case 'm': date.setMonth(date.getMonth() - calculus.value); break;
            case 'y': date.setFullYear(date.getFullYear() - calculus.value); break;
        }
        break;
    }

    return date;
};

export {}