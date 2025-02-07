import {FileAdapter} from 'src-new/infrastructure/adapters/file.adapter';
import {FileRepositoryFactory} from 'src-new/infrastructure/contracts/file-repository-factory';
import { FileRepository } from '../contracts/file-repository';
import {AdapterFileRepository} from 'src-new/infrastructure/repositories/adapter.file-repository';

export class DefaultFileRepositoryFactory implements FileRepositoryFactory {
    constructor(
        private readonly adapter: FileAdapter
    ) {

    }

    public getRepository(): FileRepository {
        return new AdapterFileRepository(this.adapter);
    }
}