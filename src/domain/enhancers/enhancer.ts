import {Event} from 'src/domain/events/event';

export abstract class Enhancer<T> {
    protected constructor(
        private readonly event: Event<T>
    ) {

    }

    public async execute(value: T): Promise<void> {
        this.enhance(value).then(this.event.emitEvent);
    }

    protected abstract enhance(value: T): Promise<T>;
}