import React, { useMemo, useState } from 'react';
import { timeValueToBottomPosition, timeValueToTopPosition } from '../utils.ts';
import {
    BusinessHoursPeriod,
    Period as PeriodType,
    PeriodValues,
} from '../DayTimeline.types.ts';

interface Props {
    period: PeriodValues;
    original: PeriodType;
    startEndHours: BusinessHoursPeriod;
    interval: number;
    timeslotHeight: number;
    crossDayEnd?: boolean;
    crossDayStart?: boolean;
}

//TODO think if its possible to reuse this compoennt as base for NewPeriod due to repeatable content
export const Period = ({
    period,
    startEndHours,
    interval,
    crossDayEnd = false,
    crossDayStart = false,
    original,
    timeslotHeight: STEP,
}: Props) => {
    const [placement] = useState({
        top: timeValueToTopPosition(
            period.start - startEndHours.start,
            STEP,
            interval,
        ),
        bottom: timeValueToBottomPosition(
            startEndHours.end - period?.end,
            STEP,
            interval,
        ),
    });

    const classes = useMemo(() => {
        const base = ['day-timeline-period'];
        if (crossDayEnd) base.push('cross-end');
        if (crossDayStart) base.push('cross-start');
        return base.join(' ');
    }, [crossDayEnd, crossDayStart]);

    return (
        <div
            style={{ ...placement, zIndex: original.layer }}
            className={classes}
        >
            {original.start.toString()}
            <div></div>
            {original.end.toString()}
        </div>
    );
};
