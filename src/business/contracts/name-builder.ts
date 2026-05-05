import {DayOfWeek} from 'src/domain/models/week';

export interface NameBuilder<T> {
    withPath(template: string): NameBuilder<T>;
    withName(template: string): NameBuilder<T>;
    withValue(value: T): NameBuilder<T>;
    withWeekStartsOn(day: DayOfWeek): NameBuilder<T>;
    build(): string;
}