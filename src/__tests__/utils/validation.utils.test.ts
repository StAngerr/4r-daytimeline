import {
    isValidNumberTuple,
    isValidStringTuple,
    isValidTimeString,
} from '../../utils/validation.utils.ts';

describe('validation utils tests', () => {
    describe('isValidNumberTuple tests', () => {
        it('should return true if valid tuple', () => {
            expect(isValidNumberTuple([0, 22])).toBeTruthy();
            expect(isValidNumberTuple([7, 15])).toBeTruthy();
            expect(isValidNumberTuple([1, 2])).toBeTruthy();
            expect(isValidNumberTuple([11, 12])).toBeTruthy();
            expect(isValidNumberTuple([0, 24])).toBeTruthy();
        });
        it('should return false if invalid tuple', () => {
            expect(isValidNumberTuple([3, 0])).toBeFalsy();
            expect(isValidNumberTuple([17, 15])).toBeFalsy();
            expect(isValidNumberTuple([15, 8])).toBeFalsy();
            expect(isValidNumberTuple([18, 12])).toBeFalsy();
            expect(isValidNumberTuple([3, 1])).toBeFalsy();
        });
        it('should return false if invalid tuple', () => {
            expect(isValidNumberTuple(['3', 10])).toBeFalsy();
            expect(isValidNumberTuple([13, '15'])).toBeFalsy();
            expect(isValidNumberTuple(['1', '12'])).toBeFalsy();
        });
    });

    describe('isValidTimeString tests', () => {
        it('should validate if string has correct format HH:mm', () => {
            expect(isValidTimeString('01:22')).toBeTruthy();
            expect(isValidTimeString('14:15')).toBeTruthy();
            expect(isValidTimeString('23:45')).toBeTruthy();
            expect(isValidTimeString('01:01')).toBeTruthy();
            expect(isValidTimeString('01:01')).toBeTruthy();
        });
        it('should return false for incorrect string', () => {
            expect(isValidTimeString('test')).toBeFalsy();
            expect(isValidTimeString('t:t')).toBeFalsy();
            expect(isValidTimeString('-12:45')).toBeFalsy();
            expect(isValidTimeString('25:01')).toBeFalsy();
            expect(isValidTimeString('01:66')).toBeFalsy();
            expect(isValidTimeString('01 14')).toBeFalsy();
            expect(isValidTimeString('0114')).toBeFalsy();
            expect(isValidTimeString('1:25')).toBeFalsy();
            expect(isValidTimeString('01:5')).toBeFalsy();
        });
    });

    describe('isValidStringTuple tests', () => {
        it('should return true for correct string tuple', () => {
            expect(isValidStringTuple(['01:22', '14:15'])).toBeTruthy();
            expect(isValidStringTuple(['15:15', '17:19'])).toBeTruthy();
        });
        it('should return false for wrong string tuple', () => {
            expect(isValidStringTuple([1, 2])).toBeFalsy();
            expect(isValidStringTuple([])).toBeFalsy();
            expect(isValidStringTuple([null, null])).toBeFalsy();
            expect(isValidStringTuple([true, true])).toBeFalsy();
            expect(isValidStringTuple([{}, {}])).toBeFalsy();
            expect(isValidStringTuple(['test', 'test'])).toBeFalsy();
            expect(isValidStringTuple(['26:66', '1:15'])).toBeFalsy();
        });
    });
});
