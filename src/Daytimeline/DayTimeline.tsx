import {
    BusinessHoursPeriod,
    CurrentTimeSettings,
    Period,
    PeriodValues,
    TimeLabelsSettings,
} from './DayTimeline.types.ts';
import {
    DEFAULT_BUSINESS_END_HOUR,
    DEFAULT_BUSINESS_START_HOUR,
    hours,
} from './DayTimeline.constants.ts';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { NewPeriod } from './NewPeriod/NewPeriod.tsx';
import {
    addIntervalToHourRange,
    getHourRange,
    parseDefaultPeriod,
    timeValuesToDatePeriod,
    toTimeLabel,
} from './utils.ts';

interface Props {
    defaultSelected?: Period | [number, number] | [string, string]; // +
    onChange: (selected: Period) => void; // +
    periods?: Period[];
    businessHours?: // +
    boolean | { start: (typeof hours)[number]; end: (typeof hours)[number] };
    date?: Date;
    currentTime?: CurrentTimeSettings;
    timeLabels?: TimeLabelsSettings;
    // TODO check what to use Component or FunctionalComponent
    selectedComponent?: React.FunctionComponent; // +
    timeslotHeight?: number; // +
    className?: string; // +
    interval?: 30 | 60; // +
}
const TIMESLOT_HEIGHT_VAR_NAME = '--timeslot-height';

export const DayTimeline = ({
    defaultSelected,
    onChange,
    className,
    interval = 30,
    timeslotHeight = 60,
    businessHours,
    selectedComponent,
    timeLabels,
}: Props) => {
    const [selected, setSelected] = useState<PeriodValues | null>(
        parseDefaultPeriod(defaultSelected, interval),
    );
    const divContainer = useRef<HTMLDivElement | null>(null);
    const classes = useMemo(
        () => 'day-timeline-container' + (className ? ` ${className}` : ''),
        [className],
    );

    const handleClick = useCallback(
        (value: number) => {
            if (selected) {
                const newEnd = value + selected.end - selected.start;

                if (newEnd > 24) {
                    setSelected({
                        start: 24 - (selected.end - selected.start),
                        end: 24,
                    });
                } else {
                    setSelected({
                        start: value,
                        end: newEnd,
                    });
                }
                // setSelected({
                //     start: value,
                //     end: newEnd > 24 ? :  newEnd,
                // });
            } else setSelected({ start: value, end: value + interval / 60 });
        },
        [interval, selected],
    );

    const renderRange = useMemo(() => {
        const baseStyles = {
            height: `${timeslotHeight}px`,
        };
        const baseProps = {
            className: 'timeline-item',
            style: baseStyles,
        };
        const { component, position } = timeLabels || {};
        console.log(
            addIntervalToHourRange(
                getHourRange(businessHours) as number[],
                interval,
            ),
        );
        return addIntervalToHourRange(
            getHourRange(businessHours) as number[],
            interval,
        ).map((i) => {
            return (
                <div onClick={() => handleClick(i)} {...baseProps} key={i}>
                    {component ? (
                        component(i)
                    ) : (
                        <span
                            className={
                                'time-label' + (position ? ` ${position}` : '')
                            }
                        >
                            {toTimeLabel(i)}
                        </span>
                    )}
                </div>
            );
        });
    }, [interval, timeslotHeight, businessHours, timeLabels, handleClick]);

    const handlePeriodChange = useCallback(
        (period: PeriodValues) => {
            setSelected(period);
            onChange(timeValuesToDatePeriod(period));
        },
        [onChange],
    );
    // TODO for business hours range show last hour label
    const startEndHours: BusinessHoursPeriod = useMemo(() => {
        if (!businessHours) return { start: 0, end: 24 };
        if (typeof businessHours === 'boolean')
            return {
                start: DEFAULT_BUSINESS_START_HOUR,
                end: DEFAULT_BUSINESS_END_HOUR,
            };

        return businessHours;
    }, [businessHours]);

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
            {selected && (
                <NewPeriod
                    interval={interval}
                    selected={selected}
                    timeslotHeight={timeslotHeight}
                    onChange={handlePeriodChange}
                    startEndHours={startEndHours}
                    selectedComponent={selectedComponent}
                />
            )}
        </div>
    );
};
