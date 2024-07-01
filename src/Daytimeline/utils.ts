import { Period, PeriodValues } from './DayTimeline.types.ts';

const hoursLeadingZero = (val: number) => (val < 10 ? '0' + val : val);

// Accepts decimal values like 0.25 - 15min, 0.5 - 30m, 0.75 - 45min
const valueToMin = (val: number) => 60 * val;

// TODO think of formats as H-0-23 HH(leading zero)-00-23 h - 1-12 hh(leading zero)-1-12, m mm
// @ts-ignore
export const toTimeLabel = (i: number, format = '') => {
    const [hour] = i.toString().split('.');

    return `${hoursLeadingZero(+hour)}:${hoursLeadingZero(valueToMin(i - +hour))}`;
};

const minutesToHoursRatio = (min: number) => min / 60;

export const periodToTimelineValues = (date: Date) => {
    const hours = date.getHours();
    const min = date.getMinutes();

    return hours + minutesToHoursRatio(min);
};

export const timeValueToTopPosition = (
    val: number,
    itemHeight: number,
    interval: number,
): string => `${val * (60 / interval) * itemHeight}px`;

export const timeValueToBottomPosition = (
    val: number,
    itemHeight: number,
    interval: number,
    // 24 hours - end value
) => `${(24 - val) * (60 / interval) * itemHeight}px`;

export const isValidNumberTuple = (
    input: [unknown, unknown],
): input is [number, number] => {
    const [start, end] = input;
    const isNumbers = typeof start === 'number' && typeof end === 'number';
    return (
        isNumbers &&
        start < 24 &&
        start >= 0 &&
        end > 0 &&
        end <= 24 &&
        start < end
    );
};

export const isValidTimeString = (timeString: string) => {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(timeString);
};

export const isValidStringTuple = (
    input: [unknown, unknown],
): input is [string, string] => {
    const [start, end] = input;
    const isStrings = typeof start === 'string' && typeof end === 'string';

    return isStrings && isValidTimeString(start) && isValidTimeString(end);
};

const roundToInterval = (value: number, interval: number): number => {
    const factor = 60 / interval;
    return Math.round(value * factor) / factor;
};

const minutesToTimeValue = (val: number) => val / 60;

export const timeValueToMinutes = (val: number) => {
    const hours = Math.floor(val);
    const minutes = Math.round((val - hours) * 60);
    return [hours, minutes];
};

const parseStringMinutes = (min: string, interval: number) => {
    return roundToInterval(minutesToTimeValue(parseInt(min)), interval);
};

export const timeStringToTimeValue = (time: string, interval: number) => {
    const [hour, minute] = time.split(':');
    return parseInt(hour) + parseStringMinutes(minute, interval);
};

export const parseDefaultPeriod = (
    defaultSelected: Period | [number, number] | [string, string] | undefined,
    interval: number,
): PeriodValues | null => {
    if (!defaultSelected) return null;

    if (Array.isArray(defaultSelected)) {
        if (isValidNumberTuple(defaultSelected))
            return {
                start: roundToInterval(defaultSelected[0], interval),
                end: roundToInterval(defaultSelected[1], interval),
            };
        else if (isValidStringTuple(defaultSelected)) {
            return {
                start: timeStringToTimeValue(defaultSelected[0], interval),
                end: timeStringToTimeValue(defaultSelected[1], interval),
            };
        }
    }

    if ('start' in defaultSelected && 'end' in defaultSelected)
        return {
            start: periodToTimelineValues(defaultSelected.start),
            end: periodToTimelineValues(defaultSelected.end),
        };
    return null;
};

export const timeValuesToDatePeriod = (period: PeriodValues) => {
    const start = new Date();
    const end = new Date();
    const startValues = timeValueToMinutes(period.start);
    const endValues = timeValueToMinutes(period.end);

    start.setHours(startValues[0]);
    start.setMinutes(startValues[1]);
    end.setHours(endValues[0]);
    end.setMinutes(endValues[1]);

    return {
        start,
        end,
    };
};
