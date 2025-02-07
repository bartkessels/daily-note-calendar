import {FileRepository} from 'src/infrastructure/contracts/file-repository';

export interface FileRepositoryFactory {
    getRepository(): FileRepository;
}