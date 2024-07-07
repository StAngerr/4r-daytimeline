import { timeValueToTimeUnits } from './period.utils.ts';

export const hoursLeadingZero = (val: number) => (val < 10 ? '0' + val : val);

export function buildTimeLabel(timeValue: number): string;
export function buildTimeLabel(hours: number, minutes: number): string;
export function buildTimeLabel(first: number, second?: number): string {
    if (!second) {
        const [hour, minutes] = timeValueToTimeUnits(first);

        return `${hoursLeadingZero(hour)}:${hoursLeadingZero(minutes)}`;
    }
    return `${hoursLeadingZero(first)}:${hoursLeadingZero(second)}`;
}
