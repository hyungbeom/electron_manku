import MobileMenu from "@/component/homepage/MobileMenu";
import React, {useState} from "react";
import MFooter from "@/component/homepage/MFooter";
import Spin from "antd/lib/spin";
import Image from "next/image";
import Header from "@/component/homepage/Header";
import {wrapper} from "@/store/store";
import Footer from "@/component/homepage/Footer";

export default function mro({isMobile}){
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

    return <Spin spinning={isLoading}>

        {isMobile ? <MobileMenu/> : <Header/>}

            <Image
                src={isMobile ? "/homepage/mobile/partners.svg" : '/homepage/mro.svg'} // 이미지 경로
                alt="Partners"
                layout="intrinsic" // 비율을 유지하며 원래 크기로 표시
                width={800} // 이미지의 원래 너비
                height={600} // 이미지의 원래 높이
                style={{
                    width: "100%", // 부모 컨테이너의 너비에 맞게 설정
                    padding: `${isMobile ? 130 : 170}px 0px 110px 0px`, // 여백 추가
                    transition: "opacity 0.5s ease",
                    opacity: isLoading ? 0 : 1,
                }}
                onLoadingComplete={() => setIsLoading(false)} // 로딩 완료 시 로딩 상태 해제
            />

        {!isLoading ? (isMobile ? <MFooter/> : <Footer/>) : <></>}
    </Spin>
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const userAgent = ctx.req.headers["user-agent"] || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent); // 모바일 디바이스 감지

    return {
        props: {
            isMobile, // 모바일 여부를 클라이언트에 전달
        },
    };

})
