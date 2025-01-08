import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';
import {Enhancerold} from 'src/domain/enhancers/enhancerold';

export class DefaultEnhancer<T> implements Enhancerold<T> {
    protected readonly steps: EnhancerStep<T>[] = [];
    protected value?: T;

    public withValue(value: T): Enhancerold<T> {
        this.value = value;
        return this;
    }

    public withStep(step: EnhancerStep<T>): DefaultEnhancer<T> {
        this.steps.push(step);
        return this;
    }

    public async build(): Promise<T | undefined> {
        return this.steps.reduce(async (value, step) => {
            return step.execute(await value);
        }, Promise.resolve(this.value));
    }
}