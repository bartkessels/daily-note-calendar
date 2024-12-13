import {VariableBuilder} from 'src/domain/builders/variable.builder';
import {Calculus, CalculusOperator, fromRegex, Variable, VariableType} from 'src/domain/models/variable';
import {Logger} from 'src/domain/loggers/logger';

export class DefaultVariableBuilder implements VariableBuilder {
    private name?: string;
    private template?: string;
    private calculus?: Calculus | null;

    private readonly typesThatRequireTemplate = [VariableType.Date, VariableType.Today];
    private readonly types = new Map<string, VariableType>()
        .set('date', VariableType.Date)
        .set('today', VariableType.Today)
        .set('title', VariableType.Title);

    public constructor(
        private readonly logger: Logger
    ) {
    }

    public fromString(value: string): VariableBuilder {
        const cleanTemplate = value.replace(/{{|}}/g, '');
        const regex = /([a-z]*)(\[[+-]\d+.])?:(.+)/;
        const [_, name, calculus, template] = regex.exec(cleanTemplate) || [];

        console.log(name, calculus, template);

        this.name = name;
        this.calculus = fromRegex(calculus);
        this.template = template;

        return this;
    }

    public build(): Variable {
        if (!this.name) {
            this.logger.logAndThrow('Could not create a variable because it has no name');
        }

        const type = this.types.get(this.name.toLowerCase());

        if (type === undefined) {
            this.logger.logAndThrow('Could not create a variable because the type is unknown');
        } else if (this.typesThatRequireTemplate.includes(type) && !this.template) {
            this.logger.logAndThrow('Could not create a variable because the template is unknown');
        }

        return <Variable>{
            name: this.name,
            template: this.template,
            calculus: this.calculus,
            type: type
        };
    }
}