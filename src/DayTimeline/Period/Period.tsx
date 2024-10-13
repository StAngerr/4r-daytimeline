import React, { forwardRef, useMemo, useState } from 'react';
import {
    timeValuesToDatePeriod,
    timeValueToBottomPosition,
    timeValueToTopPosition,
} from '../../utils/period.utils';
import {
    BusinessHoursPeriod,
    Period as PeriodType,
    PeriodValues,
} from '../DayTimeline.types';
import { buildTimeLabel } from '../../utils/format.utils';
import { toClasses } from '../../utils/general';
import { useAfterMountEffect } from '../../hooks/useAfterMountEffect';

interface Props {
    period: PeriodValues;
    original: PeriodType;
    startEndHours: BusinessHoursPeriod;
    selectedComponent?: React.ComponentType<{ period: PeriodType }>;
    interval: number;
    timeslotHeight: number;
    crossDayEnd?: boolean;
    crossDayStart?: boolean;
    className?: string;
    date: Date;
}

export const Period = forwardRef(function (
    {
        period,
        startEndHours,
        interval,
        crossDayEnd = false,
        crossDayStart = false,
        selectedComponent: SelectedComp,
        original,
        className,
        date,
        timeslotHeight: STEP,
    }: Props,
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    const [placement, setPlacement] = useState({
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

    const classes = useMemo(
        () =>
            toClasses(
                'day-timeline-period',
                crossDayEnd && 'cross-end',
                crossDayStart && 'cross-start',
                className,
            ),
        [crossDayEnd, crossDayStart, className],
    );

    const content = useMemo(() => {
        if (SelectedComp)
            return (
                <SelectedComp period={timeValuesToDatePeriod(period, date)} />
            );

        return `${buildTimeLabel(original.start.getHours(), original.start.getMinutes())} - ${buildTimeLabel(original.end.getHours(), original.end.getMinutes())}`;
    }, [SelectedComp, original, period, date]);

    useAfterMountEffect(() => {
        if (period)
            setPlacement({
                top: timeValueToTopPosition(
                    period?.start - startEndHours.start,
                    STEP,
                    interval,
                ),
                bottom: timeValueToBottomPosition(
                    startEndHours.end - period?.end,
                    STEP,
                    interval,
                ),
            });
    }, [period, STEP, interval, startEndHours]);

    return (
        <div
            ref={ref}
            style={{ ...placement, zIndex: original.layer }}
            className={classes}
        >
            {content}
        </div>
    );
});
