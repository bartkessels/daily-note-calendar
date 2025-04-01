import {ContextMenuAdapter} from 'src/presentation/contracts/context-menu.adapter';
import {Menu} from 'obsidian';

export class ObsidianContextMenuAdapter implements ContextMenuAdapter {
    private contextMenu?: Menu;

    public show(xPosition: number, yPosition: number, callbacks: any): void {
        this.contextMenu = new Menu();
        this.addDeleteNoteMenuItem(this.contextMenu, callbacks.onDelete)
            .showAtPosition({x: xPosition, y: yPosition});
    }

    public hide(): void {
        this.contextMenu?.hide();
        delete this.contextMenu;
    }

    private addDeleteNoteMenuItem(menu: Menu, deleteCallback: () => void): any {
        return menu.addItem(menuItem => menuItem
            .setIcon('trash')
            .setTitle('Delete')
            .onClick(deleteCallback)
        );
    }
}