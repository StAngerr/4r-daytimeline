import {
    CurrentTimeSettings,
    Period,
    TimeLabelsSettings,
} from './DayTimeline.types.ts';
import { hours } from './DayTimeline.constants.ts';
import React, { useEffect, useMemo, useRef } from 'react';
import { NewPeriod } from './NewPeriod/NewPeriod.tsx';
import { toTimeLabel } from './utils.ts';

interface Props {
    defaultSelected?: Period;
    onChange?: (selected: Period) => void;
    periods?: Period[];
    businessHours?:
        | boolean
        | { start: (typeof hours)[number]; end: (typeof hours)[number] };
    date?: Date;
    currentTime?: CurrentTimeSettings;
    timeLabels?: TimeLabelsSettings;
    resizeComponent?: React.Component;
    timeslotHeight?: number;
    className?: string;
    interval?: 30 | 60;
}

const TIMESLOT_HEIGHT_VAR_NAME = '--timeslot-height';

export const DayTimeline = ({
    className,
    interval = 30,
    timeslotHeight = 60,
}: Props) => {
    const divContainer = useRef<HTMLDivElement | null>(null);
    const classes = useMemo(
        () => 'day-timeline-container' + (className ? ` ${className}` : ''),
        [className],
    );

    const renderRange = useMemo(() => {
        const half = interval !== 60;
        const baseStyles = {
            height: `${timeslotHeight}px`,
        };
        const baseProps = {
            className: 'timeline-item',
            style: baseStyles,
        };

        return hours.map((i) => {
            return half ? (
                [
                    <div {...baseProps} key={i}>
                        {toTimeLabel(i)}
                    </div>,
                    <div {...baseProps} key={i + 0.5}>
                        {toTimeLabel(i + 0.5)}
                    </div>,
                ]
            ) : (
                <div {...baseProps} key={i}>
                    {toTimeLabel(i)}
                </div>
            );
        });
    }, [interval, timeslotHeight]);

    useEffect(() => {
        if (divContainer.current && timeslotHeight) {
            divContainer.current.style.setProperty(
                TIMESLOT_HEIGHT_VAR_NAME,
                `${timeslotHeight}px`,
            );
        }
    }, [timeslotHeight]);

    return (
        <div ref={divContainer} className={classes}>
            {renderRange}
            <NewPeriod
                timeslotHeight={timeslotHeight}
                onResize={(...args) => console.log(...args)}
            />
        </div>
    );
};
