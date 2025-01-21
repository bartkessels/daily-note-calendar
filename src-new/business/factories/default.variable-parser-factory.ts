import {VariableParserFactory} from 'src-new/business/contracts/variable-parser-factory';
import {VariableParser} from 'src-new/business/contracts/variable-parser';
import {VariableType} from 'src-new/domain/models/variable.model';

export class DefaultVariableParserFactory implements VariableParserFactory {
    private readonly parsers: Map<VariableType, VariableParser<any>> = new Map();

    public register<T>(type: VariableType, parser: VariableParser<T>): void {
        this.parsers.set(type, parser);
    }

    public getVariableParser<T>(type: VariableType): VariableParser<T> {
        const parser = this.parsers.get(type);

        if (!parser) {
            throw new Error('No parser found for variable type');
        }

        return parser as VariableParser<T>;
    }
}