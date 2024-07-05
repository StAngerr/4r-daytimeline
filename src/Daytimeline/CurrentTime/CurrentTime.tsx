import { useEffect, useMemo, useState } from 'react';
import { CurrentTimeSettings } from '../DayTimeline.types.ts';
import { calculateCurrentTimeTop } from '../../utils/period.utils.ts';
import { buildTimeLabel } from '../../utils/format.utils.ts';

interface Props {
    currentTime?: CurrentTimeSettings;
    timeslotHeight: number;
    interval: number;
}

interface CurrentTimeState {
    position: number;
    timeLabel: string;
}

export const CurrentTime = ({
    currentTime,
    timeslotHeight,
    interval,
}: Props) => {
    const [{ position, timeLabel }, setState] = useState<CurrentTimeState>({
        position: 0,
        timeLabel: '00:00',
    });

    const currentTimeLabel = useMemo(() => {
        if (currentTime?.showTime)
            return <span className={'current-time-label'}>{timeLabel}</span>;

        return null;
    }, [currentTime, timeLabel]);

    useEffect(() => {
        if (currentTime?.showTime) {
            const update = () => {
                const hours = new Date().getHours();
                const minutes = new Date().getMinutes();

                setState({
                    position: calculateCurrentTimeTop(
                        hours,
                        minutes,
                        timeslotHeight,
                        interval,
                    ),
                    timeLabel: buildTimeLabel(hours, minutes),
                });
            };
            update();
            const updateInterval = setInterval(update, 60000);

            return () => {
                clearInterval(updateInterval);
            };
        }
    }, [currentTime, timeslotHeight, interval]);

    if (!currentTime || !currentTime.showTime) return null;

    return (
        <div className={'current-time'} style={{ top: `${position}px` }}>
            {currentTimeLabel}
        </div>
    );
};
