import { useEffect, useMemo, useState } from 'react';
import { BusinessHoursPeriod, CurrentTimeSettings } from '../DayTimeline.types';
import { calculateCurrentTimeTop } from '../../utils/period.utils';
import { buildTimeLabel } from '../../utils/format.utils';
import {
    DEFAULT_BUSINESS_END_HOUR,
    DEFAULT_BUSINESS_START_HOUR,
} from '../DayTimeline.constants';

interface Props {
    currentTime?: CurrentTimeSettings;
    timeslotHeight: number;
    interval: number;
    businessHours?: boolean | BusinessHoursPeriod;
}

interface CurrentTimeState {
    position: number;
    timeLabel: string;
}

export const CurrentTime = ({
    currentTime,
    timeslotHeight,
    businessHours,
    interval,
}: Props) => {
    const [{ position, timeLabel }, setState] = useState<CurrentTimeState>({
        position: 0,
        timeLabel: '00:00',
    });

    const businessHoursAsPeriod: BusinessHoursPeriod | null = useMemo(() => {
        if (!businessHours) return null;
        if (typeof businessHours === 'boolean')
            return {
                start: DEFAULT_BUSINESS_START_HOUR,
                end: DEFAULT_BUSINESS_END_HOUR,
            };

        return businessHours;
    }, [businessHours]);

    const currentTimeLabel = useMemo(() => {
        if (currentTime?.component) {
            const CustomComponent = currentTime?.component;
            return <CustomComponent timeLabel={timeLabel} />;
        }
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
                        businessHoursAsPeriod,
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
    }, [currentTime, timeslotHeight, interval, businessHoursAsPeriod]);

    if (!currentTime || !currentTime.showTime) return null;

    return (
        <div className={'current-time'} style={{ top: `${position}px` }}>
            {currentTimeLabel}
        </div>
    );
};
