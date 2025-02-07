import {ContextMenuAdapter, ContextMenuCallbacks} from 'src-old/domain/adapters/context-menu.adapter';
import {Menu, MenuItem} from 'obsidian';

export class NoteContextMenuAdapter implements ContextMenuAdapter {
    private contextMenu?: Menu;

    public show(xPosition: number, yPosition: number, callbacks: ContextMenuCallbacks): void {
        this.contextMenu = new Menu();
        this.addDeleteNoteMenuItem(this.contextMenu, callbacks.onDelete)
            .showAtPosition({x: xPosition, y: yPosition});
    }

    public hide(): void {
        this.contextMenu?.hide();
        delete this.contextMenu;
    }

    private addDeleteNoteMenuItem(menu: Menu, deleteCallback: () => void): Menu {
        return menu.addItem((menuItem: MenuItem) => menuItem
            .setIcon('trash')
            .setTitle('Delete')
            .onClick(deleteCallback)
        );
    }
}