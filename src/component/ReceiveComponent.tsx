import {useEffect, useState} from "react";

export default function ReceiveComponent({searchInfo, componentName}) {

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // 안전한 출처 확인
            if (event.origin !== window.location.origin) {
                console.error("Untrusted origin:", event.origin);
                return;
            }

            // 기존 로직은 모든 페이지 재조회가 되므로 안쓰게 변경
            // if (event.data) {
            //     if (event.data === 'write' || event.data === 'update' || event.data === 'delete') {
            //         searchInfo(true);
            //     }
            // }

            if (!Object.keys(event.data ?? {}).length) {
                console.warn("event data 없음")
                return;
            }

            const { message, target } = event.data;
            if (message === 'reload') {
                if (target === componentName) searchInfo(true);
            }
        };

        window.addEventListener("message", handleMessage);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <>
        </>
    );

}