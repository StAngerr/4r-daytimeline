import { EffectCallback, useEffect, useRef } from 'react';

export const useAfterMountEffect = (
    cb: EffectCallback,
    deps: Array<unknown>,
) => {
    const mounted = useRef<boolean>(false);

    useEffect(() => {
        if (mounted.current) {
            cb();
        }
    }, [...deps]);

    useEffect(() => {
        mounted.current = true;
    }, []);
};
