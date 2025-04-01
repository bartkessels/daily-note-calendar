import {ContextMenuAdapter} from 'src/presentation/adapters/context-menu.adapter';

export const mockContextMenuAdapter = {
    show: jest.fn(),
    hide: jest.fn()
} as jest.Mocked<ContextMenuAdapter>;