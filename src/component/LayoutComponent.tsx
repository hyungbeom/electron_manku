import React, {useEffect, useState} from "react";
import Layout, {Content} from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import Menu from "antd/lib/menu";
import {
    BarcodeOutlined,
    FormOutlined,
    LeftCircleFilled,
    ProductOutlined,
    RightCircleFilled,
    SendOutlined, SettingOutlined,
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
        list: [{title: '발주서 작성', key: 'order_write'}, {title: '발주 조회', key: 'order_read'}, {
            title: '재고 관리',
            key: 'order_manage'
        }, , {title: '정산 관리', key: 'order_result_manage'}]
    },
    maker: {title: 'Maker 관리', icon: <ProductOutlined/>, list: [{title: '메이커 검색', key: 'maker_read'}]},
    code: {
        title: '코드관리',
        icon: <BarcodeOutlined/>,
        list: [
            {title: '국내 대리점(매입)', key: 'code_domestic_purchase'},
            {title: '국외 대리점', key: 'code_overseasAgency'},
            {title: '국내 거래처(매출)', key: 'code_domestic_sales'},
            {title: '국외 거래처', key: 'code_overseasCorr'},
            {title: '공문서', key: 'code_diploma'},
            {title: 'ERP 계정관리', key: 'code_erpUser_manage'},
            {title: '사용자 계정관리', key: 'code_user_manage'},
            {title: '환율조회', key: 'code_exchange_read'},
            {title: 'HS CODE 조회', key: 'code_read'},
        ]
    },
    setting: {title: 'Setting', icon: <SettingOutlined/>, list: [{title: '기본설정', key: 'setting_default'}]},

}


export default function LayoutComponent({children}) {

    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);

    const [openKeys, setOpenKeys] = useState([]);



    useEffect(() => {

        // setOpenKeys([router.pathname.split(/[/_]/)[1]])


    }, [router.pathname]); // pathname이 변경될 때마다 실행



    const onOpenChange = (keys) => {
        // 마지막으로 클릭한 메뉴만 열리도록 설정
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);

        if (latestOpenKey) {
            setOpenKeys([latestOpenKey]);
        } else {
            setOpenKeys([]);
        }
    };


    function moveRouter(v) {
        router.push(`/${v}`)
    }

    return <>
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

                    <Menu.Item onClick={()=>router.push('/main')}>HOME</Menu.Item>

                    {Object.keys(menuList).map(v => {
                        return <SubMenu key={v} icon={menuList[v].icon} title={menuList[v].title}>
                            {menuList[v].list.map(src => {
                                return <Menu.Item onClick={()=>moveRouter(src.key)} key={src.key}>{src.title}</Menu.Item>
                            })}
                        </SubMenu>
                    })}
                    {/* Home 메뉴 */}
                </Menu>
            </Sider>
            <Layout style={{backgroundColor: '#f5f5f5'}}>
                <Content style={{padding : 25}}>

                    {children}

                </Content>
            </Layout>
        </Layout>
        }
    </>
}