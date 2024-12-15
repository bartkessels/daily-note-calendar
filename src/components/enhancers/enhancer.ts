export interface Enhancer<T> {
    enhance(value?: T): Promise<T | undefined>;
}