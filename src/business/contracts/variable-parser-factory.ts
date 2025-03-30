import {VariableParser} from 'src/business/contracts/variable-parser';
import {VariableType} from 'src/domain/models/variable.model';

export interface VariableParserFactory {
    getVariableParser<T>(type: VariableType): VariableParser<T>;
}
