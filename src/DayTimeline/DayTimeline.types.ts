import React from 'react';
import { hours } from './DayTimeline.constants';

export interface Period {
    start: Date;
    end: Date;
    layer?: number;
    id?: string | number;
}

export interface CurrentTimeSettings {
    //TODO not implemented
    formatTime?: string;
    component?: React.ComponentType<{ timeLabel: string }>;
    showTime?: boolean;
    showLine?: boolean;
}

export interface TimeLabelsSettings {
    component?: (hour: number) => React.ReactElement;
    position?: 'left' | 'right';
}

export interface PeriodValues {
    start: number;
    end: number;
    id?: string | number;
}

export type DragDirection = 'top' | 'bottom';

export interface BusinessHoursPeriod {
    start: (typeof hours)[number];
    end: (typeof hours)[number] | 24;
}

//TODO implement all props
interface Segment {
    editableStart?: boolean;
    editableEnd?: boolean;
    period: Period | [number, number] | [string, string];
    styles?: React.CSSProperties;
    component?: React.ComponentType;
}

interface PartSegment
    extends Omit<Segment, 'period' | 'editableEnd' | 'editableStart'> {
    period: number;
    editable?: boolean;
}

export interface SegmentedPartConfig {
    startMinutes?: PartSegment;
    endMinutes?: PartSegment;
    //TODO think of implementing those as well
    firstIntervals?: number;
    endIntervals?: number;
}

export interface SegmentedConfig {
    period: Period | [number, number] | [string, string];
    segments: Segment[];
}
