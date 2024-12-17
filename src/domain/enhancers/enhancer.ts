import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';

export class Enhancer<T> {
    protected readonly steps: EnhancerStep<T>[] = [];
    protected value?: T;

    public withValue(value: T): Enhancer<T> {
        this.value = value;
        return this;
    }

    public withStep(step: EnhancerStep<T>): Enhancer<T> {
        this.steps.push(step);
        return this;
    }

    public async build(): Promise<T | undefined> {
        if (!this.value) {
            throw new Error('Value is required');
        }

        return this.steps.reduce(async (value, step) => {
            return step.execute(await value);
        }, Promise.resolve(this.value));
    }
}