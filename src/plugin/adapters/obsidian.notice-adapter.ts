import {NoticeAdapter} from 'src/domain/adapters/notice.adapter';
import {Notice} from 'obsidian';

export class ObsidianNoticeAdapter implements NoticeAdapter {
    public notify(message: string): void {
        const body = new DocumentFragment();
        body.createEl("b").appendText("Daily note calendar");
        body.createEl("p").appendText(message);

        new Notice(body);
    }
}