import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';

export interface Enhancer<T> {
    withValue(value: T): Enhancer<T>;
    // withStep(step: EnhancerStep<T>): Enhancer<T>;
    build(): Promise<T | undefined>;
}
