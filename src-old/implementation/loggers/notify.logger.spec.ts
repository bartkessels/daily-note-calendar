import { NotifyLogger } from './notify.logger';
import { NoticeAdapter } from 'src-old/domain/adapters/notice.adapter';

describe('NotifyLogger', () => {
    let mockNoticeAdapter: NoticeAdapter;
    let logger: NotifyLogger;

    beforeEach(() => {
        mockNoticeAdapter = {
            notify: jest.fn(),
        };
        logger = new NotifyLogger(mockNoticeAdapter);
    });

    it('should call notify on the notice adapter and throw an error', () => {
        const message = 'Test error message';

        expect(() => logger.logAndThrow(message)).toThrowError(message);
        expect(mockNoticeAdapter.notify).toHaveBeenCalledWith(message);
    });
});