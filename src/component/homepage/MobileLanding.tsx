import React, {useEffect, useState} from "react";
import {DownOutlined, MenuOutlined} from "@ant-design/icons";

export default function MobileLanding() {
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
        // 현재 섹션으로 부드럽게 스크롤 이동
        // const viewportHeight = window.innerHeight;
        // window.scrollTo({
        //     top: currentIndex * viewportHeight,
        //     behavior: "smooth",
        // });
    }, [currentIndex]);

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

                    <div
                        style={{
                            position: "fixed",
                            padding: 10,
                        }}
                    >
                        <img src={"/homepage/logo_1.png"}/>
                        <span style={{color: "white", paddingLeft: 5, fontSize: 12}}>만쿠무역</span>
                    </div>
                    <div
                        style={{
                            position: "fixed",
                            right: 10,
                            padding: 11,
                        }}
                    >
                        <MenuOutlined style={{fontSize: 22, color: "white"}}/>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            textAlign: "center",
                            color: "white",
                            width: "100%",
                            top: "30%",
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
                            bottom: "30%",
                        }}
                    >
                        <div style={{fontSize: 15, fontWeight: 600}}>SWIPE</div>
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
                            bottom: "10%",
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
                    <div style={{fontSize: '3.5vw', paddingTop : 48}}>
                        <div>우리의 원동력을 탐구하고</div>
                        <div>만쿠무역의 비전을 확인하세요</div>
                    </div>
                    <img style={{
                        paddingTop : 40,
                        width: '40vw',
                        cursor: 'pointer'
                    }}
                         src={'/homepage/look.svg'} alt=""/>
                </div>

            </div>
        </>
    );
}