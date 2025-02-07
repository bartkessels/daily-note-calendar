import {NoticeAdapter} from 'src-old/domain/adapters/notice.adapter';
import {Logger} from 'src-old/domain/loggers/logger';

export class NotifyLogger implements Logger {
    constructor(
        private readonly noticeAdapter: NoticeAdapter
    ) {

    }

    logAndThrow(message: string): never {
        this.noticeAdapter.notify(message);
        throw new Error(message);
    }
}