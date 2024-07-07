import { buildTimeLabel, hoursLeadingZero } from '../../utils/format.utils.ts';

describe('hoursLeadingZero __tests__', () => {
    it('should add leading zeros properly', () => {
        expect(hoursLeadingZero(8)).toBe('08');
        expect(hoursLeadingZero(11)).toBe(11);
        expect(hoursLeadingZero(0)).toBe('00');
        expect(hoursLeadingZero(23)).toBe(23);
    });
});

describe('buildTimeLabel tests', () => {
    it('should return correct time label', () => {
        expect(buildTimeLabel(10, 43)).toBe('10:43');
        expect(buildTimeLabel(7, 5)).toBe('07:05');
        expect(buildTimeLabel(23, 15)).toBe('23:15');
        expect(buildTimeLabel(10, 1)).toBe('10:01');
        expect(buildTimeLabel(3, 59)).toBe('03:59');
    });
    it('should should work with one argument and properly parse it', () => {
        expect(buildTimeLabel(7.25)).toBe('07:15');
        expect(buildTimeLabel(17.08)).toBe('17:05');
        expect(buildTimeLabel(0.75)).toBe('00:45');
    });
});
