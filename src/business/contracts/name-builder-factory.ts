import {NameBuilder} from 'src/business/contracts/name-builder';

export interface NameBuilderFactory {
    getNameBuilder<T>(type: NameBuilderType): NameBuilder<T>;
}

export enum NameBuilderType {
    PeriodicNote = 'periodicNote'
}