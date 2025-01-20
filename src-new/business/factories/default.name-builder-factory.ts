import {NameBuilderFactory, NameBuilderType} from 'src-new/business/contracts/name-builder-factory';
import {NameBuilder} from 'src-new/business/contracts/name-builder';

export class DefaultNameBuilderFactory implements NameBuilderFactory {
    private readonly builders: Map<NameBuilderType, NameBuilder<any>> = new Map();

    public register<T>(type: NameBuilderType, builder: NameBuilder<T>): DefaultNameBuilderFactory {
        this.builders.set(type, builder);
        return this;
    }

    public getNameBuilder<T>(type: NameBuilderType): NameBuilder<T> {
        const builder = this.builders.get(type);

        if (!builder) {
            throw new Error('No builder found for name type');
        }

        return builder as NameBuilder<T>;
    }
}