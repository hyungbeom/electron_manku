import React, {useEffect, useState} from "react";
import {DownOutlined, MenuOutlined} from "@ant-design/icons";
import {commonManage} from "@/utils/commonManage";
import {inputForm, textAreaForm} from "@/utils/commonForm";
import Drawer from "antd/lib/drawer";
import MobileMenu from "@/component/homepage/MobileMenu";

export default function MobileLanding() {

    const [info, setInfo] = useState(0); // 현재 섹션 인덱스
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 섹션 인덱스
    const sections = [0, 1, 2]; // 섹션 배열
    const [touchStartY, setTouchStartY] = useState(0); // 스와이프 시작 위치

    const handleTouchStart = (e) => {
        setTouchStartY(e.touches[0].clientY); // 스와이프 시작 지점의 Y좌표 저장
    };

    const handleTouchEnd = (e) => {
        const touchEndY = e.changedTouches[0].clientY; // 스와이프 종료 지점의 Y좌표
        handleSwipe(touchStartY, touchEndY);
    };

    const handleSwipe = (startY, endY) => {
        const swipeDistance = startY - endY;

        // 첫 번째 화면에서만 스와이프 가능
        if (currentIndex === 0) {
            if (swipeDistance > 50 && currentIndex < sections.length - 1) {
                // 위로 스와이프 -> 다음 섹션으로
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else if (swipeDistance < -50 && currentIndex > 0) {
                // 아래로 스와이프 -> 이전 섹션으로
                setCurrentIndex((prevIndex) => prevIndex - 1);
            }
        }
    };

    useEffect(() => {
        const viewportHeight = window.innerHeight;
        window.scrollTo({
            top: currentIndex * viewportHeight,
            behavior: "smooth",
        });
    }, [currentIndex]);

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    return (
        <>

            <div
                style={{position: "relative", width: "100vw", overflow: "hidden"}}
                onTouchStart={handleTouchStart} // 스와이프 시작
                onTouchEnd={handleTouchEnd} // 스와이프 종료
            >
                {/* 첫 번째 섹션 */}
                <div
                    style={{
                        position: "relative",
                        width: "100vw",
                        height: "100vh",
                    }}
                >
                    <img
                        src={"/homepage/m_landing.png"}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            height: "100%",
                            width: "auth",
                        }}
                        alt=""
                    />

                    <MobileMenu/>

                    <div
                        style={{
                            position: "absolute",
                            textAlign: "center",
                            color: "white",
                            width: "100%",
                            top: "35%",
                        }}
                    >
                        <div style={{fontSize: 15}}>무역을 바탕으로</div>
                        <div style={{fontSize: 15}}>미래 사업을 창출하는 종합사업회사</div>
                        <div style={{fontSize: 35, fontWeight: 600, paddingTop: 10}}>주식회사 만쿠무역</div>
                        <div style={{fontSize: 12, paddingTop: 10}}>
                            글로벌 비지니스를 연결하는 가치를 확장합니다.
                        </div>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            textAlign: "center",
                            color: "white",
                            width: "100%",
                            bottom: "23%",
                        }}
                    >
                        <div style={{fontSize: 13, fontWeight: 600}}>SWIPE</div>
                        <div className="gradient-arrow">
                            <DownOutlined/>
                        </div>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            textAlign: "center",
                            color: "white",
                            width: "100%",
                            bottom: "5%",
                            fontSize: 'calc(9px + 0.3vw)',
                            fontWeight: 600,
                            padding: 'calc(17px + 5vw)',
                        }}
                    >
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', padding: '0px 8' +
                                'vw'
                        }}>
                            <div>01 About us</div>
                            <div>02 Discover What Drives Us</div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: 18}}>
                            <div>03 What MANKU TRADE do?</div>
                            <div>04 Notice</div>
                            <div>05 Contact us</div>
                        </div>
                    </div>
                </div>


                <div
                    style={{
                        width: "100vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: '108px 24px'
                    }}
                >
                    <img src={'/homepage/mobile/mobile_content.png'} width={'100%'} alt=""/>
                </div>

                {/* 세 번째 섹션 */}
                <div
                    style={{
                        width: "100vw",
                        backgroundColor: "#F7F7F7",
                        textAlign: 'center',
                        padding: '100px 50px'
                    }}
                >
                    <div style={{fontSize: '6.3vw', fontWeight: 600}}>Discover What Drives Us</div>
                    <div style={{fontSize: '3.5vw', paddingTop: 10}}>
                        <div>우리의 원동력을 탐구하고</div>
                        <div>만쿠무역의 비전을 확인하세요</div>
                    </div>
                    <img style={{
                        paddingTop: 40,
                        width: '40vw',
                        cursor: 'pointer'
                    }}
                         src={'/homepage/look.svg'} alt=""/>
                </div>
                <div
                    style={{
                        width: "100vw",
                        textAlign: 'center',
                        padding: '100px 50px 30px 50px'
                    }}
                >
                    <div style={{fontSize: '6.3vw', fontWeight: 600}}>Discover Our Expertise</div>
                    <div style={{fontSize: '3.5vw', paddingTop: 10}}>
                        <div>글로벌 무역의 전문성을 만나보세요</div>
                        <div style={{paddingTop: 40, fontSize: '2.6vw'}}>다양한 산업에서 쌓아온 만쿠무역의 경험과 노하우를 확인해보세요</div>
                    </div>
                </div>


                <div style={{position: "relative"}}>
                    <img src={'homepage/mobile/content1.png'} width={'100%'} alt=""/>
                    <div style={{
                        position: 'absolute',
                        bottom: 30,
                        left: 54,
                        color: 'white',
                        zIndex: 110,
                        fontSize: '4.5vw',
                        fontWeight: 500
                    }}>사업분야
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '18%',
                        right: 54,
                        color: 'white',
                        zIndex: 110,
                        fontSize: '4.5vw',
                        fontWeight: 500,

                    }}>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#173F95',
                            padding: '2vw 4vw',
                            fontSize: '3vw',
                        }}>
                            <span style={{paddingRight: 5}}>플랜트 사업부</span>
                            <img src="/homepage/mobile/arrow.svg" alt=""/>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#173F95',
                            padding: '2vw 4vw',
                            fontSize: '3vw',
                            marginTop: '1.5vw'
                        }}>
                            <span style={{paddingRight: 5}}>MRO 서비스</span>
                            <img src="/homepage/mobile/arrow.svg" alt=""/>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#173F95',
                            padding: '2vw 4vw',
                            fontSize: '3vw',
                            marginTop: '1.5vw'
                        }}>
                            <span style={{paddingRight: 5}}>반도체 사업부</span>
                            <img src="/homepage/mobile/arrow.svg" alt=""/>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#173F95',
                            padding: '2vw 4vw',
                            fontSize: '3vw',
                            marginTop: '1.5vw'
                        }}>
                            <span style={{paddingRight: 5}}>무역 사업부</span>
                            <img src="/homepage/mobile/arrow.svg" alt=""/>
                        </div>
                    </div>

                </div>

                <div style={{position: 'relative'}}>
                    <div style={{position: 'absolute', bottom: 40, left: 24}}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'white',
                            padding: '2vw 4vw',
                            fontSize: '4.5vw',
                            fontWeight: 500
                            // marginTop: '1.5vw'
                        }}>
                            <div style={{paddingRight: 5}}>무역 사업부</div>

                            <img src="/homepage/mobile/arrow.svg" width={'17vw'} alt=""/>
                        </div>
                        <div style={{fontSize: 10, padding: '0px 4vw', color: 'white'}}>기계장비/기계요소, 측정/제어, 밸브/배관/피팅</div>
                    </div>

                    <div>
                        <img src={'homepage/mobile/content2.png'} width={'100%'} alt=""/>
                    </div>
                </div>
                <div style={{position: 'relative'}}>
                    <div style={{position: 'absolute', bottom: 40, left: 24}}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'white',
                            padding: '2vw 4vw',
                            fontSize: '4.5vw',
                            fontWeight: 500
                            // marginTop: '1.5vw'
                        }}>
                            <div style={{paddingRight: 5}}>한국 대리점</div>

                            <img src="/homepage/mobile/arrow.svg" width={'17vw'} alt=""/>
                        </div>
                        <div style={{fontSize: 10, padding: '0px 4vw', color: 'white'}}>만쿠무역 주요 한국 대리점</div>
                    </div>
                    <div>
                        <img src={'homepage/mobile/content3.png'} width={'100%'} alt=""/>
                    </div>
                </div>

                <div style={{textAlign: 'center', paddingTop: 60}}>
                    <div style={{fontSize: '6.3vw', fontWeight: 600}}>Notice</div>
                    <div style={{fontSize: '3.5vw', paddingTop: 10}}>
                        <div>공지 사항 및 안내</div>
                    </div>

                    <div style={{paddingTop: 60}}>
                        <img src="/homepage/mobile/card_sample.png" alt=""/>
                    </div>
                </div>
                <div style={{textAlign: 'center', paddingTop: 60}}>
                    <div style={{fontSize: '6.3vw', fontWeight: 600}}>Contact us</div>
                    <div style={{fontSize: '3.5vw', paddingTop: 10}}>
                        <div>당사의 제품 및 서비스를 통해 귀사의 성공을 지원합니다.</div>
                    </div>

                    <div style={{textAlign: 'left', fontSize: 20, padding: '60px 24px 30px 24px'}}>
                        {inputForm({
                            title: '성함', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                            size: 'middle',
                            fontSize: 13
                        })}
                        {inputForm({
                            title: '연락처', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                        {inputForm({
                            title: '이메일', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                        {inputForm({
                            title: '제작사', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                        {inputForm({
                            title: '아이템', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                        {inputForm({
                            title: '모델넘버', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                        {inputForm({
                            title: '수량', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                        {textAreaForm({
                            title: '문의 내용*', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                        })}
                        {inputForm({
                            title: '파일 또는 사진 첨부 ', id: 'searchCreatedBy',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                    </div>
                    <img src="/homepage/send_button.png" width={'150vw'} alt=""/>

                    <div style={{paddingTop: 40}}>
                        <img src="/homepage/content7_1.svg" width={'100%'} alt=""/>
                    </div>
                </div>
                <div style={{backgroundColor: '#2F363E', padding: '24px 30px'}}>

                    <div style={{color: 'white', fontSize: '3vw', display: 'flex', gap: 10, justifyContent: 'end'}}>
                        <span>홈</span>
                        <span>기업정보</span>
                        <span>사업분야</span>
                        <span>한국대리점</span>
                        <span>고객센터</span>
                    </div>

                    <div style={{
                        color: 'white',
                        fontSize: '3vw',
                        display: 'flex',
                        gap: 10,
                        justifyContent: 'end',
                        paddingTop: 10
                    }}>
                        <span>메일문의</span>
                        <span>네이버스토어</span>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between', // 자식들을 우측 정렬
                            alignItems: 'center', // 수직 중앙 정렬
                            paddingTop: 22
                        }}
                    >
                        <img src={'/homepage/sns/online.png'}
                             style={{width: '28%', cursor: 'pointer'}} alt="온라인 문의"/>


                        <img src={'/homepage/sns/kakao.png'} style={{width: '15%', cursor: 'pointer'}}
                             alt="카카오톡"/>
                        <img src={'/homepage/sns/store.png'} style={{width: '15%', cursor: 'pointer'}}
                             alt="스토어"/>
                        <img src={'/homepage/sns/naver.png'} style={{width: '15%', cursor: 'pointer'}}
                             alt="네이버"/>
                        <img src={'/homepage/sns/phone.png'} style={{width: '15%', cursor: 'pointer'}}
                             alt="전화"/>

                    </div>
                    <img src="/homepage/mobile/m_footer.png" width={'100%'} style={{paddingTop: 20}}
                         alt=""/>

                </div>
            </div>
        </>
    );
}