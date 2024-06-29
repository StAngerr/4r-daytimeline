const hoursLeadingZero = (val: number) => (val < 10 ? '0' + val : val);

// Accepts decimal values like 0.25 - 15min, 0.5 - 30m, 0.75 - 45min
const valueToMin = (val: number) => 60 * val;

// TODO think of formats as H-0-23 HH(leading zero)-00-23 h - 1-12 hh(leading zero)-1-12, m mm
export const toTimeLabel = (i: number, format = '') => {
    const [hour] = i.toString().split('.');

    return `${hoursLeadingZero(+hour)}:${hoursLeadingZero(valueToMin(i - +hour))}`;
};
