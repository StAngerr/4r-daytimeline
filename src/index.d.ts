declare module '4r-daytimeline' {
    export interface Period {
        startTime: string;
        endTime: string;
        title?: string;
        id?: string | number;
    }

    export interface DayTimelineProps {
        periods?: Period[];
        onChange?: (periods: Period[]) => void;
        readonly?: boolean;
    }

    export const DayTimeline: React.FC<DayTimelineProps>;
} 