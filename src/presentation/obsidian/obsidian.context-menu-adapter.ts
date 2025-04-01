import {ContextMenuAdapter, ContextMenuCallbacks} from 'src/presentation/adapters/context-menu.adapter';
import {Menu} from 'obsidian';

export class ObsidianContextMenuAdapter implements ContextMenuAdapter {
    private contextMenu?: Menu;

    public show(xPosition: number, yPosition: number, callbacks: ContextMenuCallbacks): void {
        this.contextMenu = new Menu();
        this
            .addOpenInHorizontalSplitViewMenuItem(this.contextMenu, callbacks.openInHorizontalSplitView)
            .addOpenInVerticalSplitViewMenuItem(this.contextMenu, callbacks.openInVerticalSplitView)
            .addDeleteNoteMenuItem(this.contextMenu, callbacks.onDelete)
            .build(this.contextMenu)
            .showAtPosition({x: xPosition, y: yPosition});
    }

    public hide(): void {
        this.contextMenu?.hide();
        delete this.contextMenu;
    }

    private addOpenInHorizontalSplitViewMenuItem(menu: Menu, callback: () => void): ObsidianContextMenuAdapter {
        menu.addItem(menuItem => menuItem
            .setIcon('rows-2')
            .setTitle('Open in horizontal split view')
            .onClick(callback)
        );

        return this;
    }

    private addOpenInVerticalSplitViewMenuItem(menu: Menu, callback: () => void): ObsidianContextMenuAdapter {
        menu.addItem(menuItem => menuItem
            .setIcon('columns-2')
            .setTitle('Open in vertical split view')
            .onClick(callback)
        );

        return this;
    }

    private addDeleteNoteMenuItem(menu: Menu, deleteCallback: () => void): ObsidianContextMenuAdapter {
        menu.addItem(menuItem => menuItem
            .setIcon('trash')
            .setTitle('Delete')
            .onClick(deleteCallback)
        );

        return this;
    }

    private build(menu: Menu): Menu {
        return menu;
    }
}