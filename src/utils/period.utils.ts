import { Period, PeriodValues } from '../Daytimeline/DayTimeline.types.ts';
import {
    DEFAULT_BUSINESS_END_HOUR,
    DEFAULT_BUSINESS_START_HOUR,
    hours,
} from '../Daytimeline/DayTimeline.constants.ts';
import { isValidNumberTuple, isValidStringTuple } from './validation.utils.ts';

export const minutesToTimeValue = (val: number) => val / 60;

export const periodToTimelineValues = (date: Date) => {
    const hours = date.getHours();
    const min = date.getMinutes();

    return hours + minutesToTimeValue(min);
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
    // 24 hours - end value TODO added +1 itemHeight to not include period for example if period 9 -9.5 it should take exactyly one timeslot
) => `${val * (60 / interval) * itemHeight}px`;

export const roundToInterval = (value: number, interval: number): number => {
    const factor = 60 / interval;
    return Math.round(value * factor) / factor;
};

export const timeValueToTimeUnits = (val: number): [number, number] => {
    const hours = Math.floor(val);
    const minutes = Math.round((val - hours) * 60);
    return [hours, minutes];
};

export const parseMinutesAndToTimeValue = (min: string, interval: number) => {
    return roundToInterval(minutesToTimeValue(parseInt(min)), interval);
};

export const timeStringToTimeValue = (time: string, interval: number) => {
    const [hour, minute] = time.split(':');
    return parseInt(hour) + parseMinutesAndToTimeValue(minute, interval);
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
    //TODO check if needed to round to in terval
    if ('start' in defaultSelected && 'end' in defaultSelected)
        return {
            start: roundToInterval(
                periodToTimelineValues(defaultSelected.start),
                interval,
            ),
            end: roundToInterval(
                periodToTimelineValues(defaultSelected.end),
                interval,
            ),
        };
    return null;
};

//TODO handle this with actual date from props ?
export const timeValuesToDatePeriod = (period: PeriodValues): Period => {
    const start = new Date();
    const end = new Date();
    const startValues = timeValueToTimeUnits(period.start);
    const endValues = timeValueToTimeUnits(period.end);

    start.setHours(startValues[0]);
    start.setMinutes(startValues[1]);
    end.setHours(endValues[0]);
    end.setMinutes(endValues[1]);

    return {
        start,
        end,
    };
};

export const getHourRange = (
    businessHours?:
        | boolean
        | { start: (typeof hours)[number]; end: (typeof hours)[number] },
) => {
    if (typeof businessHours === 'boolean') {
        return hours.slice(
            DEFAULT_BUSINESS_START_HOUR,
            DEFAULT_BUSINESS_END_HOUR + 1,
        );
    } else if (
        businessHours &&
        'start' in businessHours &&
        'end' in businessHours
    ) {
        return hours.slice(businessHours.start, businessHours.end + 1);
    }
    return hours;
};

export const addIntervalToHourRange = (range: number[], interval: number) => {
    const period = interval / 60;
    const iterations = 1 / period;

    return range.flatMap((hour: number) => {
        const result: number[] = [];

        for (let i = 0; i < iterations; i++) {
            if (typeof result[0] === 'undefined') result.push(hour);
            else if (result[result.length - 1] + period < 24)
                result.push(result[result.length - 1] + period);
        }
        return result;
    });
};

export const datePeriodToValuePeriod = (
    period: Period,
    interval: number,
): PeriodValues => {
    return {
        start:
            period.start.getHours() +
            roundToInterval(
                minutesToTimeValue(period.start.getMinutes()),
                interval,
            ),
        end:
            period.end.getHours() +
            roundToInterval(
                minutesToTimeValue(period.end.getMinutes()),
                interval,
            ),
    };
};

export const calculateCurrentTimeTop = (
    hours: number,
    minutes: number,
    itemHeight: number,
    interval: number,
) => {
    const multiplayer = 60 / interval;
    return (hours + minutesToTimeValue(minutes)) * multiplayer * itemHeight;
};
