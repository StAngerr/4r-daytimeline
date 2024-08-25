import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
    roundDownToInterval,
    roundUpToInterval,
    timeValuesToDatePeriod,
    timeValueToTimeUnits,
} from '../../utils/period.utils.ts';
import {
    BusinessHoursPeriod,
    DragDirection,
    Period as PeriodType,
    PeriodValues,
} from '../DayTimeline.types.ts';
import { isMultipleOf } from '../../utils/validation.utils.ts';
import { Period } from '../Period/Period.tsx';
import { toClasses } from '../../utils/general.ts';

export interface Props {
    timeslotHeight: number;
    interval: number;
    intervalValue: number;
    selectedComponent?: React.ComponentType<{ selected: PeriodType }>;
    startEndHours: BusinessHoursPeriod;
    selected: PeriodValues;
    onChange: (newPeriod: PeriodValues) => void;
    date: Date;
    className?: string;
    editable?: boolean;
}

export const NewPeriod = ({
    onChange,
    interval,
    startEndHours,
    selectedComponent: SelectedComp,
    timeslotHeight: STEP,
    intervalValue,
    editable = true,
    className,
    selected,
    date,
}: Props) => {
    const isResizing = useRef(false);
    const divRef = useRef<HTMLDivElement | null>(null);
    const moveState = useRef<{
        side: DragDirection;
    } | null>(null);
    const doResizeCb =
        useRef<(clientY: number, toTopDirection: boolean) => void>();

    const startResize = (direction: DragDirection) => {
        isResizing.current = true;
        moveState.current = {
            side: direction,
        };
    };

    //TODO think of splitting this function into smaller
    const doResize = useCallback(
        (clientY: number, toTopDirection: boolean) => {
            if (!divRef.current) return;
            if (moveState.current!.side === 'top') {
                const divElement = divRef.current;
                const currentTop = parseFloat(divElement.style.top);
                const { top, bottom } = divElement.getBoundingClientRect();

                // upper part drag to top
                if (toTopDirection && clientY < top && currentTop - STEP >= 0) {
                    onChange({
                        ...selected,
                        start: isMultipleOf(selected.start, intervalValue)
                            ? selected.start - intervalValue
                            : roundDownToInterval(
                                  selected.start,
                                  intervalValue,
                              ),
                    });
                }
                // upper part drag to bottom
                else if (
                    !toTopDirection &&
                    clientY > top + STEP &&
                    top + STEP < bottom
                ) {
                    onChange({
                        ...selected,
                        start: isMultipleOf(selected.start, intervalValue)
                            ? selected.start + intervalValue
                            : roundUpToInterval(selected.start, intervalValue),
                    });
                }
            } else if (moveState.current!.side === 'bottom') {
                const divElement = divRef.current;
                const currentBottom = parseFloat(divElement.style.bottom);
                const { bottom, top } = divElement.getBoundingClientRect();

                // bottom part drag to bottom
                if (
                    !toTopDirection &&
                    clientY > bottom &&
                    currentBottom - STEP >= 0
                ) {
                    onChange({
                        ...selected,
                        end: isMultipleOf(selected.end, intervalValue)
                            ? selected.end + intervalValue
                            : roundUpToInterval(selected.end, intervalValue),
                    });
                }
                // bottom part drag to top
                else if (
                    toTopDirection &&
                    clientY < bottom &&
                    bottom - STEP > top
                ) {
                    onChange({
                        ...selected,
                        end: isMultipleOf(selected.end, intervalValue)
                            ? selected.end - intervalValue
                            : roundDownToInterval(selected.end, intervalValue),
                    });
                }
            }
        },
        [STEP, intervalValue, selected, onChange],
    );
    //TODO implement date + values
    const original = useMemo((): PeriodType => {
        const selectedStart = timeValueToTimeUnits(selected.start);
        const selectedEnd = timeValueToTimeUnits(selected.start);
        const startDate = new Date(date);
        const endDate = new Date(date);

        startDate.setHours(selectedStart[0]);
        startDate.setMinutes(selectedStart[1]);
        endDate.setHours(selectedEnd[0]);
        endDate.setMinutes(selectedEnd[1]);
        return {
            start: startDate,
            end: endDate,
        };
    }, [date, selected]);

    const stopResize = () => {
        isResizing.current = false;
    };

    useEffect(() => {
        doResizeCb.current = doResize;
    }, [doResize]);

    useEffect(() => {
        const handleMouseMove = () => {
            let prev: number = 0;
            let prevDirection: boolean = false;

            return (e: MouseEvent) => {
                if (isResizing.current) {
                    const newDirection =
                        e.clientY === prev ? prevDirection : e.clientY <= prev;
                    doResizeCb.current!(e.clientY, newDirection);
                    prev = e.clientY;
                    prevDirection = newDirection;
                } else if (prev !== 0) {
                    prev = 0;
                }
            };
        };
        const handleMouseUp = () => {
            stopResize();
        };

        document.addEventListener('mousemove', handleMouseMove());
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <Period
            original={original}
            timeslotHeight={STEP}
            ref={divRef}
            period={selected}
            date={date}
            className={toClasses(className, 'new-period')}
            interval={interval}
            startEndHours={startEndHours}
            selectedComponent={() => {
                return (
                    <>
                        {editable && (
                            <div
                                className={'resize-top'}
                                onMouseUp={stopResize}
                                onMouseDown={() => startResize('top')}
                            ></div>
                        )}
                        {SelectedComp && (
                            <SelectedComp
                                selected={timeValuesToDatePeriod(
                                    selected,
                                    date,
                                )}
                            />
                        )}
                        {editable && (
                            <div
                                className={'resize-bottom'}
                                onMouseUp={stopResize}
                                onMouseDown={() => startResize('bottom')}
                            ></div>
                        )}
                    </>
                );
            }}
        />
    );
};
