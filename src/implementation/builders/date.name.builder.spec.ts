import { DateNameBuilder } from './date.name.builder';
import { format } from 'date-fns';
import {join} from "path";
import '../../extensions/extensions';

describe('DateNameBuilder', () => {
    it('should build a name with the given template and date', () => {
        const builder = new DateNameBuilder();
        const template = 'yyyy-MM-dd';
        const date = new Date('2023-10-01');
        const path = '/test/path';

        const result = builder
            .withNameTemplate(template)
            .withValue(date)
            .withPath(path)
            .build();

        const expectedName = `${format(date, template)}.md`;
        const expectedPath = join(path, expectedName);

        expect(result).toBe(expectedPath);
    });

    it('should use the current date if no date is provided', () => {
        const builder = new DateNameBuilder();
        const template = 'yyyy-MM-dd';
        const path = '/test/path';

        const result = builder
            .withNameTemplate(template)
            .withPath(path)
            .build();

        const expectedName = `${format(new Date(), template)}.md`;
        const expectedPath = join(path, expectedName);

        expect(result).toBe(expectedPath);
    });

    it('should use the default template if no template is provided', () => {
        const builder = new DateNameBuilder();
        const date = new Date('2023-10-01');
        const path = '/test/path';

        const result = builder
            .withValue(date)
            .withPath(path)
            .build();

        const expectedName = `${format(date, 'yyyy-MM-dd')}.md`;
        const expectedPath = join(path, expectedName);

        expect(result).toBe(expectedPath);
    });

    it('should use an empty path if no path is provided', () => {
        const builder = new DateNameBuilder();
        const template = 'yyyy-MM-dd';
        const date = new Date('2023-10-01');

        const result = builder
            .withNameTemplate(template)
            .withValue(date)
            .build();

        const expectedName = `${format(date, template)}.md`;
        const expectedPath = join('', expectedName);

        expect(result).toBe(expectedPath);
    });
});