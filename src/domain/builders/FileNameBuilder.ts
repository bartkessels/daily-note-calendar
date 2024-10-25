export interface FileNameBuilder<T> {
    withNameTemplate(template: string): FileNameBuilder<T>;
    withValue(value: T): FileNameBuilder<T>;
    withPath(path: string): FileNameBuilder<T>;
    build(): string
}