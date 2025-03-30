import {VariableParser} from 'src/business/contracts/variable-parser';
import {Period} from 'src/domain/models/period.model';
import {DateParser} from 'src/infrastructure/contracts/date-parser';

export const mockDateParser = {
    fromDate: jest.fn(),
    fromString: jest.fn()
} as jest.Mocked<DateParser>;

export const mockPeriodVariableParser = {
    parseVariables: jest.fn()
} as jest.Mocked<VariableParser<Period>>;

export const mockDateVariableParser = {
    parseVariables: jest.fn()
} as jest.Mocked<VariableParser<Date>>;

export const mockStringVariableParser = {
    parseVariables: jest.fn()
} as jest.Mocked<VariableParser<string>>;
