import { StrictMode } from 'react';
import { IconName, ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot } from 'react-dom/client';
import { CalendarComponent } from './CalendarComponent';
import { DateManager } from 'src/domain/managers/date.manager';
import { DateManagerContext } from '../Providers/datemanager.provider';
import { FileManager } from 'src/domain/managers/file.manager';
import { FileManagerContext } from '../Providers/filemanager.provider';

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    constructor(
        leaf: WorkspaceLeaf,
        private readonly dateManager: DateManager,
        private readonly fileManager: FileManager
    ) {
        super(leaf);
    }

    override getViewType(): string {
        return CalendarView.VIEW_TYPE;
    }

    override getDisplayText(): string {
        return CalendarView.DISPLAY_TEXT;
    }

    override getIcon(): IconName {
        return CalendarView.ICON_NAME;
    }

    protected override async onOpen(): Promise<void> {
        createRoot(this.containerEl.children[1]).render(
            <StrictMode>
                <DateManagerContext.Provider value={this.dateManager}>
                    <FileManagerContext.Provider value={this.fileManager}>
                        <CalendarComponent />
                    </FileManagerContext.Provider>
                </DateManagerContext.Provider>
            </StrictMode>
        );
    }
}
