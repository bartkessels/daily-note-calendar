export interface NameBuilder<T> {
    withPath(template: string): NameBuilder<T>;
    withName(template: string): NameBuilder<T>;
    withValue(value: T): NameBuilder<T>;
    build(): string;
}