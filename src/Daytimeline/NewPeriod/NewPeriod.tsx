import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { timeValueToBottomPosition, timeValueToTopPosition } from '../utils.ts';
import { DragDirection, PeriodValues } from '../DayTimeline.types.ts';

interface Props {
    timeslotHeight: number;
    interval: number;
    selected: { start: number; end: number };
    onChange?: (newPeriod: PeriodValues) => void;
}

export const NewPeriod = ({
    onChange,
    interval,
    timeslotHeight: STEP,
    selected: defaultPeriod,
}: Props) => {
    const [selected, setSelectedPeriod] = useState<PeriodValues>(defaultPeriod);
    const [defaultPosition] = useState({
        top:
            timeValueToTopPosition(defaultPeriod?.start, STEP, interval) ||
            'none',
        bottom:
            timeValueToBottomPosition(defaultPeriod?.end, STEP, interval) ||
            'none',
    });
    const isResizing = useRef(false);
    const divRef = useRef<HTMLDivElement | null>(null);
    const isFirstRender = useRef(true);
    const moveState = useRef<{
        side: DragDirection;
    } | null>(null);

    const startResize = (direction: DragDirection) => {
        isResizing.current = true;
        moveState.current = {
            side: direction,
        };
    };

    const intervalValue = useMemo(() => interval / 60, [interval]);

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
                    divElement.style.top = currentTop - STEP + 'px';
                    setSelectedPeriod((prev: PeriodValues) => ({
                        ...prev,
                        start: prev.start - intervalValue,
                    }));
                }
                // upper part drag to bottom
                else if (
                    !toTopDirection &&
                    clientY > top + STEP &&
                    top + STEP < bottom
                ) {
                    divElement.style.top = currentTop + STEP + 'px';
                    setSelectedPeriod((prev) => ({
                        ...prev,
                        start: prev.start + intervalValue,
                    }));
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
                    divElement.style.bottom = currentBottom - STEP + 'px';
                    setSelectedPeriod((prev) => ({
                        ...prev,
                        end: prev.end + intervalValue,
                    }));
                }
                // bottom part drag to top
                else if (
                    toTopDirection &&
                    clientY < bottom &&
                    bottom - STEP > top
                ) {
                    divElement.style.bottom = currentBottom + STEP + 'px';
                    setSelectedPeriod((prev: PeriodValues) => ({
                        ...prev,
                        end: prev.end - intervalValue,
                    }));
                }
            }
        },
        [STEP, intervalValue],
    );

    const stopResize = () => {
        isResizing.current = false;
    };

    useEffect(() => {
        const handleMouseMove = () => {
            let prev: number = 0;
            let prevDirection: boolean = false;

            return (e: MouseEvent) => {
                if (isResizing.current) {
                    const newDirection =
                        e.clientY === prev ? prevDirection : e.clientY <= prev;
                    doResize(e.clientY, newDirection);
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
        if (!isFirstRender.current) onChange && selected && onChange(selected);
        else isFirstRender.current = false;
    }, [onChange, selected]);

    return (
        <>
            <div
                ref={divRef}
                style={defaultPosition}
                className={'day-timeline-new-period'}
            >
                <div
                    className={'resize-top'}
                    onMouseUp={stopResize}
                    onMouseDown={() => startResize('top')}
                ></div>
                <div
                    className={'resize-bottom'}
                    onMouseUp={stopResize}
                    onMouseDown={() => startResize('bottom')}
                ></div>
            </div>
        </>
    );
};
