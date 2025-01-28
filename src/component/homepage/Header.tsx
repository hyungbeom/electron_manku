import React, {useEffect, useState} from "react";
import {backgroundColor} from "html2canvas/dist/types/css/property-descriptors/background-color";
import {useRouter} from "next/router";

export default function Header() {

    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoverMenu, setHoverMenu] = useState(null);
    const [scrollCheck, setScrollCheck] = useState(false);


    const handleScroll = () => {

        // 현재 스크롤 위치
        const scrollY = window.scrollY;
        // 뷰포트 높이

        // 스크롤 위치가 100vh 이상인지 확인
        // if (scrollY >= viewportHeight) {
        if (scrollY >= 200) {
            setScrollCheck(true);
        } else {
            setScrollCheck(false);
        }
    };

    useEffect(() => {
        // 스크롤 이벤트 리스너 등록
        window.addEventListener("scroll", handleScroll);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    function enterMouse(e) {
        setHoverMenu(e.target.id)
        setIsExpanded(true)
    }

    function outMouse(e) {
        setHoverMenu(null);
        setIsExpanded(false)
    }

    return (
        <>
            {/* 상단 고정된 헤더 */}
            <div
                style={{
                    position: "fixed",
                    zIndex: 120,
                    top: 0,
                    left: 0,
                    minWidth: 1048,
                    width: "100%",
                    // padding: "30px 35px",
                    color: (isExpanded || scrollCheck) ? "black" : 'white',
                    backgroundColor: (isExpanded || scrollCheck) ? "white" : '',
                    borderBottom : (isExpanded || scrollCheck) ?'0.1px solid lightGray' : ''
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: '0px 40px'
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontWeight: 600,
                            cursor: 'pointer'
                        }} onClick={() => router.push('/homepage')}>
                        <img src={"/homepage/logo_1.png"}/>
                        Manku Trading
                    </div>

                    <div style={{
                        display: "flex",
                        textAlign: "center",
                        fontWeight: 600,
                        alignItems: 'center'

                    }} onPointerEnter={enterMouse} onPointerLeave={outMouse}>
                        <div style={{
                            cursor: "pointer",
                            width: 200,
                            height: 83,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: hoverMenu === '1' ? '#173F95' : '',
                            borderBottom: hoverMenu === '1' ? '2px solid #173F95' : ''
                        }} id={'1'} onPointerEnter={enterMouse}>기업정보
                        </div>
                        <div style={{
                            cursor: "pointer",
                            width: 200,
                            height: 83,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: hoverMenu === '2' ? '#173F95' : '',
                            borderBottom: hoverMenu === '2' ? '2px solid #173F95' : ''
                        }} id={'2'} onPointerEnter={enterMouse}>사업분야
                        </div>
                        <div style={{
                            cursor: "pointer",
                            width: 200,
                            height: 83,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: hoverMenu === '3' ? '#173F95' : '',
                            borderBottom: hoverMenu === '3' ? '2px solid #173F95' : ''
                        }} id={'3'} onPointerEnter={enterMouse}>한국대리점
                        </div>
                        <div style={{
                            cursor: "pointer",
                            width: 200,
                            height: 83,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: hoverMenu === '4' ? '#173F95' : '',
                            borderBottom: hoverMenu === '4' ? '2px solid #173F95' : ''
                        }} id={'4'} onPointerEnter={enterMouse}>고객센터
                        </div>
                    </div>

                    <div style={{display: "flex", gap: "25px"}}>
                        <img src={"/homepage/search.svg"} alt=""/>
                        <img src={"/homepage/lang.svg"} alt=""/>
                        <span>KOR</span>
                    </div>
                </div>
            </div>

            {/* 펼쳐지는 섹션 */}
            {<div
                className={`expandable-section ${isExpanded ? "expanded" : ""}`}
                style={{
                    position: "fixed",
                    zIndex: 120,
                    top: 83,
                    left: 0,
                    minWidth: 1048,
                    width: "100%",
                    overflow: "hidden", // 숨김 처리
                    borderTop: isExpanded ? '0.1px solid lightGray' : '',
                    backgroundColor: isExpanded ? 'white' : ''
                }}>
                <div
                    style={{
                        // padding: "30px 75px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{paddingLeft:20}}/>

                    <div style={{display: "flex", textAlign: "center", padding: '20px 0px'}}
                         onPointerEnter={() => setIsExpanded(true)} onPointerLeave={outMouse}>
            <span
                style={{
                    cursor: "pointer",
                    width: 200,
                    display: "grid",
                    gridTemplateRows: "35px 35px 35px 35px",
                    color: hoverMenu === '1' ? 'black' : '#A5A5A5',
                }}
                onPointerEnter={() => setHoverMenu('1')}>
              <div className="menu-item">회사소개</div>
              <div className="menu-item">연혁</div>
              <div className="menu-item">주요고객</div>
              <div className="menu-item">오시는길</div>
            </span>
                        <span
                            onPointerEnter={() => setHoverMenu('2')}
                            style={{
                                cursor: "pointer",
                                width: 200,
                                display: "grid",
                                gridTemplateRows: "35px 35px 35px 35px",
                                color: hoverMenu === '2' ? 'black' : '#A5A5A5'
                            }}
                        >
              <div className="menu-item">MRO 서비스</div>
              <div className="menu-item">플랜트 사업부</div>
              <div className="menu-item">반도체 사업부</div>
              <div className="menu-item">무역 사업부</div>
            </span>
                        <span
                            onPointerEnter={() => setHoverMenu('3')}
                            style={{
                                cursor: "pointer",
                                width: 200,
                                display: "grid",
                                gridTemplateRows: "35px 35px 35px 35px",
                                color: hoverMenu === '3' ? 'black' : '#A5A5A5'
                            }}
                        >
              <div className="menu-item">KOENIG</div>
              <div className="menu-item">DST Chemical</div>
              <div className="menu-item">Daiichi</div>
              <div className="menu-item">Powerflex</div>
              <div className="menu-item">Bamo</div>
            </span>
                        <span
                            onPointerEnter={() => setHoverMenu('4')}
                            style={{
                                cursor: "pointer",
                                width: 200,
                                textAlign : 'center',
                                display: "grid",
                                gridTemplateRows: "35px 35px 35px 35px",
                                color: hoverMenu === '4' ? 'black' : '#A5A5A5'
                            }}
                        >
              <div className="menu-item">온라인문의</div>
              <div className="menu-item">채용안내</div>
            </span>
                    </div>
                    <div/>
                </div>
            </div>}
        </>
    );
}