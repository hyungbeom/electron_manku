import React from "react";
import {Content} from "antd/lib/layout/layout";
import Menu from "antd/lib/menu";
import {
    AlertOutlined,
    CodeOutlined, DatabaseOutlined,
    DiffOutlined,
    DropboxOutlined,
    FormOutlined,
    FundProjectionScreenOutlined,
    MailOutlined,
    NotificationOutlined,
    PullRequestOutlined,
    SendOutlined, TruckOutlined,
} from '@ant-design/icons';
import {useRouter} from "next/router";


export default function LayoutComponent({children, userInfo = null}) {

    const router = useRouter();

    const items: any = [
        {
            label: '프로젝트',
            key: 'project',
            icon: <FundProjectionScreenOutlined/>,
            style: {margin: ' 0px -20px 0px -10px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>프로젝트 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>프로젝트 조회</span>, key: 'read'},
            ],
            popupOffset: [0, -4], // Y축 간격 줄이기
        }, {
            label: '견적의뢰',
            key: 'rfq',
            icon: <PullRequestOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>견적의뢰 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>견적의뢰 조회</span>, key: 'read'},
                {label: <span style={{fontSize: '12px'}}>메일전송</span>, key: 'mail'}
            ],

            popupOffset: [0, -4],
        }, {
            label: '견적서',
            key: 'estimate',
            icon: <FormOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [

                {label: <span style={{fontSize: '12px'}}>견적서 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>견적서 조회</span>, key: 'read'},
                {label: <span style={{fontSize: '12px'}}>통합견적서 발행</span>, key: 'rfq_mail_send'},

            ],
            popupOffset: [0, -4],
        }, {
            label: '발주서',
            key: 'order',
            icon: <DiffOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>발주서 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>발주서 조회</span>, key: 'read'},

            ],
            popupOffset: [0, -4],
        }, {
            label: '입고',
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
            icon: <TruckOutlined />,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>배송 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>배송 조회</span>, key: 'read'}
            ],
            popupOffset: [0, -4],
        }, {
            label: '송금',
            key: 'remittance_domestic',
            icon: <SendOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>국내 송금 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>국내 송금 목록</span>, key: 'read'},
            ],
            popupOffset: [0, -4],
        }, {
            label: '데이터관리',
            key: 'data',
            icon: <DatabaseOutlined />,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>국내 매입처</span>, key: 'data_1'},
                {label: <span style={{fontSize: '12px'}}>해외 매업처</span>, key: 'data_2'},
                {label: <span style={{fontSize: '12px'}}>국내 고객사</span>, key: 'data_3'},
                {label: <span style={{fontSize: '12px'}}>해외 고객사</span>, key: 'data_4'},
                {label: <span style={{fontSize: '12px'}}>메이커</span>, key: 'data_5'},
                {label: <span style={{fontSize: '12px'}}>HS CODE</span>, key: 'data_6'},
            ],
            popupOffset: [0, -4],
        }, {
            label: '공지사항',
            key: 'note',
            icon: <AlertOutlined />,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>공지사항</span>, key: 'note'},
                {label: <span style={{fontSize: '12px'}}>공문서</span>, key: 'public'},
            ],
            popupOffset: [0, -4],
        }

    ];


    const onClick = (e) => {
        const root = `/${e.keyPath[1]}_${e.keyPath[0]}`

        switch (e.key) {
            case 'write' :

                window.open(root, '_blank', 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
                break;
            case 'read' :
                router.push(`${root}`)
                break;
            case 'notice' :
                router.push(`/erp_rule`)
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
                      style={{width: '100%', fontSize: 10, marginBottom : 7}} className="custom-menu"/>
            </div> : <></>}

        <Content style={{padding: 5}}>
            {children}
        </Content>

    </>
}