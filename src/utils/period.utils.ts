import {
    BusinessHoursPeriod,
    Period,
    PeriodValues,
} from '../DayTimeline/DayTimeline.types';
import {
    DEFAULT_BUSINESS_END_HOUR,
    DEFAULT_BUSINESS_START_HOUR,
    hours,
} from '../DayTimeline/DayTimeline.constants';
import { isValidNumberTuple, isValidStringTuple } from './validation.utils';

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
) => `${val * (60 / interval) * itemHeight}px`;

export const roundToInterval = (value: number, interval: number): number => {
    const factor = 60 / interval;
    return Math.round(value * factor) / factor;
};

export const roundDownToInterval = (
    value: number,
    interval: number,
): number => {
    return Math.floor(value / interval) * interval;
};

export const roundUpToInterval = (value: number, interval: number): number => {
    return Math.ceil(value / interval) * interval;
};

export const timeValueToTimeUnits = (val: number): [number, number] => {
    const hours = Math.floor(val);
    const minutes = Math.round((val - hours) * 60);
    return [hours, minutes];
};

export const parseMinutesAndToTimeValue = (min: string, interval: number) => {
    return roundToInterval(minutesToTimeValue(parseInt(min)), interval);
};

export const timeStringToTimeValue = (time: string) => {
    const [hour, minute] = time.split(':');
    return parseInt(hour) + minutesToTimeValue(parseInt(minute));
};

export const parseDefaultPeriod = (
    defaultSelected: Period | [number, number] | [string, string] | undefined,
): PeriodValues | null => {
    if (!defaultSelected) return null;

    if (Array.isArray(defaultSelected)) {
        if (isValidNumberTuple(defaultSelected))
            return {
                start: defaultSelected[0],
                end: defaultSelected[1],
            };
        else if (isValidStringTuple(defaultSelected)) {
            return {
                start: timeStringToTimeValue(defaultSelected[0]),
                end: timeStringToTimeValue(defaultSelected[1]),
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

export const timeValuesToDatePeriod = (
    period: PeriodValues,
    date: Date,
): Period => {
    const start = new Date(date.getTime());
    const end = new Date(date.getTime());
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

export const getHourRange = (businessHours?: boolean | BusinessHoursPeriod) => {
    if (typeof businessHours === 'boolean' && businessHours) {
        return hours.slice(
            DEFAULT_BUSINESS_START_HOUR,
            DEFAULT_BUSINESS_END_HOUR,
        );
    } else if (
        businessHours &&
        'start' in businessHours &&
        'end' in businessHours
    ) {
        return hours.slice(businessHours.start, businessHours.end);
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

export const datePeriodToValuePeriod = (period: Period): PeriodValues => {
    return {
        start:
            period.start.getHours() +
            minutesToTimeValue(period.start.getMinutes()),
        end:
            period.end.getHours() + minutesToTimeValue(period.end.getMinutes()),
    };
};

export const calculateCurrentTimeTop = (
    hr: number,
    minutes: number,
    itemHeight: number,
    interval: number,
    businessHoursAsPeriod: BusinessHoursPeriod | null,
) => {
    const multiplayer = 60 / interval;
    const subtractHours =
        (businessHoursAsPeriod && businessHoursAsPeriod.start) || 0;

    if (
        businessHoursAsPeriod &&
        hr + minutesToTimeValue(minutes) > businessHoursAsPeriod.end
    )
        return (
            (businessHoursAsPeriod.end - businessHoursAsPeriod.start) *
            multiplayer *
            itemHeight
        );
    else if (
        businessHoursAsPeriod &&
        hr + minutesToTimeValue(minutes) < businessHoursAsPeriod.start
    )
        return 0;

    return (
        (hr - subtractHours + minutesToTimeValue(minutes)) *
        multiplayer *
        itemHeight
    );
};
