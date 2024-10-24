import { StrictMode } from 'react';
import { IconName, ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot } from 'react-dom/client';
import { CalendarComponent } from './CalendarComponent';
import { DateRepository } from 'src/domain/repositories/DateRepository';
import { FileService } from 'src/domain/services/FileService';
import { DateRepositoryContext } from '../Providers/DateRepositoryProvider';
import { FileServiceContext } from '../Providers/FileServiceProvider';

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    constructor(
        leaf: WorkspaceLeaf,
        private readonly dateRepository: DateRepository,
        private readonly fileService: FileService
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
                <DateRepositoryContext.Provider value={this.dateRepository}>
                    <FileServiceContext.Provider value={this.fileService}>
                        <CalendarComponent />
                    </FileServiceContext.Provider>
                </DateRepositoryContext.Provider>
            </StrictMode>
        );
    }
}
