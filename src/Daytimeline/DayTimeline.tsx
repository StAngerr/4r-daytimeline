import {
    BusinessHoursPeriod,
    CurrentTimeSettings,
    Period as PeriodType,
    PeriodValues,
    SegmentedConfig,
    SegmentedPartConfig,
    TimeLabelsSettings,
} from './DayTimeline.types.ts';
import {
    DEFAULT_BUSINESS_END_HOUR,
    DEFAULT_BUSINESS_START_HOUR,
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
    datePeriodToValuePeriod,
    getHourRange,
    parseDefaultPeriod,
    timeValuesToDatePeriod,
} from '../utils/period.utils.ts';
import { Period } from './Period/Period.tsx';
import { CurrentTime } from './CurrentTime/CurrentTime.tsx';
import {
    isDateInRange,
    isSameDate,
    roundToEndOfTheDay,
    roundToStartOfTheDay,
} from '../utils/time.utils.ts';
import { buildTimeLabel } from '../utils/format.utils.ts';
import { SegmentedPeriod } from './SegmentedPeriod/SegmentedPeriod.tsx';

interface Props {
    defaultSelected?: PeriodType | [number, number] | [string, string];
    onChange: (selected: PeriodType) => void;
    periods?: PeriodType[];
    businessHours?: boolean | BusinessHoursPeriod;
    date?: Date;
    currentTime?: CurrentTimeSettings;
    timeLabels?: TimeLabelsSettings;
    selectedComponent?: React.ComponentType<{ selected: PeriodType }>;
    timeslotHeight?: number;
    className?: string;
    interval?: 30 | 60;
    segmented?: SegmentedConfig;
    segmentedParts?: SegmentedPartConfig;
}
const TIMESLOT_HEIGHT_VAR_NAME = '--timeslot-height';

export const DayTimeline = ({
    defaultSelected,
    onChange,
    className,
    periods = [],
    date = new Date(),
    interval = 30,
    timeslotHeight = 60,
    businessHours,
    selectedComponent,
    segmentedParts,
    currentTime,
    timeLabels,
}: Props) => {
    const [selected, setSelected] = useState<PeriodValues | null>(
        parseDefaultPeriod(defaultSelected),
    );
    const divContainer = useRef<HTMLDivElement | null>(null);
    const classes = useMemo(
        () => 'day-timeline-container' + (className ? ` ${className}` : ''),
        [className],
    );
    const intervalValue = useMemo(() => interval / 60, [interval]);

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
        const hoursRange = addIntervalToHourRange(
            getHourRange(businessHours) as number[],
            interval,
        );

        return hoursRange.map((i) => {
            return (
                <div onClick={() => handleClick(i)} {...baseProps} key={i}>
                    {component ? (
                        component(i)
                    ) : (
                        <>
                            <span
                                className={
                                    'time-label' +
                                    (position ? ` ${position}` : '')
                                }
                            >
                                {buildTimeLabel(i)}
                            </span>
                            {businessHours &&
                                i === hoursRange[hoursRange.length - 1] &&
                                i !== 24 && (
                                    <span
                                        className={
                                            'time-label extra' +
                                            (position ? ` ${position}` : '')
                                        }
                                    >
                                        {buildTimeLabel(i + intervalValue)}
                                    </span>
                                )}
                        </>
                    )}
                </div>
            );
        });
    }, [interval, timeslotHeight, businessHours, timeLabels, handleClick]);

    const handlePeriodChange = useCallback(
        (period: PeriodValues) => {
            setSelected(period);
            onChange(timeValuesToDatePeriod(period, date));
        },
        [onChange, date],
    );

    const startEndHours: BusinessHoursPeriod = useMemo(() => {
        if (!businessHours) return { start: 0, end: 24 };
        if (typeof businessHours === 'boolean')
            return {
                start: DEFAULT_BUSINESS_START_HOUR,
                end: DEFAULT_BUSINESS_END_HOUR,
            };

        return businessHours;
    }, [businessHours]);

    const renderPeriods = useMemo(
        () =>
            periods.map((p) => {
                let adjustedPeriod: PeriodType | null = null;
                let crossDayStart = false;
                let crossDayEnd = false;

                if (isSameDate(p.start, date) && isSameDate(p.end, date)) {
                    adjustedPeriod = p;
                } else if (
                    isSameDate(p.start, date) &&
                    !isSameDate(p.end, date)
                ) {
                    crossDayEnd = true;
                    adjustedPeriod = {
                        ...p,
                        end: roundToEndOfTheDay(date),
                    };
                } else if (
                    !isSameDate(p.start, date) &&
                    isSameDate(p.end, date)
                ) {
                    crossDayStart = true;
                    adjustedPeriod = {
                        ...p,
                        start: roundToStartOfTheDay(date),
                    };
                } else if (
                    !isSameDate(p.start, date) &&
                    !isSameDate(p.end, date) &&
                    isDateInRange(date, p.start, p.end)
                ) {
                    crossDayEnd = crossDayStart = true;
                    adjustedPeriod = {
                        ...p,
                        start: roundToStartOfTheDay(date),
                        end: roundToEndOfTheDay(date),
                    };
                }

                return (
                    adjustedPeriod && (
                        <Period
                            crossDayStart={crossDayStart}
                            crossDayEnd={crossDayEnd}
                            original={p}
                            interval={interval}
                            startEndHours={startEndHours}
                            timeslotHeight={timeslotHeight}
                            period={datePeriodToValuePeriod(adjustedPeriod)}
                        />
                    )
                );
            }),
        [date, interval, periods, startEndHours, timeslotHeight],
    );

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
            {selected &&
                (segmentedParts ? (
                    <SegmentedPeriod
                        segmentedParts={segmentedParts}
                        intervalValue={intervalValue}
                        interval={interval}
                        selected={selected}
                        timeslotHeight={timeslotHeight}
                        onChange={handlePeriodChange}
                        startEndHours={startEndHours}
                        selectedComponent={selectedComponent}
                        date={date}
                    />
                ) : (
                    <NewPeriod
                        intervalValue={intervalValue}
                        interval={interval}
                        selected={selected}
                        timeslotHeight={timeslotHeight}
                        onChange={handlePeriodChange}
                        startEndHours={startEndHours}
                        selectedComponent={selectedComponent}
                        date={date}
                    />
                ))}
            {renderPeriods}
            <CurrentTime
                interval={interval}
                currentTime={currentTime}
                timeslotHeight={timeslotHeight}
                businessHours={businessHours}
            />
        </div>
    );
};
