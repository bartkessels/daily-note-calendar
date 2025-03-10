import {PluginSettings} from 'src/domain/settings/plugin.settings';

export interface UiModelBuilder<in T, out U> {
    withSettings(settings: PluginSettings): void;
    withValue(value: T): UiModelBuilder<T, U>;
    build(): Promise<U>;
}