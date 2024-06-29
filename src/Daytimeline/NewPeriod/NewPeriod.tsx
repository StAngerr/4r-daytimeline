import React, { useRef, useEffect } from 'react';

type DragDirection = 'top' | 'bottom';

interface Props {
    timeslotHeight: number;
    onResize: (e: DragDirection) => void;
}

export const NewPeriod = ({ onResize, timeslotHeight: STEP }: Props) => {
    const isResizing = useRef(false);
    const divRef = useRef<HTMLDivElement | null>(null);
    const moveState = useRef<{
        side: DragDirection;
    } | null>(null);

    const startResize = (direction: DragDirection) => {
        isResizing.current = true;
        moveState.current = {
            side: direction,
        };
    };

    const doResize = (clientY: number, toTopDirection: boolean) => {
        if (!divRef.current) return;

        if (moveState.current!.side === 'top') {
            const divElement = divRef.current;
            const currentTop = parseFloat(divElement.style.top);
            const { top, bottom } = divElement.getBoundingClientRect();

            // upper part drag to top
            if (toTopDirection && clientY < top && currentTop - STEP >= 0) {
                divElement.style.top = currentTop - STEP + 'px';
            }
            // upper part drag to bottom
            else if (
                !toTopDirection &&
                clientY > top + STEP &&
                top + STEP < bottom
            ) {
                divElement.style.top = currentTop + STEP + 'px';
            }
        } else if (moveState.current!.side === 'bottom') {
            const divElement = divRef.current;
            const currentBottom = parseFloat(divElement.style.bottom);
            const { bottom, top } = divElement.getBoundingClientRect();

            // bottom part drag to
            if (
                !toTopDirection &&
                clientY > bottom &&
                currentBottom - STEP >= 0
            ) {
                divElement.style.bottom = currentBottom - STEP + 'px';
            }
            // bottom part drag to top
            else if (
                toTopDirection &&
                clientY < bottom &&
                bottom - STEP > top
            ) {
                divElement.style.bottom = currentBottom + STEP + 'px';
            }
        }
    };

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

    return (
        <div
            ref={divRef}
            style={{
                top: 10 * STEP + 'px',
                bottom: 37 * STEP + 'px',
            }}
            className={'day-timeline-new-period'}
        >
            <div
                className={'resize-top'}
                onMouseUp={stopResize}
                onMouseDown={(e) => {
                    console.log(e);
                    startResize('top');
                }}
            ></div>
            <div
                className={'resize-bottom'}
                onMouseUp={stopResize}
                onMouseDown={() => startResize('bottom')}
            ></div>
        </div>
    );
};
