import { PeriodValues, SegmentedPartConfig } from '../DayTimeline.types.ts';
import { NewPeriod, Props as NewPeriodProps } from '../NewPeriod/NewPeriod.tsx';
import { useCallback, useEffect, useState } from 'react';
import { minutesToTimeValue } from '../../utils/period.utils.ts';
import { isDefined } from '../../utils/validation.utils.ts';

interface Props extends NewPeriodProps {
    segmentedParts: SegmentedPartConfig;
}

const PartsIds = {
    start: 'part-start',
    mid: 'part-mid',
    end: 'part-end',
};
const noUndefinedFilter = (i: object | undefined | unknown) =>
    typeof i !== 'undefined';

type PartsState = (PeriodValues & { editable?: boolean })[];

export const SegmentedPeriod = ({
    segmentedParts,
    ...newPeriodProps
}: Props) => {
    const [parts, setParts] = useState<PartsState>([]);

    const handleChange = useCallback(
        ({ id, start, end }: PeriodValues) => {
            const prevStart = parts.find((i) => i.id === PartsIds.start);
            const prevMid = parts.find((i) => i.id === PartsIds.mid)!;
            const prevEnd = parts.find((i) => i.id === PartsIds.end);

            let newParts: PartsState = parts.map((i) =>
                i.id === id ? { ...i, start, end } : i,
            );

            if (prevStart && id === PartsIds.start && end !== prevStart.end) {
                const diff = prevStart.end - end;
                const newMid = { ...prevMid, start: prevMid.start - diff };

                if (
                    newMid.end - newMid.start <
                    minutesToTimeValue(newPeriodProps.interval)
                )
                    return;

                newParts = [{ ...prevStart, end }, newMid, prevEnd].filter(
                    noUndefinedFilter,
                ) as PartsState;
            } else if (
                prevEnd &&
                id === PartsIds.end &&
                start !== prevEnd.start
            ) {
                const diff = prevEnd.start - start;
                const newMid = { ...prevMid, end: prevMid.end - diff };
                if (
                    newMid.end - newMid.start <
                    minutesToTimeValue(newPeriodProps.interval)
                )
                    return;

                newParts = [prevStart, newMid, { ...prevEnd, start }].filter(
                    noUndefinedFilter,
                ) as PartsState;
            } else if (
                id === PartsIds.mid &&
                // No need to run checks if there is only one middle part
                !parts.every((i) => i.id === PartsIds.mid)
            ) {
                if (prevMid.start !== start && prevStart) {
                    const diff = prevMid.start - start;
                    if (prevStart.start - diff < 0) return;
                    newParts = [
                        {
                            ...prevStart,
                            start: prevStart.start - diff,
                            end: prevStart.end - diff,
                        },
                        { ...prevMid, start, end },
                        prevEnd,
                    ].filter(noUndefinedFilter) as PartsState;
                } else if (prevMid.start !== start && !prevStart) {
                    newParts = [
                        prevStart,
                        { ...prevMid, start, end },
                        prevEnd,
                    ].filter(noUndefinedFilter) as PartsState;
                } else if (prevMid.end !== end && prevEnd) {
                    const diff = prevMid.end - end;

                    if (prevEnd.end - diff > 24) return;

                    newParts = [
                        prevStart,
                        { ...prevMid, start, end },
                        {
                            ...prevEnd,
                            start: prevEnd.start - diff,
                            end: prevEnd.end - diff,
                        },
                    ].filter(noUndefinedFilter) as PartsState;
                } else if (prevMid.end !== end) {
                    newParts = [
                        prevStart,
                        { ...prevMid, start, end },
                        prevEnd,
                    ].filter(noUndefinedFilter) as PartsState;
                }
            }
            setParts(newParts);
            newPeriodProps.onChange({
                start: newParts[0].start,
                end: newParts[newParts?.length - 1].end,
            });
        },
        [parts, newPeriodProps.interval, newPeriodProps.onChange],
    );

    useEffect(() => {
        let start,
            end = undefined;
        const { startMinutes, endMinutes } = segmentedParts;
        const { start: selectedStart, end: selectedEnd } =
            newPeriodProps.selected;
        const actualSelected = { start: selectedStart, end: selectedEnd };

        if (startMinutes) {
            const startValue = minutesToTimeValue(startMinutes.period);
            start = {
                id: PartsIds.start,
                start: selectedStart,
                end: selectedStart + startValue,
                editable: noUndefinedFilter(startMinutes.editable)
                    ? startMinutes.editable
                    : true,
            };
            actualSelected.start += startValue;
        }
        if (endMinutes) {
            const endValue = minutesToTimeValue(endMinutes.period);
            end = {
                id: PartsIds.end,
                start: selectedEnd - endValue,
                end: selectedEnd,
                editable: noUndefinedFilter(endMinutes.editable)
                    ? endMinutes.editable
                    : true,
            };
            actualSelected.end -= endValue;
        }

        setParts(
            [
                start,
                { ...actualSelected, id: PartsIds.mid, editable: true },
                end,
            ].filter(isDefined),
        );
    }, [segmentedParts, newPeriodProps.selected]);

    return (
        <div>
            {parts.map((part) => (
                <NewPeriod
                    {...newPeriodProps}
                    className={'segmented-resize'}
                    selected={part}
                    onChange={handleChange}
                    editable={part.editable}
                />
            ))}
        </div>
    );
};
