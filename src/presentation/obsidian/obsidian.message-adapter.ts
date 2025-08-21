import { Notice } from 'obsidian';
import {MessageAdapter} from 'src/presentation/adapters/message.adapter';

export class ObsidianMessageAdapter implements MessageAdapter {
    private readonly duration = 5000; // Default duration in milliseconds

    public show(message: string): void {
        new Notice(message, this.duration);
    }
}