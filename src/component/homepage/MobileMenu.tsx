import Drawer from "antd/lib/drawer";
import React, {useState} from "react";
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuOutlined,
    PieChartOutlined
} from "@ant-design/icons";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null); // 현재 열려 있는 div의 index


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
        <div
            style={{
                position: "fixed",
                padding: 10,
            }}
        >
            <img src={"/homepage/logo_1.png"}/>
            <span
                style={{color: "white", paddingLeft: 5, fontSize: 12, fontWeight: 600}}>Manku Trading</span>

        </div>
        <div
            style={{
                position: "fixed",
                right: 10,
                padding: 11,
            }}
        >
            <MenuOutlined style={{fontSize: 22, color: "white"}} onClick={showDrawer}/>
        </div>

        <Drawer
            title={<>
                <div style={{display: "flex", gap: "10px", color: 'white', fontSize: 14}}>

                    <img src={"/homepage/lang.svg"} alt=""/>
                    <span>KOR</span>
                </div>
            </>}
            closeIcon={null}
            headerStyle={{border: 'none', backgroundColor: '#173F95', display: 'flex', justifyContent: 'space-between'}}
            onClose={onClose}
            open={open}
            bodyStyle={{
                backgroundColor: '#173F95', // 다크 모드 색상 설정
                color: '#ffffff', // 텍스트 색상 설정
                padding: 0, // 불필요한 여백 제거
            }}>
            <div style={{fontSize: 18, fontWeight: 500, display: 'grid', rowGap: 35, paddingTop: 45}}>

                <div>
                    {[{title :'기업통보', subTitle : ['회사소개', '연혁', '주요고객','오시는길']},{title :'사업분야', subTitle : ['회사소개', '연혁', '주요고객','오시는길']},{title :'한국대리점', subTitle : ['회사소개', '연혁', '주요고객','오시는길']},{title :'고객센터', subTitle : ['회사소개', '연혁', '주요고객','오시는길']}].map((v, index) => (
                        <div key={index} style={{marginBottom: 30}}>
                            <button
                                onClick={() => toggleBox(index)}
                                style={{
                                    backgroundColor: '#173F95', // 다크 모드 색상 설정
                                    color: '#ffffff', // 텍스트 색상 설정
                                    padding: '10px 52px', // 불필요한 여백 제거
                                    border : 'none',
                                }}
                            >
                                {v.title}
                            </button>
                            <div style={{backgroundColor : '#2F363E'}}
                                className={`box ${
                                    activeIndex === index
                                        ? "expanding"
                                        : activeIndex === null
                                            ? ""
                                            : "collapsing"
                                }`}
                            >
                                {activeIndex === index && (
                                    <div style={{backgroundColor : '#2F363E'}}>
                                        {v.subTitle.map(src=>{
                                            return <div style={{fontSize : 13, padding : '8px 40px', border : '1px solid #2F363E'}}>{src}</div>
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