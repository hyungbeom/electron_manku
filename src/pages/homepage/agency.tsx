import MobileMenu from "@/component/homepage/MobileMenu";
import React, {useState} from "react";
import MFooter from "@/component/homepage/MFooter";
import Spin from "antd/lib/spin";
import Image from "next/image";
import Header from "@/component/homepage/Header";
import {wrapper} from "@/store/store";
import Footer from "@/component/homepage/Footer";
import styled from "styled-components";

export default function agency({isMobile}) {
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

    return <Spin spinning={isLoading}>

        {isMobile ? <MobileMenu/> : <Header/>}

        <Image
            src={isMobile ? "/homepage/mobile/partners.svg" : '/homepage/agency.svg'} // 이미지 경로
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


        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24}}>
            <div style={{border: '1px solid lightGray'}}>
                <div style={{
                    backgroundColor: '#F7F7F7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src={'/homepage/agency/koenig.svg'} alt=""/>
                </div>
                <div style={{padding: 30}}>
                    <div style={{fontSize: 18, color: '#173F95', fontWeight: 600}}>KOENIG Engineering</div>
                    <ClampText>1985년에 창립되어 터닝기어 및 가스터빈 기동 시스템을 설계하고 공급하는 전문성을 가지고 있습니다.
                        혁신적인 기술을 토대로 고객 맞춤형 설계를 지원하며 신규 설치, 개조를 위한 운영조건을 충족할 수 있도록 고객에게 제공합니다. 또한 공급된 제품에 대한 글로벌 지원 및
                        서비스를
                        통해 전 세계적으로 품질의 우수성 및 기술력을 인정 받고 있습니다. 현재까지 전 세계에 약 1,000대 이상 공급한 풍부한 경험이 있으며 이는 우수한 신뢰성을 입증합니다.
                    </ClampText>
                    <div style={{display: 'grid', gridTemplateColumns: '13px auto', gap: 7, paddingTop: 20}}>
                        <img src={'/homepage/marker.svg'} width={'100%'} alt=""/>
                        <div>
                            700 Fox Chase Road <br/>
                            Coatesville, PA 19320 <br/>
                            USA <br/>
                            +1.610.423.6600 <br/>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{border: '1px solid lightGray'}}>
                <div style={{
                    backgroundColor: '#F7F7F7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src={'/homepage/agency/daiichi.svg'} alt=""/>
                </div>
                <div style={{padding: 30}}>
                    <div style={{fontSize: 18, color: '#173F95', fontWeight: 600}}>KOENIG Engineering</div>
                    <ClampText>1985년에 창립되어 터닝기어 및 가스터빈 기동 시스템을 설계하고 공급하는 전문성을 가지고 있습니다.
                        혁신적인 기술을 토대로 고객 맞춤형 설계를 지원하며 신규 설치, 개조를 위한 운영조건을 충족할 수 있도록 고객에게 제공합니다. 또한 공급된 제품에 대한 글로벌 지원 및
                        서비스를
                        통해 전 세계적으로 품질의 우수성 및 기술력을 인정 받고 있습니다. 현재까지 전 세계에 약 1,000대 이상 공급한 풍부한 경험이 있으며 이는 우수한 신뢰성을 입증합니다.
                    </ClampText>
                    <div style={{display: 'grid', gridTemplateColumns: '13px auto', gap: 7, paddingTop: 20}}>
                        <img src={'/homepage/marker.svg'} width={'100%'} alt=""/>
                        <div>
                            700 Fox Chase Road <br/>
                            Coatesville, PA 19320 <br/>
                            USA <br/>
                            +1.610.423.6600 <br/>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{border: '1px solid lightGray'}}>
                <div style={{
                    backgroundColor: '#F7F7F7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src={'/homepage/agency/dst.svg'} alt=""/>
                </div>
                <div style={{padding: 30}}>
                    <div style={{fontSize: 18, color: '#173F95', fontWeight: 600}}>KOENIG Engineering</div>
                    <ClampText>1985년에 창립되어 터닝기어 및 가스터빈 기동 시스템을 설계하고 공급하는 전문성을 가지고 있습니다.
                        혁신적인 기술을 토대로 고객 맞춤형 설계를 지원하며 신규 설치, 개조를 위한 운영조건을 충족할 수 있도록 고객에게 제공합니다. 또한 공급된 제품에 대한 글로벌 지원 및
                        서비스를
                        통해 전 세계적으로 품질의 우수성 및 기술력을 인정 받고 있습니다. 현재까지 전 세계에 약 1,000대 이상 공급한 풍부한 경험이 있으며 이는 우수한 신뢰성을 입증합니다.
                    </ClampText>
                    <div style={{display: 'grid', gridTemplateColumns: '13px auto', gap: 7, paddingTop: 20}}>
                        <img src={'/homepage/marker.svg'} width={'100%'} alt=""/>
                        <div>
                            700 Fox Chase Road <br/>
                            Coatesville, PA 19320 <br/>
                            USA <br/>
                            +1.610.423.6600 <br/>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{border: '1px solid lightGray'}}>
                <div style={{
                    backgroundColor: '#F7F7F7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src={'/homepage/agency/powerflex.svg'} alt=""/>
                </div>
                <div style={{padding: 30}}>
                    <div style={{fontSize: 18, color: '#173F95', fontWeight: 600}}>KOENIG Engineering</div>
                    <ClampText>1985년에 창립되어 터닝기어 및 가스터빈 기동 시스템을 설계하고 공급하는 전문성을 가지고 있습니다.
                        혁신적인 기술을 토대로 고객 맞춤형 설계를 지원하며 신규 설치, 개조를 위한 운영조건을 충족할 수 있도록 고객에게 제공합니다. 또한 공급된 제품에 대한 글로벌 지원 및
                        서비스를
                        통해 전 세계적으로 품질의 우수성 및 기술력을 인정 받고 있습니다. 현재까지 전 세계에 약 1,000대 이상 공급한 풍부한 경험이 있으며 이는 우수한 신뢰성을 입증합니다.
                    </ClampText>
                    <div style={{display: 'grid', gridTemplateColumns: '13px auto', gap: 7, paddingTop: 20}}>
                        <img src={'/homepage/marker.svg'} width={'100%'} alt=""/>
                        <div>
                            700 Fox Chase Road <br/>
                            Coatesville, PA 19320 <br/>
                            USA <br/>
                            +1.610.423.6600 <br/>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{border: '1px solid lightGray'}}>
                <div style={{
                    backgroundColor: '#F7F7F7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src={'/homepage/agency/bamo.svg'} alt=""/>
                </div>
                <div style={{padding: 30}}>
                    <div style={{fontSize: 18, color: '#173F95', fontWeight: 600}}>KOENIG Engineering</div>
                    <ClampText>1985년에 창립되어 터닝기어 및 가스터빈 기동 시스템을 설계하고 공급하는 전문성을 가지고 있습니다.
                        혁신적인 기술을 토대로 고객 맞춤형 설계를 지원하며 신규 설치, 개조를 위한 운영조건을 충족할 수 있도록 고객에게 제공합니다. 또한 공급된 제품에 대한 글로벌 지원 및
                        서비스를
                        통해 전 세계적으로 품질의 우수성 및 기술력을 인정 받고 있습니다. 현재까지 전 세계에 약 1,000대 이상 공급한 풍부한 경험이 있으며 이는 우수한 신뢰성을 입증합니다.
                    </ClampText>
                    <div style={{display: 'grid', gridTemplateColumns: '13px auto', gap: 7, paddingTop: 20}}>
                        <img src={'/homepage/marker.svg'} width={'100%'} alt=""/>
                        <div>
                            700 Fox Chase Road <br/>
                            Coatesville, PA 19320 <br/>
                            USA <br/>
                            +1.610.423.6600 <br/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {!isLoading ? (isMobile ? <MFooter/> : <Footer/>) : <></>}
    </Spin>
}

const ClampText = styled.div`
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 3줄까지만 표시 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-size: 12px;
    padding-top: 28px;
`;


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const userAgent = ctx.req.headers["user-agent"] || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent); // 모바일 디바이스 감지
    return {
        props: {
            isMobile, // 모바일 여부를 클라이언트에 전달
        },
    };
})