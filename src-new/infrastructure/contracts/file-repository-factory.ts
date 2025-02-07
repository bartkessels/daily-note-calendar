import {FileRepository} from 'src-new/infrastructure/contracts/file-repository';

export interface FileRepositoryFactory {
    getRepository(): FileRepository;
}