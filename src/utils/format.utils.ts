export const hoursLeadingZero = (val: number) => (val < 10 ? '0' + val : val);
// TODO think of formats as H-0-23 HH(leading zero)-00-23 h - 1-12 hh(leading zero)-1-12, m mm
// @ts-ignore
export const toTimeLabel = (i: number, format = '') => {
    const [hour] = i.toString().split('.');

    return `${hoursLeadingZero(+hour)}:${hoursLeadingZero((i - +hour) * 60)}`;
};

export const buildTimeLabel = (hours: number, minutes: number) => {
    return `${hoursLeadingZero(hours)}:${hoursLeadingZero(minutes)}`;
};
