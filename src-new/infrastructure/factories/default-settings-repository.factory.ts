import {SettingsRepositoryFactory, SettingsType} from 'src-new/infrastructure/contracts/settings-repository-factory';
import {SettingsRepository} from 'src-new/infrastructure/contracts/settings-repository';
import {Settings} from 'src-new/domain/settings/settings';

export class DefaultSettingsRepositoryFactory implements SettingsRepositoryFactory {
    private readonly repositories: Map<SettingsType, SettingsRepository<Settings>> = new Map();

    public register<T extends Settings>(key: SettingsType, repository: SettingsRepository<T>): DefaultSettingsRepositoryFactory {
        this.repositories.set(key, repository);
        return this;
    }

    public getRepository<T extends Settings>(key: SettingsType): SettingsRepository<T> {
        const repository = this.repositories.get(key);

        if (!repository) {
            throw new Error('No repository found for settings type');
        }

        return repository as SettingsRepository<T>;
    }
}