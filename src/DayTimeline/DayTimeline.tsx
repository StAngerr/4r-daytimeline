import {
    BusinessHoursPeriod,
    CurrentTimeSettings,
    Period as PeriodType,
    PeriodValues,
    SegmentedConfig,
    SegmentedPartConfig,
    TimeLabelsSettings,
} from './DayTimeline.types';
import {
    DEFAULT_BUSINESS_END_HOUR,
    DEFAULT_BUSINESS_START_HOUR,
} from './DayTimeline.constants';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { NewPeriod } from './NewPeriod/NewPeriod';
import {
    addIntervalToHourRange,
    datePeriodToValuePeriod,
    getHourRange,
    parseDefaultPeriod,
    timeValuesToDatePeriod,
} from '../utils/period.utils';
import { Period } from './Period/Period';
import { CurrentTime } from './CurrentTime/CurrentTime';
import {
    isDateInRange,
    isSameDate,
    roundToEndOfTheDay,
    roundToStartOfTheDay,
} from '../utils/time.utils';
import { buildTimeLabel } from '../utils/format.utils';
import { SegmentedPeriod } from './SegmentedPeriod/SegmentedPeriod';

export interface Props {
    /**
     * Initial selected time period to display when the component mounts.
     *
     * Can be provided in three different formats:
     * 1. A Period object with start and end Date objects
     * 2. A tuple of numbers representing [startHour, endHour] (e.g., [9, 17] for 9 AM to 5 PM)
     * 3. A tuple of strings representing time (e.g., ["09:00", "17:00"])
     *
     * If not provided, no time slot will be selected initially until the user interacts with the timeline.
     *
     * @example
     * ```tsx
     * // Using a Period object
     * const startTime = new Date();
     * startTime.setHours(10, 0, 0);
     * const endTime = new Date();
     * endTime.setHours(11, 30, 0);
     *
     * <DayTimeline defaultSelected={{ start: startTime, end: endTime }} />
     *
     * // Using hour numbers
     * <DayTimeline defaultSelected={[10, 11.5]} />
     *
     * // Using time strings
     * <DayTimeline defaultSelected={["10:00", "11:30"]} />
     * ```
     */
    defaultSelected?: PeriodType | [number, number] | [string, string];

    /**
     * Callback function triggered when a user creates or modifies a time period.
     *
     * This function is called when the user:
     * - Drags to create a new time slot
     * - Clicks on an empty area to create a new time slot
     * - Modifies an existing time slot by dragging its edges
     *
     * @param selected The Period object containing start and end Date objects
     * representing the newly created or modified time period
     *
     * @example
     * ```tsx
     * const handleChange = (period) => {
     *   console.log(`New time slot: ${period.start.toLocaleTimeString()} - ${period.end.toLocaleTimeString()}`);
     * };
     *
     * <DayTimeline onChange={handleChange} />
     * ```
     */
    onChange: (selected: PeriodType) => void;

    /**
     * Array of existing time periods to display on the timeline.
     * 
     * This prop allows you to display pre-existing events, bookings, or time slots on the timeline.
     * These periods are rendered as non-editable visual elements, showing existing commitments
     * or scheduled events. They help users see what time slots are already occupied when making
     * new selections.
     * 
     * @example
     * ```tsx
     * // Display existing meetings
     * const existingMeetings = [
     *   {
     *     start: new Date('2024-01-15T09:00:00'),
     *     end: new Date('2024-01-15T10:30:00'),
     *     id: 'meeting-1'
     *   },
     *   {
     *     start: new Date('2024-01-15T14:00:00'),
     *     end: new Date('2024-01-15T15:00:00'),
     *     id: 'meeting-2'
     *   }
     * ];
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   periods={existingMeetings}
     * />
     * 
     * // Display events with custom styling
     * const events = [
     *   {
     *     start: new Date('2024-01-15T10:00:00'),
     *     end: new Date('2024-01-15T11:00:00'),
     *     id: 'event-1',
     *     layer: 1
     *   },
     *   {
     *     start: new Date('2024-01-15T13:00:00'),
     *     end: new Date('2024-01-15T16:00:00'),
     *     id: 'event-2',
     *     layer: 2
     *   }
     * ];
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   periods={events}
     * />
     * 
     * // Display bookings with different dates
     * const bookings = [
     *   {
     *     start: new Date('2024-01-15T08:00:00'),
     *     end: new Date('2024-01-15T09:00:00'),
     *     id: 'booking-1'
     *   },
     *   {
     *     start: new Date('2024-01-16T10:00:00'), // Different day
     *     end: new Date('2024-01-16T12:00:00'),
     *     id: 'booking-2'
     *   }
     * ];
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   periods={bookings}
     *   date={new Date('2024-01-15')} // Only shows periods for this date
     * />
     * ```
     */
    periods?: PeriodType[];
    /**
     * Controls the display of business hours on the timeline.
     *
     * When enabled, the timeline will only show time slots within the specified business hours,
     * making it easier to schedule meetings and events during typical working hours.
     *
     * @example
     * ```tsx
     * // Use default business hours (9 AM to 5 PM)
     * <DayTimeline
     *   onChange={handleChange}
     *   businessHours={true}
     * />
     *
     * // Custom business hours (8 AM to 6 PM)
     * <DayTimeline
     *   onChange={handleChange}
     *   businessHours={{
     *     start: 8,
     *     end: 18
     *   }}
     * />
     *
     * // Extended business hours (7 AM to 8 PM)
     * <DayTimeline
     *   onChange={handleChange}
     *   businessHours={{
     *     start: 7,
     *     end: 20
     *   }}
     * />
     *
     * // Disable business hours (show full 24-hour timeline)
     * <DayTimeline
     *   onChange={handleChange}
     *   businessHours={false}
     * />
     * ```
     */
    businessHours?: boolean | BusinessHoursPeriod;

    /**
     * Settings for displaying the current time indicator on the timeline.
     *
     * The current time indicator shows a horizontal line at the current time position on the timeline,
     * making it easy to see the current time in relation to scheduled events.
     *
     * @example
     * ```tsx
     * // Basic usage - shows a default current time indicator
     * <DayTimeline
     *   onChange={handleChange}
     *   currentTime={true}
     * />
     *
     * // Custom configuration
     * <DayTimeline
     *   onChange={handleChange}
     *   currentTime={{
     *     showLine: true,       // Show the horizontal line
     *     showTime: true,       // Show the time label
     *     // Custom component for rendering the time
     *     component: ({ timeLabel }) => <span className="custom-time">{timeLabel}</span>
     *   }}
     * />
     * ```
     */
    currentTime?: CurrentTimeSettings;

    /**
     * Settings for customizing the time labels displayed on the timeline.
     * 
     * This prop allows you to customize how time labels are rendered, including their position
     * and providing custom components for rendering. You can control whether labels appear on
     * the left or right side of the timeline and create custom label components.
     * 
     * @example
     * ```tsx
     * // Position labels on the right side
     * <DayTimeline
     *   onChange={handleChange}
     *   timeLabels={{
     *     position: 'right'
     *   }}
     * />
     * 
     * // Custom time label component
     * const CustomTimeLabel = (hour) => (
     *   <div className="custom-time-label">
     *     <span className="hour">{hour}:00</span>
     *     <span className="period">{hour < 12 ? 'AM' : 'PM'}</span>
     *   </div>
     * );
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   timeLabels={{
     *     component: CustomTimeLabel,
     *     position: 'left'
     *   }}
     * />
     * 
     * // Minimal time labels with custom styling
     * const MinimalLabel = (hour) => (
     *   <span className="text-xs text-gray-500 font-mono">
     *     {hour.toString().padStart(2, '0')}
     *   </span>
     * );
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   timeLabels={{
     *     component: MinimalLabel
     *   }}
     * />
     * 
     * // 12-hour format labels
     * const TwelveHourLabel = (hour) => {
     *   const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
     *   const period = hour < 12 ? 'AM' : 'PM';
     *   return (
     *     <div className="time-label-12h">
     *       <span className="hour">{displayHour}</span>
     *       <span className="period">{period}</span>
     *     </div>
     *   );
     * };
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   timeLabels={{
     *     component: TwelveHourLabel,
     *     position: 'right'
     *   }}
     * />
     * ```
     */
    timeLabels?: TimeLabelsSettings;
    /**
     * Custom component to render the content of the selected time period.
     * 
     * This prop allows you to provide a custom React component that will be used to render
     * the content inside the selected time slot. The component receives the selected period
     * as a prop, enabling you to display custom information, styling, or interactive elements.
     * 
     * @example
     * ```tsx
     * // Simple custom component showing time range
     * const TimeDisplay = ({ selected }) => (
     *   <div className="custom-time-display">
     *     <strong>Selected:</strong> {selected.start.toLocaleTimeString()} - {selected.end.toLocaleTimeString()}
     *   </div>
     * );
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   selectedComponent={TimeDisplay}
     * />
     * 
     * // Component with duration calculation
     * const DurationDisplay = ({ selected }) => {
     *   const duration = selected.end.getTime() - selected.start.getTime();
     *   const hours = Math.floor(duration / (1000 * 60 * 60));
     *   const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
     *   
     *   return (
     *     <div className="duration-display">
     *       <span className="time">{selected.start.toLocaleTimeString()}</span>
     *       <span className="duration">({hours}h {minutes}m)</span>
     *     </div>
     *   );
     * };
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   selectedComponent={DurationDisplay}
     * />
     * 
     * // Interactive component with actions
     * const InteractiveDisplay = ({ selected }) => (
     *   <div className="interactive-display">
     *     <span>{selected.start.toLocaleTimeString()}</span>
     *     <button onClick={() => console.log('Edit clicked')}>Edit</button>
     *     <button onClick={() => console.log('Delete clicked')}>Delete</button>
     *   </div>
     * );
     * 
     * <DayTimeline
     *   onChange={handleChange}
     *   selectedComponent={InteractiveDisplay}
     * />
     * ```
     */
    selectedComponent?: React.ComponentType<{ selected: PeriodType }>;
    /**
     * Controls the height of each time slot in the timeline.
     * 
     * This property determines the visual height of individual time slots, affecting the overall
     * appearance and usability of the timeline. Larger values create more spacious slots that are
     * easier to interact with, while smaller values allow more time slots to be visible at once.
     * 
     * @default 60
     * 
     * @example
     * ```tsx
     * // Default height (60px) - balanced spacing
     * <DayTimeline
     *   onChange={handleChange}
     *   timeslotHeight={60}
     * />
     * 
     * // Compact timeline (40px) - more slots visible
     * <DayTimeline
     *   onChange={handleChange}
     *   timeslotHeight={40}
     * />
     * 
     * // Spacious timeline (80px) - easier interaction
     * <DayTimeline
     *   onChange={handleChange}
     *   timeslotHeight={80}
     * />
     * 
     * // Large timeline (100px) - maximum comfort
     * <DayTimeline
     *   onChange={handleChange}
     *   timeslotHeight={100}
     * />
     * ```
     */
    timeslotHeight?: number;

    /**
     * Additional CSS class names to apply to the timeline container.
     * 
     * This prop allows you to add custom CSS classes to the main timeline container element.
     * The classes will be appended to the default 'day-timeline-container' class, enabling
     * custom styling and theming of the timeline component.
     * 
     * @example
     * ```tsx
     * // Add custom styling
     * <DayTimeline
     *   onChange={handleChange}
     *   className="my-custom-timeline"
     * />
     * 
     * // Add multiple classes
     * <DayTimeline
     *   onChange={handleChange}
     *   className="timeline-dark theme-large"
     * />
     * 
     * // Add responsive classes
     * <DayTimeline
     *   onChange={handleChange}
     *   className="md:max-w-2xl lg:max-w-4xl"
     * />
     * ```
     */
    className?: string;

    /**
     * Time interval in minutes for the timeline slots.
     * Controls the granularity of the timeline and the minimum duration of time slots.
     *
     * @default 30
     *
     * @example
     * ```tsx
     * // Half-hour intervals (default)
     * <DayTimeline
     *   onChange={handleChange}
     *   interval={30}
     * />
     *
     * // One-hour intervals
     * <DayTimeline
     *   onChange={handleChange}
     *   interval={60}
     * />
     * ```
     */
    interval?: 30 | 60;
    date?: Date;
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
                    const newPeriod = {
                        start: 24 - (selected.end - selected.start),
                        end: 24,
                    };
                    setSelected(newPeriod);
                    onChange(timeValuesToDatePeriod(newPeriod, date));
                } else {
                    const newPeriod = {
                        start: value,
                        end: newEnd,
                    };

                    setSelected(newPeriod);
                    onChange(timeValuesToDatePeriod(newPeriod, date));
                }
            } else {
                const newPeriod = { start: value, end: value + interval / 60 };

                setSelected(newPeriod);
                onChange(timeValuesToDatePeriod(newPeriod, date));
            }
        },
        [date, interval, onChange, selected],
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
    }, [
        timeslotHeight,
        timeLabels,
        businessHours,
        interval,
        intervalValue,
        handleClick,
    ]);

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
                            date={date}
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
