export interface OpenManager<T> {
    open(value: T): Promise<void>;
}