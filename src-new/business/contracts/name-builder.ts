export interface NameBuilder<T> {
    withPath(path: string, template: string | undefined): NameBuilder<T>;
    withValue(value: T, template: string | undefined): NameBuilder<T>;
    build(): string;
}