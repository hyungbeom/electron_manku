import {useEffect, useState} from "react";

export default function ReceiveComponent({searchInfo}){
    const [popupData, setPopupData] = useState<string | null>(null);
    // 메시지 이벤트 리스너
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // 안전한 출처 확인
            if (event.origin !== window.location.origin) {
                console.error("Untrusted origin:", event.origin);
                return;
            }

           if(event.data){
               searchInfo(false)
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