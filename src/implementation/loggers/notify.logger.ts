import {NoticeAdapter} from 'src/domain/adapters/notice.adapter';
import {Logger} from 'src/domain/loggers/logger';

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