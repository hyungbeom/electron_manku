import React from "react";
import {Content} from "antd/lib/layout/layout";
import Menu from "antd/lib/menu";
import Dropdown from "antd/lib/dropdown";
import {
    AlertOutlined, BankOutlined,
    DatabaseOutlined,
    DiffOutlined,
    DropboxOutlined,
    FormOutlined,
    FundProjectionScreenOutlined, HomeOutlined, LogoutOutlined,
    PullRequestOutlined,
    SendOutlined, SettingOutlined,
    TruckOutlined, UserOutlined,
} from '@ant-design/icons';
import {useRouter} from "next/router";
import {removeCookie} from "@/manage/function/cookie";


export default function LayoutComponent({children, userInfo = null}) {

    const router = useRouter();

    const items: any = [{
        label: 'HOME',
        key: 'main',
        icon: <BankOutlined/>,
        style: {margin: ' 0px -20px 0px -10px'},
        children: [
            {label: <span style={{fontSize: '12px'}}>HOME</span>, key: 'main'},
        ],
        popupOffset: [0, -4], // Y축 간격 줄이기
    },
        {
            label: '프로젝트',
            key: 'project',
            icon: <FundProjectionScreenOutlined/>,
            style: {margin: ' 0px -20px 0px -10px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>프로젝트 등록</span>, key: 'project_write'},
                {label: <span style={{fontSize: '12px'}}>프로젝트 조회</span>, key: 'project_read'},
            ],
            popupOffset: [0, -4], // Y축 간격 줄이기
        }, {
            label: '견적의뢰',
            key: 'rfq',
            icon: <PullRequestOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>견적의뢰 등록</span>, key: 'rfq_write'},
                {label: <span style={{fontSize: '12px'}}>견적의뢰 조회</span>, key: 'rfq_read'},
                {label: <span style={{fontSize: '12px'}}>메일전송</span>, key: 'rfq_mail_send'}
            ],

            popupOffset: [0, -4],
        }, {
            label: '견적서',
            key: 'estimate',
            icon: <FormOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [

                {label: <span style={{fontSize: '12px'}}>견적서 등록</span>, key: 'estimate_write'},
                {label: <span style={{fontSize: '12px'}}>견적서 조회</span>, key: 'estimate_read'},
                {label: <span style={{fontSize: '12px'}}>통합견적서 발행</span>, key: 'estimate_*'},

            ],
            popupOffset: [0, -4],
        }, {
            label: '발주서',
            key: 'order',
            icon: <DiffOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>발주서 등록</span>, key: 'order_write'},
                {label: <span style={{fontSize: '12px'}}>발주서 조회</span>, key: 'order_read'},

            ],
            popupOffset: [0, -4],
        }, {
            label: '입고',
            key: 'store',
            icon: <DropboxOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>입고 등록</span>, key: 'store_write'},
                {label: <span style={{fontSize: '12px'}}>입고 조회</span>, key: 'store_read'}
            ]
        }, {
            label: '배송',
            key: 'delivery',
            icon: <TruckOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>배송 등록</span>, key: 'delivery_write'},
                {label: <span style={{fontSize: '12px'}}>배송 조회</span>, key: 'delivery_read'}
            ],
            popupOffset: [0, -4],
        }, {
            label: '송금',
            key: 'remittance_domestic',
            icon: <SendOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>국내 송금 등록</span>, key: 'remittance_domestic_write'},
                {label: <span style={{fontSize: '12px'}}>국내 송금 목록</span>, key: 'remittance_domestic_read'},
            ],
            popupOffset: [0, -4],
        }, {
            label: '데이터관리',
            key: 'data',
            icon: <DatabaseOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {
                    label: <span style={{fontSize: '12px', paddingLeft: 5}}>매입처</span>,
                    key: 'data/domestic/agency_read',
                    children: [
                        {
                            label: <span style={{fontSize: '12px'}}>국내 등록</span>,
                            key: 'data/agency/domestic/agency_write'
                        },
                        {label: <span style={{fontSize: '12px'}}>국내 목록</span>, key: 'data/agency/domestic/agency_read'},
                        {
                            label: <span style={{fontSize: '12px'}}>해외 등록</span>,
                            key: 'data/agency/overseas/agency_write'
                        },
                        {label: <span style={{fontSize: '12px'}}>해외 목록</span>, key: 'data/agency/overseas/agency_read'},
                    ],
                },
                {
                    label: <span style={{fontSize: '12px', paddingLeft: 5}}>고객사</span>, key: 'data_4',
                    children: [
                        {
                            label: <span style={{fontSize: '12px'}}>국내 등록</span>,
                            key: 'data/customer/domestic/customer_write'
                        },
                        {
                            label: <span style={{fontSize: '12px'}}>국내 목록</span>,
                            key: 'data/customer/domestic/customer_read'
                        },
                        {
                            label: <span style={{fontSize: '12px'}}>해외 등록</span>,
                            key: 'data/customer/overseas/customer_write'
                        },
                        {
                            label: <span style={{fontSize: '12px'}}>해외 목록</span>,
                            key: 'data/customer/overseas/customer_read'
                        },
                    ],
                },
                {
                    label: <span style={{fontSize: '12px', paddingLeft: 5}}>메이커</span>, key: 'data_5',
                    children: [
                        {label: <span style={{fontSize: '12px'}}>메이커 등록</span>, key: 'maker_write'},
                        {label: <span style={{fontSize: '12px'}}>메이커 목록</span>, key: 'maker_read'},
                    ]
                },
                {label: <span style={{fontSize: '12px'}}>HS CODE</span>, key: 'code_read'},
            ],
            popupOffset: [0, -4],
        }

    ];


    const onClick = (e) => {
        const root = `/${e.keyPath[0]}`

        router.push(root)

    };


    return <>

        <div style={{
            backgroundColor: '#f5f5f5',
            width: '100%',
            borderBottom: '1px solid lightGray',
            display: 'flex'
        }}>
            <Menu onClick={onClick}
                  selectedKeys={null} mode="horizontal" items={items}
                  style={{width: '100%', fontSize: 10}} className="custom-menu"/>
            <UserMenu/>
        </div>

        <Content style={{padding: 5}}>
            {children}
        </Content>

    </>
}

export function UserMenu() {
    const router = useRouter();
    const items = [
        {
            label: <div style={{width: 100}}>마이페이지</div>,
            key: '1',
            icon: <UserOutlined/>,
        },
        {
            label: <div style={{width: 100, color : 'red'}} onClick={()=>{
                removeCookie(null, 'token')
                router.push('/')
            }}>로그아웃</div>,
            key: '2',
            icon: <LogoutOutlined style={{color : 'red'}}/>
        }
    ];
    return <Dropdown menu={{items}}>
        <UserOutlined style={{
            fontSize: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
            cursor: 'pointer'
        }}/>
    </Dropdown>
}