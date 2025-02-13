import {VariableFactory} from 'src/business/contracts/variable-factory';
import {Calculus, CalculusOperator, Variable, VariableType} from 'src/domain/models/variable.model';

export class DefaultVariableFactory implements VariableFactory {
    private readonly typesThatRequireTemplate = [VariableType.Date, VariableType.Today];
    private readonly typesThatSupportCalculus = [VariableType.Date, VariableType.Today];
    private readonly types = new Map<string, VariableType>()
        .set('date', VariableType.Date)
        .set('today', VariableType.Today)
        .set('title', VariableType.Title);

    public getVariable(value: string): Variable {
        const regex = /{{([a-z]+)([+-][0-9].)?:?(.*)?}}/;
        const [_, name, calculusValue, template] = regex.exec(value) || [];
        const type = this.types.get(name.toLowerCase());
        let calculus: Calculus | null = null;

        if (type === undefined) {
            throw Error('Could not create a variable because the type is unknown');
        } else if (this.typesThatRequireTemplate.includes(type) && !template) {
            throw Error('Could not create a variable because the template is unknown');
        }

        if (this.typesThatSupportCalculus.includes(type)) {
            calculus = this.getCalculusFromRegex(calculusValue);
        }

        return {
            template: template ?? null,
            calculus: calculus ?? null,
            type: type
        };
    }

    private getCalculusFromRegex(string: string): Calculus | null {
        const regex= /([+-])([0-9]+)([a-z])/;
        const [_, operator, value, unit] = regex.exec(string) || [];
        const parsedValue = parseInt(value);

        if (!operator || !value || !unit || isNaN(parsedValue)) {
            return null;
        }

        let calculusOperator = CalculusOperator.Add;
        if (operator === CalculusOperator.Subtract.valueOf()) {
            calculusOperator = CalculusOperator.Subtract;
        }

        return {
            unit: unit,
            operator: calculusOperator,
            value: parsedValue
        };
    }
}