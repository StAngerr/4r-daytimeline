import { EffectCallback, useEffect, useRef } from 'react';

export const useAfterMountEffect = (
    cb: EffectCallback,
    deps: Array<unknown>,
) => {
    const mounted = useRef<boolean>(false);

    useEffect(() => {
        if (mounted.current) {
            console.log('After mount cb is called');
            cb();
        }
    }, [...deps]);

    useEffect(() => {
        console.log('After mount main useEffect is called');
        mounted.current = true;
    }, []);
};
