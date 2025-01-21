import React, {useEffect, useState} from "react";
import {Content} from "antd/lib/layout/layout";
import Menu, {MenuProps} from "antd/lib/menu";
import {
    AppstoreOutlined,
    BarcodeOutlined,
    CaretLeftFilled,
    CaretRightFilled, CodeOutlined, DiffOutlined, DropboxOutlined,
    EditOutlined,
    FolderOpenOutlined,
    FormOutlined, FundProjectionScreenOutlined,
    HomeOutlined, MailOutlined,
    MoneyCollectOutlined, NotificationOutlined,
    ProductOutlined, PullRequestOutlined,
    SendOutlined,
    SettingOutlined,
    UserSwitchOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import {useRouter} from "next/router";
import MenuItem from "antd/lib/menu/MenuItem";


const {SubMenu} = Menu;

const menuList = {
    project: {
        title: '프로젝트',
        icon: <FolderOpenOutlined/>,
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
            {
                title: '정산 관리', key: 'order_manage', subList: [
                    {title: '거래처 별 주문조회', key: 'order_read_customer'},
                    {title: '해외 대리점 별 주문조회', key: 'order_read_agency'},
                ],
            },
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
        icon: <MoneyCollectOutlined/>,
        list: [
            // {title: '해외 송금 요청', key: 'remittance_request'},
            {title: '국내 송금 등록', key: 'remittance_domestic_write'},
            {title: '국내 송금 목록', key: 'remittance_domestic_list'},
            {title: '해외 송금 관리', key: 'remittance_overseas'},
            {title: '발주/송금 통합 관리', key: 'remittance_order_integrate'},
            {title: '입고 등록', key: 'store_write'},
            {title: '입고 목록', key: 'store_read'},
        ]
    },
    delivery: {
        title: '배송',
        icon: <MoneyCollectOutlined/>,
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

    const items: any = [
        {
            label: '프로젝트',
            key: 'project',
            icon: <FundProjectionScreenOutlined/>,
            style: {margin: ' 0px -20px 0px -10px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>프로젝트 작성</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>프로젝트 조회</span>, key: 'read'},
            ],

        }, {
            label: '전적의뢰',
            key: 'rfq',
            icon: <PullRequestOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>견적의뢰 작성</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>견적의뢰 조회</span>, key: 'read'},
                {label: <span style={{fontSize: '12px'}}>견적의뢰 메일전송</span>, key: 'rfq_mail_send'}
            ]


        }, {
            label: '견적서',
            key: 'estimate',
            icon: <FormOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [

                {label: <span style={{fontSize: '12px'}}>견적서 작성</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>견적서 조회</span>, key: 'read'},
                {label: <span style={{fontSize: '12px'}}>통합견적서 발행</span>, key: 'rfq_mail_send'},

            ],
        }, {
            label: '발주서',
            key: 'order',
            icon: <DiffOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>발주서 작성</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>발주서 조회</span>, key: 'read'},
                {label: <span style={{fontSize: '12px'}}>재고관리</span>, key: 'rfq_mail_send'},
                {
                    label: <span style={{fontSize: '12px'}}>정산관리</span>, key: 'rfq_mail_send', children: [
                        {label: <span style={{fontSize: '12px'}}>거래처 별 주문조회</span>, key: 'write'},
                        {label: <span style={{fontSize: '12px'}}>해외대리점 별 주문조회</span>, key: 'read'}
                    ],
                },
            ],
        }, {
            label: 'MAKER',
            key: 'maker',
            icon: <MailOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>MAKER</span>, key: 'rfq_write'},
            ],
        }, {
            label: '코드',
            key: 'code',
            icon: <CodeOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>국내 매입처</span>, key: 'rfq_write'},
                {label: <span style={{fontSize: '12px'}}>해외 매입처</span>, key: 'rfq_read'},
                {label: <span style={{fontSize: '12px'}}>국내 고객사</span>, key: 'rfq_mail_send'},
                {label: <span style={{fontSize: '12px'}}>해외 고객사</span>, key: 'rfq_mail_send'},
                {label: <span style={{fontSize: '12px'}}>공문서</span>, key: 'rfq_mail_send'},
                {label: <span style={{fontSize: '12px'}}>환율조회</span>, key: 'rfq_mail_send'},
                {label: <span style={{fontSize: '12px'}}>HS CODE 조회</span>, key: 'rfq_mail_send'},
            ],
        }, {
            label: '송금',
            key: 'remittance_domestic',
            icon: <SendOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>국내 송금 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>국내 송금 목록</span>, key: 'read'},
                {label: <span style={{fontSize: '12px'}}>해외 송금 관리</span>, key: '*'},
                {label: <span style={{fontSize: '12px'}}>발주/송금 통합 관리</span>, key: '*'},
            ],
        }, {
            label: '입고관리',
            key: 'store',
            icon: <DropboxOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>입고 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>입고 조회</span>, key: 'read'}
            ]
        }, {
            label: '배송',
            key: 'delivery',
            icon: <SendOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>배송 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>배송 조회</span>, key: 'read'}
            ]
        }, {
            label: '공지사항',
            key: '',
            icon: <NotificationOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>공지사항</span>, key: 'notice'},

            ]
        },
    ];


    const [selectedKeys, setSelectedKeys] = useState(['project_write']);
    const onClick = (e) => {
        const root = `/${e.keyPath[1]}_${e.keyPath[0]}`

        switch (e.key) {
            case 'write' :
                if (e.keyPath[1] === 'estimate_write') {
                    return window.open(root, '_blank', 'width=1300,height=630,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
                }

                window.open(root, '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
                break;
            case 'read' :
                router.push(`${root}`)
                break;
        }
    };

    return <>
        {router.pathname.includes('_read') || router.pathname === '/main' || router.pathname === '/rfq_mail_send' ?
            <div style={{
                backgroundColor: '#f5f5f5',
                width: '100%',
                borderBottom: '1px solid lightGray',
                display: 'flex'
            }}>

                <Menu onClick={onClick}
                      selectedKeys={null} mode="horizontal" items={items}
                      style={{width: '100%', fontSize: 10}} className="custom-menu"/>
            </div> : <></>}

        <Content style={{padding: 5}}>

            {children}

        </Content>

    </>
}