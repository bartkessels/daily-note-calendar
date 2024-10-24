import { StrictMode } from 'react';
import { IconName, ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from 'react-dom/client';
import { CalendarUi } from './CalendarUi';
import { DateRepository } from 'src/domain/repositories/DateRepository';
import { FileService } from 'src/domain/services/FileService';

export class CalendarView extends ItemView {
    public static VIEW_TYPE = 'daily-note-calendar';
    private static DISPLAY_TEXT = 'Daily note calendar';
    private static ICON_NAME = 'calendar';

    private root?: Root

    constructor(
        readonly leaf: WorkspaceLeaf,
        private readonly fileService: FileService,
        private readonly dateRepository: DateRepository
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
        const month = this.dateRepository.getCurrentMonth();
        const year = this.dateRepository.getCurrentYear();
                
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
            <StrictMode>
                <CalendarUi
                    year={year}
                    month={month}
                    onDateClicked={(date) => this.openDailyNote(date)}
                    onWeekClicked={(date) => this.openWeeklyNote(date)} />
            </StrictMode>
        );
    }

    private async openDailyNote(date?: Date): Promise<void> {
        if (!date) {
            return;
        }

        await this.fileService.tryOpenDailyNote(date);
    }

    private async openWeeklyNote(date?: Date): Promise<void> {
        if (!date) {
            return;
        }

        await this.fileService.tryOpenWeeklyNote(date);
    }
}
