export interface EnhancerStep<T> {
    execute(value?: T): Promise<T | undefined>;
}