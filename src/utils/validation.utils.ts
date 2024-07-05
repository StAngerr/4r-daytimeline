export const isValidNumberTuple = (
    input: [unknown, unknown],
): input is [number, number] => {
    const [start, end] = input;
    const isNumbers = typeof start === 'number' && typeof end === 'number';
    return (
        isNumbers &&
        start < 24 &&
        start >= 0 &&
        end > 0 &&
        end <= 24 &&
        start < end
    );
};
export const isValidTimeString = (timeString: string) => {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(timeString);
};
export const isValidStringTuple = (
    input: [unknown, unknown],
): input is [string, string] => {
    const [start, end] = input;
    const isStrings = typeof start === 'string' && typeof end === 'string';

    return isStrings && isValidTimeString(start) && isValidTimeString(end);
};
