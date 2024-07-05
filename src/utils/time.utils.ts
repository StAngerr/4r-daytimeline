export const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

export const roundToEndOfTheDay = (date: Date) => {
    const clone = new Date(date.getTime());
    clone.setHours(23);
    clone.setMinutes(59);
    clone.setSeconds(0);
    return clone;
};

export const roundToStartOfTheDay = (date: Date) => {
    const clone = new Date(date.getTime());
    clone.setHours(0);
    clone.setMinutes(1);
    clone.setSeconds(0);
    return clone;
};

export const isDateInRange = (target: Date, start: Date, end: Date) =>
    target >= start && target <= end;
