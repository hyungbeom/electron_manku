import React, {useEffect, useState} from "react";
import Layout, {Content} from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import Menu from "antd/lib/menu";
import {
    ArrowLeftOutlined, ArrowRightOutlined,
    BarcodeOutlined, CaretLeftFilled, CaretRightFilled,
    FormOutlined,
    LeftCircleFilled,
    ProductOutlined,
    RightCircleFilled,
    SendOutlined, SettingOutlined, UserSwitchOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import {useRouter} from "next/router";


const {SubMenu} = Menu;

const menuList = {
    rfq: {
        title: '견적의뢰',
        icon: <SendOutlined/>,
        list: [{title: '의뢰 작성', key: 'rfq_write'}, {title: '의뢰 조회', key: 'rfq_read'}, , {
            title: '메일 전송',
            key: 'rfq_mail_send'
        }]
    },
    estimate: {
        title: '견적서',
        icon: <FormOutlined/>,
        list: [{title: '견적서 작성', key: 'estimate_write'}, {title: '견적서 조회', key: 'estimate_read'}, {
            title: '통합견적서 작성',
            key: 'estimate_total_write'
        }]
    },
    order: {
        title: '발주관리',
        icon: <WalletOutlined/>,
        list: [{title: '발주서 작성', key: 'order_write'}, {title: '발주 조회', key: 'order_read'},
            {title: '재고 관리', key: 'order_stock_manage'},
            {title: '정산 관리', key: 'order_manage', subList: [
                    { title: '거래처 별 주문조회', key: 'order_read_customer' },
                    { title: '해외 대리점 별 주문조회', key: 'order_read_agency' },
                ],},
        ]
    },
    maker: {title: 'Maker 관리', icon: <ProductOutlined/>, list: [{title: '메이커 검색', key: 'maker_read'}]},
    code: {
        title: '코드관리',
        icon: <BarcodeOutlined/>,
        list: [
            {title: '국내 대리점(매입)', key: 'code_domestic_purchase'},
            {title: '해외 대리점(매입)', key: 'code_overseas_purchase'},
            {title: '국내 거래처(매출)', key: 'code_domestic_sales'},
            {title: '해외 거래처(매출)', key: 'code_overseas_sales'},
            {title: '공문서', key: 'code_diploma'},
            {title: 'ERP 계정관리', key: 'code_erpUser_manage'},
            {title: '사용자 계정관리', key: 'code_user_manage'},
            {title: '환율조회', key: 'code_exchange_read'},
            {title: 'HS CODE 조회', key: 'code_read'},
        ]
    },
    setting: {title: 'Setting', icon: <SettingOutlined/>, list: [{title: '기본설정', key: 'setting_default'}]},
    manage: {title: 'manage', icon: <UserSwitchOutlined />, list: [{title: '관리자모드', key: 'manage'}]},
}


export default function LayoutComponent({children, userInfo = null}) {

    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);

    const [openKeys, setOpenKeys] = useState([]);


    useEffect(() => {

        // setOpenKeys([router.pathname.split(/[/_]/)[1]])


    }, [router.pathname]); // pathname이 변경될 때마다 실행


    const onOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    const handleMenuClick = (key) => {
        // 메뉴 클릭 시 URL 이동
        moveRouter(key);
        // 현재 열린 상태를 유지하기 위해 openKeys 상태 업데이트
        const parentKey = key.split('_')[0]; // 최상위 메뉴 키 추출
        if (!openKeys.includes(parentKey)) {
            setOpenKeys([...openKeys, parentKey]);
        }
    };


    function moveRouter(v) {
        router.push(`/${v}`)
    }

    return <>
        <div style={{
            backgroundColor: '#f5f5f5',
            width: '100%',
            borderBottom: '1px solid lightGray',
            padding: 10
        }}>

            <CaretLeftFilled style={{fontSize: 25, cursor: "pointer"}} onClick={() => router.back()}/>
            <CaretRightFilled style={{fontSize: 25, cursor: 'pointer'}} onClick={() => router.back()}/>

        </div>
        <Layout style={{minHeight: '100vh'}}>


            <Sider collapsed={collapsed}
                   style={{borderRight: '1px solid lightGray', paddingRight: 10, zIndex: 10}}>
                {collapsed ? <RightCircleFilled style={{
                        position: 'absolute',
                        right: -12,
                        top: 30,
                        fontSize: 22,
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        opacity: 0.7
                    }} onClick={() => setCollapsed(v => !v)}/>
                    :
                    <LeftCircleFilled style={{
                        position: 'absolute',
                        right: -12,
                        top: 30,
                        fontSize: 22,
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        opacity: 0.7
                    }} onClick={() => setCollapsed(v => !v)}/>}


                <Menu

                    theme="light"
                    mode="inline"
                    openKeys={openKeys}  // 열려 있는 서브메뉴를 제어하는 키
                    onOpenChange={onOpenChange}
                >

                    <Menu.Item onClick={() => router.push('/main')}>HOME</Menu.Item>

                    {Object.keys(menuList).map(v => {


                        if(v === 'manage' && userInfo?.authority !== 0){
                            return null;
                        }
                         return (
                            <SubMenu key={v} icon={menuList[v].icon} title={menuList[v].title}>
                                {menuList[v].list.map((src) => {
                                    if (src.subList) {
                                        // 3-depth가 있는 경우
                                        return (
                                            <SubMenu key={src.key} title={src.title}>
                                                {src.subList.map((subSrc) => (
                                                    <Menu.Item
                                                        onClick={() => handleMenuClick(subSrc.key)}
                                                        key={subSrc.key}
                                                    >
                                                        {subSrc.title}
                                                    </Menu.Item>
                                                ))}
                                            </SubMenu>
                                        );
                                    }
                                    // 2-depth 메뉴 항목
                                    return (
                                        <Menu.Item
                                            onClick={() => handleMenuClick(src.key)}
                                            key={src.key}
                                        >
                                            {src.title}
                                        </Menu.Item>
                                    );
                                })}
                            </SubMenu>
                         )
                    })}
                    {/* Home 메뉴 */}
                </Menu>
            </Sider>
            <Layout style={{backgroundColor: '#f5f5f5'}}>
                <Content style={{padding: 5}}>

                    {children}

                </Content>
            </Layout>
        </Layout>

    </>
}