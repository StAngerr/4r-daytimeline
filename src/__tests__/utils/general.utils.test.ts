import { toClasses } from '../../utils/general.ts';

describe('toClasses tests', () => {
    it('should return a single class when one string is provided', () => {
        expect(toClasses('class1')).toBe('class1');
    });

    it('should return a space-separated string of classes when multiple strings are provided', () => {
        expect(toClasses('class1', 'class2', 'class3')).toBe(
            'class1 class2 class3',
        );
    });

    it('should filter out undefined values', () => {
        expect(toClasses('class1', undefined, 'class3')).toBe('class1 class3');
    });

    it('should filter out false values', () => {
        expect(toClasses('class1', false, 'class3')).toBe('class1 class3');
    });

    it('should handle a mix of strings, undefined, and boolean values', () => {
        expect(toClasses('class1', undefined, false, 'class3')).toBe(
            'class1 class3',
        );
    });

    it('should return an empty string when all values are undefined', () => {
        expect(toClasses(undefined, undefined)).toBe('');
    });

    it('should return an empty string when all values are false', () => {
        expect(toClasses(false, false)).toBe('');
    });

    it('should return an empty string when no values are provided', () => {
        expect(toClasses()).toBe('');
    });
});
