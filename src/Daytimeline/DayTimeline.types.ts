import React from 'react';
import { hours } from './DayTimeline.constants.ts';

export interface Period {
    start: Date;
    end: Date;
    layer?: number;
    id?: string | number;
}

export interface CurrentTimeSettings {
    formatTime?: string;
    component?: React.Component;
    showTime?: boolean;
    showLine?: boolean;
}

export interface TimeLabelsSettings {
    component?: React.FunctionComponent;
    position?: 'left' | 'right';
}

export interface PeriodValues {
    start: number;
    end: number;
}

export type DragDirection = 'top' | 'bottom';

export interface BusinessHoursPeriod {
    start: (typeof hours)[number];
    end: (typeof hours)[number] | 24;
}
