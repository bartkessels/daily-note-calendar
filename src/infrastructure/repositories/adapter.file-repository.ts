import {FileRepository} from 'src/infrastructure/contracts/file-repository';
import {FileAdapter} from 'src/infrastructure/adapters/file.adapter';

export class AdapterFileRepository implements FileRepository {
    constructor(
        private readonly adapter: FileAdapter
    ) {

    }

    public async exists(filePath: string): Promise<boolean> {
        return await this.adapter.exists(filePath);
    }

    public async create(path: string, templateFilePath?: string | null): Promise<string> {
        const folder = path.split('/').slice(0, -1).join('/');
        const doesTemplateFileExist = templateFilePath ? await this.adapter.exists(templateFilePath) : false;

        await this.adapter.createFolder(folder);
        let filePath = '';

        if (doesTemplateFileExist && templateFilePath) {
            filePath = await this.adapter.createFileFromTemplate(path, templateFilePath);
        } else {
            filePath = await this.adapter.createFile(path);
        }

        return filePath;
    }

    public async readContents(path: string): Promise<string> {
        const fileExists = await this.exists(path);

        if (!fileExists) {
            return '';
        }

        return await this.adapter.readContents(path);
    }

    public async writeContents(path: string, contents: string): Promise<void> {
        const fileExists = await this.exists(path);

        if (fileExists) {
            await this.adapter.writeContents(path, contents);
        }
    }

    public async open(path: string): Promise<void> {
        const fileExists = await this.exists(path);

        if (fileExists) {
            await this.adapter.open(path);
        }
    }

    public async delete(path: string): Promise<void> {
        const fileExists = await this.exists(path);

        if (fileExists) {
            await this.adapter.delete(path);
        }
    }
}