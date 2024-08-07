export const toClasses = (...ar: Array<string | undefined | boolean>) =>
    ar.filter((i) => i).join(' ');
