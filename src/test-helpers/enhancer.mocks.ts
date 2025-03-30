import {PeriodEnhancer} from 'src/presentation/contracts/period.enhancer';

export const mockPeriodNoteExistsPeriodEnhancer = {
    withSettings: jest.fn(),
    enhance: jest.fn(),
} as jest.Mocked<PeriodEnhancer>;