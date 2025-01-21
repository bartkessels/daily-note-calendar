import {VariableParser} from 'src-new/business/contracts/variable-parser';
import {VariableType} from 'src-new/domain/models/variable.model';

export interface VariableParserFactory {
    getVariableParser<T>(type: VariableType): VariableParser<T>;
}
