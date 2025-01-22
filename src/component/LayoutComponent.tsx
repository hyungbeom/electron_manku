import React from "react";
import {Content} from "antd/lib/layout/layout";
import Menu from "antd/lib/menu";
import {
    CodeOutlined,
    DiffOutlined,
    DropboxOutlined,
    FormOutlined,
    FundProjectionScreenOutlined,
    MailOutlined,
    NotificationOutlined,
    PullRequestOutlined,
    SendOutlined,
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

        }, {
            label: '견적의뢰',
            key: 'rfq',
            icon: <PullRequestOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>견적의뢰 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>견적의뢰 조회</span>, key: 'read'},
                {label: <span style={{fontSize: '12px'}}>메일전송</span>, key: 'mail'}
            ]


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
        }, {
            label: '발주서',
            key: 'order',
            icon: <DiffOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>발주서 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>발주서 조회</span>, key: 'read'},
                // {label: <span style={{fontSize: '12px'}}>재고관리</span>, key: 'rfq_mail_send'},
                // {
                //     label: <span style={{fontSize: '12px'}}>정산관리</span>, key: 'rfq_mail_send', children: [
                //         {label: <span style={{fontSize: '12px'}}>거래처 별 주문조회</span>, key: 'write'},
                //         {label: <span style={{fontSize: '12px'}}>해외대리점 별 주문조회</span>, key: 'read'}
                //     ],
                // },
            ],
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
            icon: <SendOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>배송 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>배송 조회</span>, key: 'read'}
            ]
        }, {
            label: '송금',
            key: 'remittance_domestic',
            icon: <SendOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>국내 송금 등록</span>, key: 'write'},
                {label: <span style={{fontSize: '12px'}}>국내 송금 목록</span>, key: 'read'},
            ],
        }, {
            label: '데이터관리',
            key: 'data',
            icon: <MailOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>국내 매입처</span>, key: 'note'},
                {label: <span style={{fontSize: '12px'}}>해외 매업처</span>, key: 'public'},
                {label: <span style={{fontSize: '12px'}}>국내 고객사</span>, key: 'public'},
                {label: <span style={{fontSize: '12px'}}>해외 고객사</span>, key: 'public'},
                {label: <span style={{fontSize: '12px'}}>메이커</span>, key: 'public'},
                {label: <span style={{fontSize: '12px'}}>HS CODE</span>, key: 'public'},
            ],
        }, {
            label: '공지사항',
            key: 'note',
            icon: <MailOutlined/>,
            style: {margin: ' 0px -20px'},
            children: [
                {label: <span style={{fontSize: '12px'}}>공지사항</span>, key: 'note'},
                {label: <span style={{fontSize: '12px'}}>공문서</span>, key: 'public'},
            ],
        }

    ];


    const onClick = (e) => {
        const root = `/${e.keyPath[1]}_${e.keyPath[0]}`

        console.log(e.key, 'e.key::')
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
                      style={{width: '100%', fontSize: 10}} className="custom-menu"/>
            </div> : <></>}

        <Content style={{padding: 5}}>
            {children}
        </Content>

    </>
}