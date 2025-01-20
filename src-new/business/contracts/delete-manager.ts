export interface DeleteManager<T> {
    delete(value: T): Promise<void>;
}