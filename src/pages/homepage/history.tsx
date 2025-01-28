import MobileMenu from "@/component/homepage/MobileMenu";
import React, {useState} from "react";
import MFooter from "@/component/homepage/MFooter";
import Image from "next/image";
import Spin from "antd/lib/spin";

export default function history(){
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

    return  <Spin spinning={isLoading}>

        <MobileMenu/>
        {/*<img src={'/homepage/mobile/history.svg'} style={{paddingTop : 130, width : '100%'}} alt=""/>*/}
        <Image
            src="/homepage/mobile/history.svg" // 이미지 경로
            alt="Partners"
            layout="intrinsic" // 비율을 유지하며 원래 크기로 표시
            width={800} // 이미지의 원래 너비
            height={600} // 이미지의 원래 높이
            style={{
                width: "100%", // 부모 컨테이너의 너비에 맞게 설정
                padding: "130px 0px 110px 0px", // 여백 추가
                transition: "opacity 0.5s ease",
                opacity: isLoading ? 0 : 1,
            }}
            onLoadingComplete={() => setIsLoading(false)} // 로딩 완료 시 로딩 상태 해제
        />
        {!isLoading ? <MFooter/> : <></>}
    </Spin>
}