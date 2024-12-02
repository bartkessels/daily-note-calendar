export class VariableProcessor {
    process(template: string, variables: { [key: string]: string }): string {
        let result = template;
        for (const key in variables) {
            if (variables.hasOwnProperty(key)) {
                const value = variables[key];
                result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
        }
        return result;
    }
}