import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';

export interface Enhancerold<T> {
    withValue(value: T): Enhancerold<T>;
    // withStep(step: EnhancerStep<T>): Enhancer<T>;
    build(): Promise<T | undefined>;
}
