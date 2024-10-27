export interface NameBuilder<T> {
    withNameTemplate(template: string): NameBuilder<T>;
    withValue(value: T): NameBuilder<T>;
    withPath(path: string): NameBuilder<T>;
    build(): string
}