import {
    addIntervalToHourRange,
    calculateCurrentTimeTop,
    datePeriodToValuePeriod,
    getHourRange,
    minutesToTimeValue,
    parseDefaultPeriod,
    parseMinutesAndToTimeValue,
    roundToInterval,
    timeStringToTimeValue,
    timeValuesToDatePeriod,
    timeValueToBottomPosition,
    timeValueToTimeUnits,
    timeValueToTopPosition,
} from '../../utils/period.utils.ts';

describe('period utils tests', () => {
    describe('minutesToTimeValue tests', () => {
        it('should return correct values', () => {
            expect(minutesToTimeValue(60)).toBe(1);
            expect(minutesToTimeValue(120)).toBe(2);
            expect(minutesToTimeValue(30)).toBe(0.5);
            expect(minutesToTimeValue(90)).toBe(1.5);
            expect(minutesToTimeValue(15)).toBe(0.25);
            expect(minutesToTimeValue(10)).toBe(0.16666666666666666);
        });
    });

    describe('timeValueToTopPosition tests', () => {
        it('should return correct top position for time value', () => {
            expect(timeValueToTopPosition(17, 15, 60)).toBe('255px');
            expect(timeValueToTopPosition(17, 15, 30)).toBe('510px');
            expect(timeValueToTopPosition(0, 15, 30)).toBe('0px');
            expect(timeValueToTopPosition(5, 10, 120)).toBe('25px');
        });
    });

    describe('timeValueToBottomPosition tests', () => {
        it('should return correct bottom position for time value', () => {
            expect(timeValueToBottomPosition(24 - 24, 15, 60)).toBe('0px');
            expect(timeValueToBottomPosition(24 - 21, 25, 60)).toBe('75px');
            expect(timeValueToBottomPosition(24 - 17.5, 40, 30)).toBe('520px');
        });
    });
    describe('roundToInterval tests', () => {
        it('should round to the nearest interval of 1 hour', () => {
            expect(roundToInterval(15, 60)).toBe(15);
            expect(roundToInterval(14.6, 60)).toBe(15);
            expect(roundToInterval(14.4, 60)).toBe(14);
        });
        it('should round to the nearest interval of 30 hour', () => {
            expect(roundToInterval(1.5, 30)).toBe(1.5);
            expect(roundToInterval(3.6, 30)).toBe(3.5);
            expect(roundToInterval(3.8, 30)).toBe(4);
            expect(roundToInterval(21.2, 30)).toBe(21);
        });
        it('should round to the nearest interval of 15 minutes', () => {
            expect(roundToInterval(11.25, 15)).toBe(11.25);
            expect(roundToInterval(13.1, 15)).toBe(13);
            expect(roundToInterval(13.75, 15)).toBe(13.75);
        });
    });
    describe('timeValueToMinutes tests', () => {
        it('should return properly convert to time minute', () => {
            expect(timeValueToTimeUnits(11.5)).toEqual([11, 30]);
            expect(timeValueToTimeUnits(1.75)).toEqual([1, 45]);
            expect(timeValueToTimeUnits(21.25)).toEqual([21, 15]);
            expect(timeValueToTimeUnits(15.16666)).toEqual([15, 10]);
        });
    });
    describe('parseStringMinutes tests', () => {
        it('should preperly parse time string and return minutes for 15 min interval ', () => {
            expect(parseMinutesAndToTimeValue('15', 15)).toEqual(0.25);
            expect(parseMinutesAndToTimeValue('35', 15)).toEqual(0.5);
            expect(parseMinutesAndToTimeValue('27', 15)).toEqual(0.5);
            expect(parseMinutesAndToTimeValue('27', 15)).toEqual(0.5);
            expect(parseMinutesAndToTimeValue('03', 15)).toEqual(0);
            expect(parseMinutesAndToTimeValue('47', 15)).toEqual(0.75);
            expect(parseMinutesAndToTimeValue('59', 15)).toEqual(1);
        });

        it('should preperly parse time string and return minutes for 30 min interval ', () => {
            expect(parseMinutesAndToTimeValue('15', 30)).toEqual(0.5);
            expect(parseMinutesAndToTimeValue('35', 30)).toEqual(0.5);
            expect(parseMinutesAndToTimeValue('27', 30)).toEqual(0.5);
            expect(parseMinutesAndToTimeValue('27', 30)).toEqual(0.5);
            expect(parseMinutesAndToTimeValue('03', 30)).toEqual(0);
            expect(parseMinutesAndToTimeValue('22', 30)).toEqual(0.5);
            expect(parseMinutesAndToTimeValue('47', 30)).toEqual(1);
            expect(parseMinutesAndToTimeValue('59', 30)).toEqual(1);
        });
        it('should preperly parse time string and return minutes for 60 min interval ', () => {
            expect(parseMinutesAndToTimeValue('15', 60)).toEqual(0);
            expect(parseMinutesAndToTimeValue('35', 60)).toEqual(1);
            expect(parseMinutesAndToTimeValue('27', 60)).toEqual(0);
            expect(parseMinutesAndToTimeValue('27', 60)).toEqual(0);
            expect(parseMinutesAndToTimeValue('03', 60)).toEqual(0);
            expect(parseMinutesAndToTimeValue('47', 60)).toEqual(1);
            expect(parseMinutesAndToTimeValue('59', 60)).toEqual(1);
        });
    });
    describe('timeStringToTimeValue tests', () => {
        it('should return correct time value for interval 30', () => {
            expect(timeStringToTimeValue('10:30', 30)).toBe(10.5);
            expect(timeStringToTimeValue('01:30', 30)).toBe(1.5);
            expect(timeStringToTimeValue('21:00', 30)).toBe(21);
            expect(timeStringToTimeValue('21:11', 30)).toBe(21);
            expect(timeStringToTimeValue('21:25', 30)).toBe(21.5);
            expect(timeStringToTimeValue('00:25', 30)).toBe(0.5);
            expect(timeStringToTimeValue('00:05', 30)).toBe(0);
        });
        it('should return correct time value for interval 60', () => {
            expect(timeStringToTimeValue('10:30', 60)).toBe(11);
            expect(timeStringToTimeValue('01:30', 60)).toBe(2);
            expect(timeStringToTimeValue('21:55', 60)).toBe(22);
            expect(timeStringToTimeValue('21:45', 60)).toBe(22);
            expect(timeStringToTimeValue('21:25', 60)).toBe(21);
            expect(timeStringToTimeValue('00:25', 60)).toBe(0);
            expect(timeStringToTimeValue('00:05', 60)).toBe(0);
        });
        it('should return correct time value for interval 15', () => {
            expect(timeStringToTimeValue('10:30', 15)).toBe(10.5);
            expect(timeStringToTimeValue('10:22', 15)).toBe(10.25);
            expect(timeStringToTimeValue('10:11', 15)).toBe(10.25);
            expect(timeStringToTimeValue('01:35', 15)).toBe(1.5);
            expect(timeStringToTimeValue('01:55', 15)).toBe(2);
        });
    });

    describe('parseDefaultPeriod tests', () => {
        it('should return null if there if no argument', () => {
            expect(parseDefaultPeriod()).toBeNull();
            expect(parseDefaultPeriod(null)).toBeNull();
            expect(parseDefaultPeriod(false)).toBeNull();
        });
        it('should return parse default periods interval 30, as tuple', () => {
            expect(parseDefaultPeriod([1, 5], 30)).toEqual({
                start: 1,
                end: 5,
            });
            expect(parseDefaultPeriod([1.45, 5.3], 30)).toEqual({
                start: 1.5,
                end: 5.5,
            });
            expect(parseDefaultPeriod([0.25, 5.8], 30)).toEqual({
                start: 0.5,
                end: 6,
            });
        });
        it('should return parse default periods interval 60, as tuple', () => {
            expect(parseDefaultPeriod([1, 5], 60)).toEqual({
                start: 1,
                end: 5,
            });
            expect(parseDefaultPeriod([1.35, 5.77], 60)).toEqual({
                start: 1,
                end: 6,
            });
            expect(parseDefaultPeriod([0.25, 15.8], 60)).toEqual({
                start: 0,
                end: 16,
            });
        });

        it('should return null in case if tuple is invalid', () => {
            expect(parseDefaultPeriod([33, 15.8], 30)).toBeNull();
            expect(parseDefaultPeriod([19, 1], 30)).toBeNull();
            expect(parseDefaultPeriod(['1', '3'], 30)).toBeNull();
            expect(parseDefaultPeriod([1, '3'], 30)).toBeNull();
            expect(parseDefaultPeriod(['1', 3], 30)).toBeNull();
        });

        it('should return parse default periods interval 60, as tuple', () => {
            expect(parseDefaultPeriod(['01:20', '03:45'], 60)).toEqual({
                start: 1,
                end: 4,
            });
            expect(parseDefaultPeriod(['01:30', '17:13'], 60)).toEqual({
                start: 2,
                end: 17,
            });
            expect(parseDefaultPeriod(['15:15', '15:15'], 60)).toEqual({
                start: 15,
                end: 15,
            });
        });

        it('should return parse default periods interval 30, as tuple', () => {
            expect(parseDefaultPeriod(['01:25', '03:45'], 30)).toEqual({
                start: 1.5,
                end: 4,
            });
            expect(parseDefaultPeriod(['01:25', '17:13'], 30)).toEqual({
                start: 1.5,
                end: 17,
            });
            expect(parseDefaultPeriod(['15:15', '15:15'], 30)).toEqual({
                start: 15.5,
                end: 15.5,
            });
            expect(parseDefaultPeriod(['15:45', '18:55'], 30)).toEqual({
                start: 16,
                end: 19,
            });
        });

        it('should return null in case of incorrect strings', () => {
            expect(parseDefaultPeriod(['sdada', 'sada:55'], 60)).toBeNull();
            expect(parseDefaultPeriod(['111:1223', '11:1234'], 60)).toBeNull();
            expect(parseDefaultPeriod(['11-10', '11:88'], 60)).toBeNull();
        });

        it('should correctly handle period as argument', () => {
            expect(
                parseDefaultPeriod(
                    {
                        start: new Date('2024-07-04T16:00:00Z'),
                        end: new Date('2024-07-04T21:00:00Z'),
                    },
                    60,
                ),
            ).toEqual({
                start: 16,
                end: 21,
            });
            expect(
                parseDefaultPeriod(
                    {
                        start: new Date('2024-07-04T01:30:00Z'),
                        end: new Date('2024-07-04T05:30:00Z'),
                    },
                    60,
                ),
            ).toEqual({
                start: 2,
                end: 6,
            });
            expect(
                parseDefaultPeriod(
                    {
                        start: new Date('2024-07-04T01:15:00Z'),
                        end: new Date('2024-07-04T05:11:00Z'),
                    },
                    60,
                ),
            ).toEqual({
                start: 1,
                end: 5,
            });
            expect(
                parseDefaultPeriod(
                    {
                        start: new Date('2024-07-04T01:45:00Z'),
                        end: new Date('2024-07-04T05:38:00Z'),
                    },
                    60,
                ),
            ).toEqual({
                start: 2,
                end: 6,
            });
        });
    });
    describe('timeValuesToDatePeriod tests', () => {
        it('should return correct period', () => {
            const result = timeValuesToDatePeriod(
                {
                    start: 1,
                    end: 2,
                },
                new Date('2024-07-04T05:38:00Z'),
            );
            expect(result.start.getHours()).toBe(1);
            expect(result.start.getMinutes()).toBe(0);
            expect(result.end.getHours()).toBe(2);
            expect(result.end.getMinutes()).toBe(0);
        });
        it('should correct period', () => {
            const result = timeValuesToDatePeriod(
                {
                    start: 17.5,
                    end: 19.25,
                },
                new Date('2011-11-11T05:38:00Z'),
            );
            expect(result.start.getHours()).toBe(17);
            expect(result.start.getMinutes()).toBe(30);
            expect(result.end.getHours()).toBe(19);
            expect(result.end.getMinutes()).toBe(15);
        });

        it('should has correct date', () => {
            const result = timeValuesToDatePeriod(
                {
                    start: 17.5,
                    end: 19.25,
                },
                new Date('2011-11-11T05:38:00Z'),
            );
            expect(result.start.getFullYear()).toBe(2011);
            expect(result.start.getDate()).toBe(11);
            expect(result.start.getMonth()).toBe(11 - 1);
            expect(result.end.getFullYear()).toBe(2011);
            expect(result.end.getDate()).toBe(11);
            expect(result.end.getMonth()).toBe(11 - 1);
        });
    });
    describe('getHourRange tests', () => {
        it('should return array of hours', () => {
            expect(getHourRange()).toEqual([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19, 20, 21, 22, 23,
            ]);
        });
        it('should handle business hours as boolean argument, hardcoded from 09 to 17', () => {
            expect(getHourRange(true)).toEqual([9, 10, 11, 12, 13, 14, 15, 16]);
        });
        it('should handle business hours as period', () => {
            expect(getHourRange({ start: 13, end: 17 })).toEqual([
                13, 14, 15, 16,
            ]);
        });
    });
    describe('addIntervalToHourRange tests', () => {
        it('should return add intervals to range', () => {
            expect(addIntervalToHourRange([1, 2, 3], 30)).toEqual([
                1, 1.5, 2, 2.5, 3, 3.5,
            ]);
            expect(addIntervalToHourRange([1, 2, 3], 60)).toEqual([1, 2, 3]);
            expect(addIntervalToHourRange([1, 2, 3], 15)).toEqual([
                1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75,
            ]);
        });
    });
    describe('datePeriodToValuePeriod tests', () => {
        it('should return properly convert period, 30 interval', () => {
            expect(
                datePeriodToValuePeriod({
                    start: new Date('2024-07-04T10:33:00Z'),
                    end: new Date('2024-07-04T11:45:00Z'),
                }),
            ).toEqual({
                start: 10.55,
                end: 11.75,
            });
            expect(
                datePeriodToValuePeriod({
                    start: new Date('2024-07-04T01:11:00Z'),
                    end: new Date('2024-07-04T23:23:00Z'),
                }),
            ).toEqual({
                start: 1.1833333333333333,
                end: 23.383333333333333,
            });
        });
    });
    describe('calculateCurrentTimeTop tests', () => {
        it('should return return correct top position', () => {
            expect(calculateCurrentTimeTop(10, 30, 20, 30, null)).toBe(420);
            expect(calculateCurrentTimeTop(10, 30, 33, 30, null)).toBe(693);
        });

        it('should return correct position of current time if there is business hours', () => {
            expect(
                calculateCurrentTimeTop(10, 0, 50, 30, { start: 9, end: 15 }),
            ).toBe(100);
        });

        it('should return zero if time is before of the start business hour. Example current time is 8 AM and business hour starts at 9', () => {
            expect(
                calculateCurrentTimeTop(8, 30, 50, 30, { start: 9, end: 15 }),
            ).toBe(0);
        });

        it('should return max possible top posistion based on current range in case if current time is more then last bussines hour', () => {
            expect(
                calculateCurrentTimeTop(21, 30, 15, 60, { start: 8, end: 18 }),
            ).toBe(150);
        });
    });
});
