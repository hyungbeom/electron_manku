import React, {useEffect, useRef} from "react";

export default function useEventListener(eventName: string, handler: any, element: any) {
    const savedHandler = useRef();

        useEffect(() => {
            if (typeof window !== 'undefined') {
                savedHandler.current = handler;
            }
        }, [handler]);

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const isSupported = element && element.addEventListener;
                if (!isSupported) return;

                // @ts-ignore
                const eventListener = (event: any) => savedHandler.current(event);
                element.addEventListener(eventName, eventListener);

                return () => {
                    element.removeEventListener(eventName, eventListener);
                };
            }

        }, [eventName, element]);

}
