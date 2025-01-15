import React, {useEffect, useState} from "react";
import {Content} from "antd/lib/layout/layout";
import Menu from "antd/lib/menu";
import {
    BarcodeOutlined,
    CaretLeftFilled,
    CaretRightFilled,
    EditOutlined,
    FolderOpenOutlined,
    FormOutlined,
    HomeOutlined,
    MoneyCollectOutlined,
    ProductOutlined,
    SendOutlined,
    SettingOutlined,
    UserSwitchOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import {useRouter} from "next/router";


const {SubMenu} = Menu;

const menuList = {
    project: {
        title: '프로젝트',
        icon: <FolderOpenOutlined />,
        list: [{title: '프로젝트 작성', key: 'project_write'}, {title: '프로젝트 조회', key: 'project_read'},]
    },
    rfq: {
        title: '견적의뢰',
        icon: <SendOutlined/>,
        list: [{title: '의뢰 작성', key: 'rfq_write'}, {title: '의뢰 조회', key: 'rfq_read'}, {
            title: '메일 전송',
            key: 'rfq_mail_send'
        }]
    },
    estimate: {
        title: '견적서',
        icon: <FormOutlined/>,
        list: [{title: '견적서 작성', key: 'estimate_write'}, {title: '견적서 조회', key: 'estimate_read'}, {
            title: '통합견적서 발행',
            key: 'estimate_total_write'
        }]
    },
    order: {
        title: '발주',
        icon: <WalletOutlined/>,
        list: [{title: '발주서 작성', key: 'order_write'}, {title: '발주 조회', key: 'order_read'},
            {title: '재고 관리', key: 'inventory_manage'},
            {title: '정산 관리', key: 'order_manage', subList: [
                    { title: '거래처 별 주문조회', key: 'order_read_customer' },
                    { title: '해외 대리점 별 주문조회', key: 'order_read_agency' },
                ],},
        ]
    },
    maker: {title: 'Maker', icon: <ProductOutlined/>, list: [{title: '메이커 검색', key: 'maker_read'}]},
    code: {
        title: '코드',
        icon: <BarcodeOutlined/>,
        list: [
            {title: '국내 매입처(매입)', key: 'code_domestic_agency'},
            {title: '해외 매입처(매입)', key: 'code_overseas_agency'},
            {title: '국내 거래처(매출)', key: 'code_domestic_customer'},
            {title: '해외 거래처(매출)', key: 'code_overseas_customer'},
            {title: '공문서', key: 'code_diploma'},
            {title: '환율조회', key: 'code_exchange_read'},
            {title: 'HS CODE 조회', key: 'code_read'},
        ]
    },
    Remittance: {
        title: '송금',
        icon: <MoneyCollectOutlined />,
        list: [
            // {title: '해외 송금 요청', key: 'remittance_request'},
            {title: '국내 송금 등록', key: 'remittance_domestic'},
            {title: '국내 송금 목록', key: 'remittance_domestic_list'},
            {title: '해외 송금 관리', key: 'remittance_overseas'},
            {title: '발주/송금 통합 관리', key: 'remittance_order_integrate'},
            {title: '입고 등록', key: 'store_write'},
        ]
    },
    delivery: {
        title: '배송',
        icon: <MoneyCollectOutlined />,
        list: [
            {title: '배송 등록', key: 'delivery_write'},
            {title: '배송 조회', key: 'delivery_read'},
        ]
    },
    // setting: {title: 'Setting', icon: <SettingOutlined/>, list: [{title: '기본설정', key: 'setting_default'}]},
    // manage: {title: 'manage', icon: <UserSwitchOutlined />, list: [{title: '관리자모드', key: 'manage'}]},
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
            display:'flex'
        }}>

            <CaretLeftFilled style={{fontSize: 20, cursor: "pointer", marginTop:3}} onClick={() => router.back()}/>
            <CaretRightFilled style={{fontSize: 20, cursor: 'pointer', marginTop:3}} onClick={() => router.back()}/>
                <Menu
                    theme="light"
                    // mode="inline"
                    openKeys={openKeys}  // 열려 있는 서브메뉴를 제어하는 키
                    onOpenChange={onOpenChange}
                    style={{display:'flex', fontSize:12, marginTop:2}}
                >

                    <Menu.Item style={{width:'auto', padding:'0 5px', height:38, margin:0 }} onClick={() => router.push('/main')}><HomeOutlined/> HOME</Menu.Item>

                    {Object.keys(menuList).map(v => {


                        if(v === 'manage' && userInfo?.authority !== 0){
                            return null;
                        }
                        return (
                            <SubMenu key={v} icon={menuList[v].icon} style={{width:'auto', padding:-10}} title={menuList[v].title}>
                                {menuList[v].list.map((src) => {
                                    if (src.subList) {
                                        // 3-depth가 있는 경우
                                        return (
                                            <SubMenu key={src.key} title={src.title}>
                                                {src.subList.map((subSrc) => (
                                                    <Menu.Item style={{width:'auto', padding:-30}}
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
                                            style={{fontSize:12}}
                                        >
                                            {src.title}
                                        </Menu.Item>
                                    );
                                })}
                            </SubMenu>
                        )
                    })}
                    {/* Home 메뉴 */}
                    <Menu.Item style={{width:'auto', padding:'0 5px', height:38, margin:0 }} onClick={() => router.push('/notice')}><EditOutlined/> 공지사항</Menu.Item>
                </Menu>
        </div>

                <Content style={{padding: 5}}>

                    {children}

                </Content>

    </>
}