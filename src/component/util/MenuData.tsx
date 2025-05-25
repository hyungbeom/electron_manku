import {
    CarFilled,
    CopyFilled, DatabaseFilled,
    DropboxSquareFilled,
    FileUnknownFilled, PoundCircleFilled,
    ProjectFilled, SettingOutlined,
    WalletFilled
} from "@ant-design/icons";
import React from "react";

export default function MenuData() {
    return <></>
}

export const treeData = [
    {
        title: "프로젝트",
        key: "project",
        children: [
            {title: "프로젝트 등록", key: "project_write"},
            {title: "프로젝트 조회", key: "project_read"}
        ],
    },
    {
        title: "견적의뢰",
        key: "rfq",
        children: [
            {title: "견적의뢰 등록", key: "rfq_write"},
            {title: "견적의뢰 조회", key: "rfq_read"},
            {title: "메일전송", key: "rfq_mail_send"},
        ],
    }, {
        title: "견적서",
        key: "estimate",
        children: [
            {title: "견적서 등록", key: "estimate_write"},
            {title: "견적서 조회", key: "estimate_read"},
        ],
    }, {
        title: "발주서",
        key: "order",
        children: [
            {title: "국내발주서 등록", key: "order_write",},
            {title: "해외발주서 등록", key: "seaOrder_write",},
            {title: "발주서 조회", key: "order_read"},
            {title: "입고예정 조회", key: "expected_delivery_read"}
        ],
    }, {
        title: "입고",
        key: "store",
        children: [
            {title: "입고 등록", key: "store_write"},
            {title: "입고 조회", key: "store_read"}
        ],
    }, {
        title: "배송",
        key: "delivery",
        children: [
            {title: "배송 등록", key: "delivery_write"},
            {title: "배송 조회", key: "delivery_read"}
        ],
    }, {
        title: "송금",
        key: "remittance",
        children: [
            {title: "국내송금 등록", key: "domestic_remittance_write"},
            {title: "국내송금 조회", key: "domestic_remittance_read"},
            {title: "해외송금 등록", key: "overseas_remittance_write"},
            {title: "해외송금 조회", key: "overseas_remittance_read"},
            {title: "세금계산서 요청 등록", key: "tax_invoice_write"},
            {title: "세금계산서 요청 조회", key: "tax_invoice_read"}
        ],
    }, {
        title: "데이터관리",
        key: "data",
        children: [
            {
                title: "매입처", key: "agency", children: [
                    {title: "국내매입처 등록", key: "domestic_agency_write"},
                    {title: "국내매입처 조회", key: "domestic_agency_read"},
                    {title: "해외매입처 등록", key: "overseas_agency_write"},
                    {title: "해외매입처 조회", key: "overseas_agency_read"},
                ]
            },
            {
                title: "고객사", key: "customer", children: [
                    {title: "국내고객사 등록", key: "domestic_customer_write"},
                    {title: "국내고객사 조회", key: "domestic_customer_read"},
                    {title: "해외고객사 등록", key: "overseas_customer_write"},
                    {title: "해외고객사 조회", key: "overseas_customer_read"},
                ]
            },
            {
                title: "메이커", key: "maker", children: [
                    {title: "메이커 등록", key: "maker_write"},
                    {title: "메이커 조회", key: 'maker_read'}
                ]
            },
            {
                title: "회사계정관리", key: "company_account", children: [
                    {title: "회사계정관리 등록", key: "company_account_write"},
                    {title: "회사계정관리 조회", key: "company_account_read"},
                ]
            },
            {
                title: "재고관리", key: "source", children: [
                    {title: "재고관리 등록", key: "source_write"},
                    {title: "재고관리 조회", key: "source_read"},
                ]
            },

            {title: "HS CODE 조회", key: "hscode_read"},
        ],
    }, {
        title: "기타",
        key: "etc",
        children: [
            {title: "알림요청 조회", key: "alert_read"},
        ],
    }
];


export const introMenulist = [
    {
        icon: <ProjectFilled/>,
        color: 'blueviolet',
        title: '프로젝트',
        children: [{name: '프로젝트 등록', key: 'project_write'}, {name: '프로젝트 조회', key: 'project_read'}]
    },
    {
        icon: <FileUnknownFilled/>,
        color: 'indianred',
        title: '견적의뢰',
        children: [{name: '견적의뢰 등록', key: 'rfq_write'}, {name: '견적의뢰 조회', key: 'rfq_read'}, {
            name: '메일전송',
            key: 'rfq_mail_send'
        }]
    },
    {
        icon: <CopyFilled/>,
        color: 'yellowgreen',
        title: '견적서',
        children: [{name: '견적서 등록', key: 'estimate_write'}, {name: '견적서 조회', key: 'estimate_read'}, {
            name: '통합견적서',
            key: ''
        }]
    },
    {
        icon: <WalletFilled/>,
        color: 'darkolivegreen',
        title: '발주서',
        children: [{name: '국내발주서 등록', key: 'order_write'}, {name: '해외발주서 등록', key: 'seaOrder_write'}, {
            name: '발주서 조회',
            key: 'order_read'
        }, {name: '입고예정 조회', key: 'expected_delivery_read'}]
    },
    {
        icon: <DropboxSquareFilled/>,
        color: 'lightskyblue',
        title: '입고',
        children: [{name: '입고 등록', key: 'store_write'}, {name: '입고 조회', key: 'store_read'}]
    },
    {
        icon: <CarFilled/>,
        color: 'teal',
        title: '배송',
        children: [{name: '배송 등록', key: 'delivery_write'}, {name: '배송 조회', key: 'delivery_read'}]
    },
    {
        icon: <PoundCircleFilled/>,
        color: 'burlywood',
        title: '송금',
        children: [
            {name: '국내송금 등록', key: 'domestic_remittance_write'},
            {name: '국내송금 조회', key: 'domestic_remittance_read'},
            {name: '해외송금 등록', key: 'overseas_remittance_write'},
            {name: '해외송금 조회', key: 'overseas_remittance_read'},
            {name: '세금계산서 요청 등록', key: 'tax_invoice_write'},
            {name: '세금계산서 요청 조회', key: 'tax_invoice_read'}
        ]
    },
    {
        icon: <DatabaseFilled/>, color: 'dimgray',
        title: '데이터관리',
        children: [{name: '국내매입처 조회', key: 'domestic_agency_read'}, {name: '해외매입처 조회', key: 'overseas_agency_read'},
            {name: '국내거래처 조회', key: 'domestic_customer_read'}, {name: '해외거래처 조회', key: 'overseas_customer_read'},
            {name: '메이커 조회', key: 'maker_read'}, {name: '회사계정관리 조회', key: 'company_account_read'},
            {name: '재고관리 조회', key: 'source_read'}, {name: 'HS CODE', key: 'hscode_read'}]
    }, {
        icon: <SettingOutlined/>, color: 'black',
        title: '시스템관리',
        children: [{name: '승인 관리자', key: 'accept_member'}, {
            name: '데이터 로그 관리',
            key: 'data_log'
        }, {
            name: '통계페이지',
            key: 'chart_data'
        }]
    },
]