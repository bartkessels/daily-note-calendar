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

    public async create(path: string, content: string | null): Promise<string> {
        const folder = path.split('/').slice(0, -1).join('/');

        await this.adapter.createFolder(folder);
        return await this.adapter.createFile(path, content);
    }

    public async readContents(path: string): Promise<string> {
        const fileExists = await this.exists(path);

        if (!fileExists) {
            return '';
        }

        return await this.adapter.readContents(path);
    }

    public async openInCurrentTab(path: string): Promise<void> {
        const fileExists = await this.exists(path);

        if (fileExists) {
            await this.adapter.openInCurrentTab(path);
        }
    }

    public async openInHorizontalSplitView(path: string): Promise<void> {
        const fileExists = await this.exists(path);

        if (fileExists) {
            await this.adapter.openInHorizontalSplitView(path);
        }
    }

    public async openInVerticalSplitView(path: string): Promise<void> {
        const fileExists = await this.exists(path);

        if (fileExists) {
            await this.adapter.openInVerticalSplitView(path);
        }
    }

    public async delete(path: string): Promise<void> {
        const fileExists = await this.exists(path);

        if (fileExists) {
            await this.adapter.delete(path);
        }
    }
}