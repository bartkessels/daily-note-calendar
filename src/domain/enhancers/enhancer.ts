export interface Enhancer<T> {
    enhance(entity: T): Promise<T>;
}