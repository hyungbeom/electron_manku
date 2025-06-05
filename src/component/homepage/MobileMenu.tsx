import Drawer from "antd/lib/drawer";
import React, {useEffect, useState} from "react";
import {CloseOutlined, DownOutlined, MenuOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";

export default function MobileMenu({headerCheck = true}) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null); // 현재 열려 있는 div의 index
    const [scrollCheck, setScrollCheck] = useState(headerCheck);


    const router = useRouter()
    const handleScroll = () => {
        // 현재 스크롤 위치
        const scrollY = window.scrollY;
        // 뷰포트 높이
        const viewportHeight = window.innerHeight;

        // 스크롤 위치가 100vh 이상인지 확인
        // if (scrollY >= viewportHeight) {
        if (scrollY >= 50) {
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


    const toggleBox = (index: number) => {
        // 클릭한 index가 열려 있다면 닫고, 아니라면 해당 index 열기
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };


    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return <>
        {/*scrollCheck*/}
        {!open ? <div
            style={{position: "fixed", zIndex: 1000000, backgroundColor: scrollCheck ? 'white' : '', width: '100%', borderBottom : headerCheck ?'1px solid lightGray' : (scrollCheck ?'1px solid lightGray' : 'none') }}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: 20}}>
                <div onClick={()=> router.push('/homepage')}>
                    <img src={"/homepage/logo_1.png"}/>
                    <span
                        style={{color: headerCheck ? 'black' : (scrollCheck ? "" : 'white'), paddingLeft: 5, fontSize: 12, fontWeight: 600}}>Manku Solution</span>

                </div>
                <div>
                    <MenuOutlined style={{fontSize: 22, color: headerCheck ? 'black' : (scrollCheck ? 'black' : "white")}} onClick={showDrawer}/>
                </div>
            </div>
        </div> : <></>}
        <Drawer
            title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: "flex", gap: "10px", color: 'white', fontSize: 14}}>

                    <img src={"/homepage/lang.svg"} alt=""/>
                    <span>KOR</span>
                </div>
                <CloseOutlined style={{color: 'white', fontSize: 20}} onClick={onClose}/>
            </div>}
            closeIcon={null}
            headerStyle={{border: 'none', backgroundColor: '#173F95'}}
            onClose={onClose}
            open={open}
            bodyStyle={{
                backgroundColor: '#173F95', // 다크 모드 색상 설정
                color: '#ffffff', // 텍스트 색상 설정
                padding: 0, // 불필요한 여백 제거
            }}>
            <div style={{fontSize: 18, fontWeight: 500, display: 'grid', rowGap: 35, paddingTop: 45}}>

                <div>
                    {[{title: '기업통보', subTitle: [{title : '회사소개', path : 'aboutus'}, {title : '연혁', path : 'history'}, {title : '주요고객', path : 'partners'}, {title : '오시는길', path : 'aboutus'}]}, {
                        title: '사업분야',
                        subTitle: ['회사소개', '연혁', '주요고객', '오시는길']
                    }, {title: '한국대리점', subTitle: ['회사소개', '연혁', '주요고객', '오시는길']}, {
                        title: '고객센터',
                        subTitle: ['회사소개', '연혁', '주요고객', '오시는길']
                    }].map((v, index) => (
                        <div key={index} style={{marginBottom: 30}}>
                            <div
                                onClick={() => toggleBox(index)}
                                style={{
                                    backgroundColor: '#173F95', // 다크 모드 색상 설정
                                    color: '#ffffff', // 텍스트 색상 설정
                                    padding: '10px 52px', // 불필요한 여백 제거
                                    border: 'none',
                                }}
                            >
                                {v.title}<DownOutlined style={{fontSize: 13, paddingLeft: 10}}/>
                            </div>
                            <div style={{backgroundColor: '#2F363E'}}
                                 className={`box ${
                                     activeIndex === index
                                         ? "expanding"
                                         : activeIndex === null
                                             ? ""
                                             : "collapsing"
                                 }`}
                            >
                                {activeIndex === index && (
                                    <div style={{backgroundColor: '#2F363E'}}>
                                        {v.subTitle.map(src => {
                                            return <div style={{
                                                fontSize: 13,
                                                padding: '8px 40px',
                                                border: '1px solid #2F363E'
                                            }} onClick={()=>{
                                                router.push(`/homepage/${src.path}`)
                                            }}>{src.title}</div>
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Drawer>
    </>
}