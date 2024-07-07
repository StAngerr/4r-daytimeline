import {
    isDateInRange,
    isSameDate,
    roundToEndOfTheDay,
    roundToStartOfTheDay,
} from '../../utils/time.utils.ts';

describe('isSameDate tests', () => {
    it('should return false for not same dates', () => {
        expect(
            isSameDate(
                new Date('2024-07-04T13:00:00Z'),
                new Date('2024-07-01T13:00:00Z'),
            ),
        ).toBeFalsy();
        expect(
            isSameDate(
                new Date('2024-07-04T13:00:00Z'),
                new Date('2023-07-04T13:00:00Z'),
            ),
        ).toBeFalsy();
        expect(
            isSameDate(
                new Date('2024-07-04T13:00:00Z'),
                new Date('2024-08-04T13:00:00Z'),
            ),
        ).toBeFalsy();
    });

    it('should return true in case if dates are same', () => {
        expect(
            isSameDate(
                new Date('2023-01-02T13:00:00Z'),
                new Date('2023-01-02T19:00:00Z'),
            ),
        ).toBeTruthy();
    });
});

describe('roundToEndOfTheDay tests', () => {
    it('should return value rounded to the end of the day for example date can be any but its time should be equal to 23:59', () => {
        const baseDate = new Date('2024-07-04T13:00:00Z');
        const rounded = roundToEndOfTheDay(baseDate);
        expect(rounded.getHours()).toBe(23);
        expect(rounded.getMinutes()).toBe(59);
        expect(rounded.getSeconds()).toBe(0);
        expect(rounded.getDate()).toBe(baseDate.getDate());
    });
});

describe('roundToStartOfTheDay tests', () => {
    it('should return date which has time set to begining of the day 00:01', () => {
        const baseDate = new Date('2024-07-04T13:00:00Z');
        const rounded = roundToStartOfTheDay(baseDate);

        expect(rounded.getHours()).toBe(0);
        expect(rounded.getMinutes()).toBe(1);
        expect(rounded.getSeconds()).toBe(0);
        expect(rounded.getDate()).toBe(baseDate.getDate());
    });
});

describe('isDateInRange tests', () => {
    it('should return true if date in range of two  other dates', () => {
        expect(
            isDateInRange(
                new Date('2024-07-04T13:00:00Z'),
                new Date('2024-07-01T13:00:00Z'),
                new Date('2024-07-11T13:00:00Z'),
            ),
        ).toBeTruthy();

        expect(
            isDateInRange(
                new Date('2024-07-11T13:00:00Z'),
                new Date('2024-07-11T00:00:00Z'),
                new Date('2024-07-11T14:00:00Z'),
            ),
        ).toBeTruthy();

        expect(
            isDateInRange(
                new Date('2024-07-01T13:00:00Z'),
                new Date('2024-05-11T00:00:00Z'),
                new Date('2024-12-11T14:00:00Z'),
            ),
        ).toBeTruthy();

        expect(
            isDateInRange(
                new Date('2011-07-01T13:00:00Z'),
                new Date('2005-05-11T00:00:00Z'),
                new Date('2036-12-11T14:00:00Z'),
            ),
        ).toBeTruthy();
    });

    it('should return false if date is out of range', () => {
        expect(
            isDateInRange(
                new Date('2024-07-03T13:00:00Z'),
                new Date('2024-07-04T13:00:00Z'),
                new Date('2024-07-11T13:00:00Z'),
            ),
        ).toBeFalsy();
        expect(
            isDateInRange(
                new Date('2024-07-11T12:00:00Z'),
                new Date('2024-07-11T13:00:00Z'),
                new Date('2024-07-11T15:00:00Z'),
            ),
        ).toBeFalsy();
        expect(
            isDateInRange(
                new Date('2024-02-11T12:00:00Z'),
                new Date('2024-04-11T13:00:00Z'),
                new Date('2024-07-11T15:00:00Z'),
            ),
        ).toBeFalsy();
        expect(
            isDateInRange(
                new Date('2021-12-11T12:00:00Z'),
                new Date('2022-12-11T13:00:00Z'),
                new Date('2024-12-11T15:00:00Z'),
            ),
        ).toBeFalsy();

        expect(
            isDateInRange(
                new Date('2022-05-12T12:00:00Z'),
                new Date('2022-05-09T13:00:00Z'),
                new Date('2022-05-11T15:00:00Z'),
            ),
        ).toBeFalsy();
    });
});
