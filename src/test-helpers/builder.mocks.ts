import {NameBuilder} from 'src/business/contracts/name-builder';
import {Period} from 'src/domain/models/period.model';

export const mockPeriodNameBuilder = {
    withPath: jest.fn((_) => mockPeriodNameBuilder),
    withName: jest.fn((_) => mockPeriodNameBuilder),
    withValue: jest.fn((_) => mockPeriodNameBuilder),
    build: jest.fn()
} as jest.Mocked<NameBuilder<Period>>;