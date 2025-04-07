import {createContext, useContext} from 'react';
import {ContextMenuAdapter} from 'src/presentation/adapters/context-menu.adapter';

export const ContextMenuAdapterContext = createContext<ContextMenuAdapter | null>(null);
export const getContextMenuAdapter = (): ContextMenuAdapter | null => {
    return useContext(ContextMenuAdapterContext);
};