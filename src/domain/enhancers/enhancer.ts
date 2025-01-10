import {Event} from 'src/domain/events/event';
import {EnhancerStep} from 'src/domain/enhancers/enhancer-step';

export class Enhancer<T> {
    private readonly steps: EnhancerStep<T>[] = [];

    constructor(
        private readonly event: Event<T>
    ) {

    }

    public withStep(step: EnhancerStep<T>): Enhancer<T> {
        this.steps.push(step);
        return this;
    }

    public execute(value: T): void {
        this.enhance(value).then(this.event.emitEvent);
    }

    private async enhance(value: T): Promise<T | undefined> {
        return this.steps.reduce(async (value, step) => {
            return step.execute(await value);
        }, Promise.resolve(value));
    }
}