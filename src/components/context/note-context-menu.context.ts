import {createContext, useContext} from 'react';
import {ContextMenuAdapter} from 'src/domain/adapters/context-menu.adapter';

export const NoteContextMenuContext = createContext<ContextMenuAdapter | null>(null);
export const getNoteContextMenu = (): ContextMenuAdapter | null => {
    return useContext(NoteContextMenuContext);
}
