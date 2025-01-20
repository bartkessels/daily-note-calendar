export interface CreateManager<T> {
    create(value: T): Promise<void>;
}