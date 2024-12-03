import {Event} from 'src/domain/events/event';
import {FileService} from 'src/domain/services/file.service';

export abstract class Pipeline<T> {
    private readonly preCreateSteps: PreCreateStep<T>[] = [];
    private readonly postCreateSteps: PostCreateStep<T>[] = [];

    protected constructor(
        event: Event<T>,
        protected readonly fileService: FileService
    ) {
        event.onEvent('pipeline', value => this.process(value));
    }

    public registerPreCreateStep(step: PreCreateStep<T>): Pipeline<T> {
        this.preCreateSteps.push(step);
        return this;
    }

    public registerPostCreateStep(step: PostCreateStep<T>): Pipeline<T> {
        this.postCreateSteps.push(step);
        return this;
    }

    protected abstract getFilePath(value: T): Promise<string>;
    protected abstract createFile(filePath: string): Promise<void>;

    public async process(value: T): Promise<void> {
        const filePath = await this.getFilePath(value);
        const doesFileExist = await this.fileService.doesFileExist(filePath);

        if (!doesFileExist) {
            await Promise.all(this.preCreateSteps.map(async step => await step.executePreCreate(value)))
            await this.createFile(filePath);
            await Promise.all(this.postCreateSteps.map(async step => await step.executePostCreate(filePath, value)));
        }

        await this.fileService.tryOpenFile(filePath);
    }
}

export interface PreCreateStep<T> {
    executePreCreate(value: T): Promise<void>;
}
export interface PostCreateStep<T> {
    executePostCreate(filePath: string, value: T): Promise<void>;
}
