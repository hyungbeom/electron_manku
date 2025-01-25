import React, {useEffect, useState} from "react";
import {DownOutlined, MenuOutlined} from "@ant-design/icons";

export default function MobileLanding() {
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 섹션 인덱스
    const sections = [0, 1, 2]; // 섹션의 배열

    useEffect(() => {
        const handleScroll = (e) => {
            // 스크롤 방향 감지
            if (e.deltaY > 0) {
                // 아래로 스크롤
                if (currentIndex < sections.length - 1) {
                    setCurrentIndex((prevIndex) => prevIndex + 1);
                }
            } else if (e.deltaY < 0) {
                // 위로 스크롤
                if (currentIndex > 0) {
                    setCurrentIndex((prevIndex) => prevIndex - 1);
                }
            }
        };

        window.addEventListener("wheel", handleScroll, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleScroll);
        };
    }, [currentIndex, sections.length]);

    useEffect(() => {
        // 현재 섹션으로 부드럽게 스크롤
        const viewportHeight = window.innerHeight;
        window.scrollTo({
            top: currentIndex * viewportHeight,
            behavior: "smooth",
        });
    }, [currentIndex]);


    return <>
        <div style={{position: 'relative', width: '100vw', height: '300vh', overflow: 'hidden'}}>
            <div style={{            position: "relative",
                width: "100vw",
                height: "100vh"}}>
                <img src={'/homepage/m_landing.png'} style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    height: '100%',
                    width: 'auth'
                }} alt=""/>

                <div
                    style={{
                        position: 'fixed',
                        padding: 10
                    }}>
                    <img src={"/homepage/logo_1.png"}/>
                    <span style={{color: 'white', paddingLeft: 5, fontSize: 12}}>만쿠무역</span>
                </div>
                <div
                    style={{
                        position: 'fixed',
                        right: 10,
                        padding: 10
                    }}>
                    <MenuOutlined style={{fontSize: 22, color: 'white'}}/>
                </div>

                <div style={{position: 'absolute', textAlign: 'center', color: 'white', width: '100%', top: '30%'}}>
                    <div style={{fontSize: 15}}>무역을 바탕으로</div>
                    <div style={{fontSize: 15}}>미래 사업을 창출하는 종합사업회사</div>
                    <div style={{fontSize: 35, fontWeight: 600, paddingTop: 10}}>주식회사 만쿠무역</div>
                    <div style={{fontSize: 12, paddingTop: 10}}>글로벌 비지니스를 연결하는 가치를 확장합니다.</div>
                </div>

                <div style={{position: 'absolute', textAlign: 'center', color: 'white', width: '100%', bottom: '30%'}}>
                    <div style={{fontSize: 15, fontWeight: 600}}>SCROLL</div>
                    <div className="gradient-arrow">
                        <DownOutlined/>
                    </div>
                </div>

                <div style={{position: 'absolute', textAlign: 'center', color: 'white', width: '100%', bottom: '10%'}}>
                    <div style={{fontSize: 15, fontWeight: 600}}>
                        여기에 어떤 아이콘을?
                    </div>
                </div>
            </div>








            {/* 두 번째 섹션 */}
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h1>두 번째 섹션</h1>
            </div>

            {/* 세 번째 섹션 */}
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#71d1df",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h1>세 번째 섹션</h1>
            </div>











        </div>
    </>
}