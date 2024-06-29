import React from "react";

export interface Period {
    start: Date;
    end: Date;
    id?: string | number;
}


export interface CurrentTimeSettings {
    formatTime?: string;
    component?: React.Component;
    showTime?: boolean;
    showLine?: boolean;
}

export interface TimeLabelsSettings {
    component?: React.Component;
    position?: 'left' | 'right';
}