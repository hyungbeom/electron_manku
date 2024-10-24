import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export default function KeepScroll(){

    const router = useRouter()

    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        // 페이지 이동 전에 스크롤 위치 저장
        const handleRouteChangeStart = () => {
            setScrollPosition(window.scrollY);
        };

        // 페이지 이동 후에 스크롤 위치 복원
        const handleRouteChangeComplete = () => {
            window.scrollTo(0, scrollPosition);
        };

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        // 이벤트 리스너 정리
        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
    }, [router.events, scrollPosition]);

    return <></>
}