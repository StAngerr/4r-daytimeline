import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    roundDownToInterval,
    roundUpToInterval,
    timeValuesToDatePeriod,
    timeValueToBottomPosition,
    timeValueToTopPosition,
} from '../../utils/period.utils.ts';
import {
    BusinessHoursPeriod,
    DragDirection,
    Period,
    PeriodValues,
} from '../DayTimeline.types.ts';
import { isMultipleOf } from '../../utils/validation.utils.ts';
import { toClasses } from '../../utils/general.ts';

export interface Props {
    timeslotHeight: number;
    interval: number;
    intervalValue: number;
    selectedComponent?: React.ComponentType<{ selected: Period }>;
    startEndHours: BusinessHoursPeriod;
    selected: PeriodValues;
    onChange: (newPeriod: PeriodValues) => void;
    date: Date;
    className?: string;
    editable?: boolean;
}

//TODO think if its possible to reuse this compoennt as base for NewPeriod due to repeatable content
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
    const [placement, setPlacement] = useState({
        top: timeValueToTopPosition(
            selected.start - startEndHours.start,
            STEP,
            interval,
        ),
        bottom: timeValueToBottomPosition(
            startEndHours.end - selected?.end,
            STEP,
            interval,
        ),
    });
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
                    //divElement.style.top = currentTop - STEP + 'px';

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
                    //divElement.style.top = currentTop + STEP + 'px';

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
                    //divElement.style.bottom = currentBottom - STEP + 'px';

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
                    //divElement.style.bottom = currentBottom + STEP + 'px';'

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

    useEffect(() => {
        if (selected) {
            setPlacement({
                top: timeValueToTopPosition(
                    selected?.start - startEndHours.start,
                    STEP,
                    interval,
                ),
                bottom: timeValueToBottomPosition(
                    startEndHours.end - selected?.end,
                    STEP,
                    interval,
                ),
            });
        }
    }, [selected, STEP, interval, startEndHours]);

    return (
        <>
            <div
                ref={divRef}
                style={placement}
                className={toClasses(
                    'day-timeline-period new-period',
                    className,
                )}
            >
                {editable && (
                    <div
                        className={'resize-top'}
                        onMouseUp={stopResize}
                        onMouseDown={() => startResize('top')}
                    ></div>
                )}
                {SelectedComp && (
                    <SelectedComp
                        selected={timeValuesToDatePeriod(selected, date)}
                    />
                )}
                {editable && (
                    <div
                        className={'resize-bottom'}
                        onMouseUp={stopResize}
                        onMouseDown={() => startResize('bottom')}
                    ></div>
                )}
            </div>
        </>
    );
};
