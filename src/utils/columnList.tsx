import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";
import moment from "moment";
import {orderStockInitial} from "@/utils/initialList";

const makeAbsoluteUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};
export default function Test(){

}
export const searchCustomerColumn = [

    {
        title: '상호명',
        dataIndex: 'customerName',
        key: 'customerName',

    },
    {
        title: '담당자',
        dataIndex: 'managerName',
        key: 'managerName',

    },
    {
        title: '전화번호',
        dataIndex: 'directTel',
        key: 'directTel',

    },
    {
        title: '팩스/이메일',
        dataIndex: 'faxNumber',
        key: 'faxNumber',

    }
];
export const searchAgencyCodeColumn = [
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',

    },
    {
        title: '상호',
        dataIndex: 'agencyName',
        key: 'agencyName',

    }
];


export const makerColumn = [
    {
        title: 'MAKER',
        dataIndex: 'makerName',
        key: 'makerName',
        width : 50,
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        fixed: 'left',
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        fixed: 'left',
    },
    {
        title: '홈페이지',
        dataIndex: 'homepage',
        key: 'homepage',
        render: (text) => <a rel="noopener noreferrer"  href={makeAbsoluteUrl(text)}><div style={{width : 100}} className="ellipsis-cell">{text}</div></a>,

    },
    {
        title: 'AREA',
        dataIndex: 'area',
        key: 'area',
        align : 'center',
        render: (text) => <div className="ellipsis-cell" style={{width : 50}}>{text}</div>
    },
    {
        title: '원산지',
        dataIndex: 'origin',
        key: 'origin',
        align : 'center',
        render: (text) => <div className="ellipsis-cell" style={{width : 50}}>{text}</div>
    },
    {
        title: '담당자확인', //없음
        dataIndex: 'managerConfirm',
        key: 'managerConfirm',
        align : 'center',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    },
    {
        title: '한국대리점',
        dataIndex: 'koreanAgency',
        key: 'koreanAgency',
        render: (text) => <div className="ellipsis-cell" style={{width : 100}}>{text}</div>
    },
    {
        title: '직접확인',
        dataIndex: 'directConfirm',
        key: 'directConfirm',
        render: (text) => <div className="ellipsis-cell" style={{width : 50}}>{text}</div>
    },
    {
        title: 'FTA_No.',
        dataIndex: 'ftaNumber', // 없음
        key: 'ftaNumber',
        align : 'center',
        render: (text) => <div className="ellipsis-cell" style={{width : 50}}>{text}</div>
    },
    {
        title: '지시사항',
        dataIndex: 'instructions',
        key: 'instructions',
        render: (text) => <div className="ellipsis-cell" >{text}</div>
    },
];

export const OrderWriteColumn = [
    {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
        fixed: 'left',
    },  {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: 'NET/P',
        dataIndex: 'net',
        key: 'net',
        editable: true,
    },
    {
        title: '납기', //없음
        dataIndex: 'deliveryDate',
        key: 'deliveryDate',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '내용',
        dataIndex: 'content',
        key: 'content',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '회신일',
        dataIndex: 'replyDate',
        key: 'replyDate',
        render: (text) => <div style={{width : 90}} className="ellipsis-cell">{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: '비고',
        dataIndex: 'remarks', // 없음
        key: 'remarks',
        fixed: 'right',
        render: (text) => <div className="ellipsis-cell" >{text}</div>,
        editable: true,
    }
];

export const estimateTotalWriteColumns = [
    {
        title: '작성일자',
        dataIndex: 'searchStartDate',
        key: 'searchStartDate',
        fixed: 'left',
    },
    {
        title: '문서번호',
        dataIndex: 'searchDocumentNumber',
        key: 'searchDocumentNumber',
        fixed: 'left',
    },  {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
        fixed: 'left',
    },{
        title: '거래처명',
        dataIndex: 'customerName',
        key: 'customerName',
        fixed: 'left',
    },
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
    }, {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
    },{
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
    },{
        title: 'NET',
        dataIndex: 'net',
        key: 'net',
    },{
        title: '금액',
        dataIndex: 'amount',
        key: 'amount',
    },{
        title: '화폐단위',
        dataIndex: 'priceUnit',
        key: 'priceUnit',
    },
    {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
    },
    {
        title: '등록자',
        dataIndex: 'register',
        key: 'register',
    },
    {
        title: '등록일자',
        dataIndex: 'registDate',
        key: 'registDate',
    }
];
export const tableEstimateReadColumns = [
    {
        title: '작성일자',
        dataIndex: 'writtenDate',
        key: 'writtenDate',
        fixed: 'left',
    },
    {
        title: '문서번호',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
        fixed: 'left',
    },
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
        fixed: 'left',
    },
    {
        title: '거래처명',
        dataIndex: 'customerName',
        key: 'customerName',
        fixed: 'left',
    },
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
    },
    {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: '납기',
        dataIndex: 'deliveryDate',
        key: 'deliveryDate',
    },
    {
        title: '주문',
        dataIndex: 'order',
        key: 'order',
    },
    {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
    },
    {
        title: '합계',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: '등록자',
        dataIndex: 'register',
        key: 'register',
    },
    {
        title: '비고란',
        dataIndex: 'remarks',
        key: 'remarks',
    }
];

export const tableEstimateWriteColumns = [
    {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
        fixed: 'left',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        fixed: 'left',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        fixed: 'left',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        fixed: 'left',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: '금액',
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: 'NET/P',
        dataIndex: 'net',
        key: 'net',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    }
];


export const rfqWriteColumns = [
    {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
    },
    {
        title: 'NET/P',
        dataIndex: 'net',
        key: 'net',
    },
    {
        title: '납기',
        dataIndex: 'deliveryDate',
        key: 'deliveryDate',
    },
    {
        title: '내용',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '회신일',
        dataIndex: 'replyDate',
        key: 'replyDate',

    },
    {
        title: '비고',
        dataIndex: 'remarks',
        key: 'remarks',

    }
];


export const rfqReadColumns = [
    {
        title: '작성일자',
        dataIndex: 'writtenDate',
        key: 'writtenDate',
        fixed: 'left',

    },
    {
        title: '거래처명',
        dataIndex: 'agencyName',
        key: 'agencyName',
        fixed: 'left',
    },
    {
        title: '문서번호',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
    },
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
    },{
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        fixed: 'left',
    },

    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',

    },
    {
        title: 'NET/P',
        dataIndex: 'net',
        key: 'net',

    },   {
        title: '납기',
        dataIndex: 'replyDate',
        key: 'replyDate',
    },    {
        title: '내용',
        dataIndex: 'content',
        key: 'content',
    },  {
        title: '등록자',
        dataIndex: 'managerName',
        key: 'managerName',
    },
    {
        title: '수정일자',
        dataIndex: 'modifiedDate',
        key: 'modifiedDate',
        fixed: 'right',
    }
];


export const rfqMailColumns = [
    {
        title: '작성일자',
        dataIndex: 'writtenDate',
        key: 'writtenDate',
        fixed: 'left',

    },   {
        title: '문서번호',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
    },
    {
        title: '거래처명',
        dataIndex: 'agencyName',
        key: 'agencyName',
        fixed: 'left',
    }, {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
    }, {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
        fixed: 'left',
    },{
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        fixed: 'left',
    },

    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
    },{
        title: '전송여부',
        dataIndex: 'sentStatus',
        key: 'sentStatus',
    },{
        title: '첨부파일',
        dataIndex: 'add',
        key: 'add',
    },

     {
        title: '등록자',
        dataIndex: 'managerName',
        key: 'managerName',
    },
    {
        title: '비고',
        dataIndex: 'modifiedDate',
        key: 'modifiedremarksremarksDate',
        fixed: 'right',
    }
];


export const subOrderWriteColumns = [
    {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
    },
    {
        title: 'NET/P',
        dataIndex: 'net',
        key: 'net',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: '주문',  // 없음
        dataIndex: 'orderQuantity',
        key: 'orderQuantity',
    },
    {
        title: '입고',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
    },
    {
        title: '미입고',
        dataIndex: 'unreceivedQuantity',
        key: 'unreceivedQuantity',
    },
    {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
    },
    {
        title: '금액',
        dataIndex: 'price',
        key: 'price',
    },
];

export const subOrderReadColumns = [
    {
        title: 'No',
        dataIndex: 'inventoryId',
        key: 'inventoryId',
        fixed: 'left',

    },
    {
        title: '작성일자',
        dataIndex: 'writtenDate',
        key: 'writtenDate',
        fixed: 'left',

    },
    {
        title: '문서번호',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
    },
    {
        title: '거래처명',
        dataIndex: 'agencyName',
        key: 'agencyName',
        fixed: 'left',
    }, {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
    }, {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
        fixed: 'left',
    },{
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        fixed: 'left',
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
    },
    {
        title: 'NET',
        dataIndex: 'net',
        key: 'net',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: '주문수량',
        dataIndex: 'orderQuantity',
        key: 'orderQuantity',
    },
    {
        title: '입고수량',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
    },
    {
        title: '미입고수량',
        dataIndex: 'unreceivedQuantity',
        key: 'unreceivedQuantity',
    },
    {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
    },
    {
        title: '금액',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: '예상납기',  // 없음
        dataIndex: 'deliveryDate',
        key: 'deliveryDate',
    },
    {
        title: '(견적서)담당자',
        dataIndex: 'estimateManager',
        key: 'estimateManager',
    },
    {
        title: '비고란',
        dataIndex: 'remarks',
        key: 'remarks',
    },
];

export const subInvenReadColumns = [
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
    }, {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
        fixed: 'left',
    },
    {
        title: '잔량',
        dataIndex: 'quantity',
        key: 'quantity',
        fixed: 'left',
    },
    {
        title: '출고',
        dataIndex: 'release',
        key: 'release',
    },
    {
        title: '합계',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: '위치',
        dataIndex: 'location',
        key: 'location',
    },
];

export const orderStockColumns = [
    {
        title: '입고일자',
        dataIndex: 'receiptDate',
        key: 'receiptDate',
        fixed: 'left',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: '문서번호',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '수입단가',
        dataIndex: 'importUnitPrice',
        key: 'importUnitPrice',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '화폐단위',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '입고수량',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '위치',
        dataIndex: 'location',
        key: 'location',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '비고',
        dataIndex: 'remarks',
        key: 'remarks',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
];

export const subCustomerReadColumns = [
    {
        title: 'No',
        dataIndex: 'agencyId',
        key: 'agencyId',
    },
    {
        title: '거래처명',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: '미입고금액',
        dataIndex: 'unpaidAmount',
        key: 'unpaidAmount',
    },
    {
        title: '입고금액',
        dataIndex: 'paidAmount',
        key: 'paidAmount',
    },
    {
        title: '합계',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
    },
];

export const subAgencyReadColumns = [
    {
        title: 'No',
        dataIndex: 'agencyId',
        key: 'agencyId',
    },
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
    },
    {
        title: '대리점명',
        dataIndex: 'agencyName',
        key: 'agencyName',
    },
    {
        title: '미입고외화',
        dataIndex: 'unpaidAmount',
        key: 'unpaidAmount',
    },
    {
        title: '입고외화',
        dataIndex: 'paidAmount',
        key: 'paidAmount',
    },
    {
        title: '외화합계',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
    },
    {
        title: '원화합계',
        dataIndex: 'krwTotalAmount',
        key: 'krwTotalAmount',
    },
];


export const tableCodeDiplomaColumns = [
    {
        title: '문서번호',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '문서제목',
        dataIndex: 'title',
        key: 'title',
     render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '수신',
        dataIndex: 'to',
        key: 'to',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '참조',
        dataIndex: 'reference',
        key: 'reference',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '소제목',
        dataIndex: 'subTitle',
        key: 'subTitle',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '내용',
        dataIndex: 'content',
        key: 'content',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '등록자',
        dataIndex: 'registerer',
        key: 'registerer',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '등록일자',
        dataIndex: 'registerDate',
        key: 'registerDate',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '수정자',
        dataIndex: 'modifier',
        key: 'modifier',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '수정일자',
        dataIndex: 'modifyDate',
        key: 'modifyDate',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    ]

export const tableCodeDomesticPurchaseColumns = [
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '상호',
        dataIndex: 'agencyName',
        key: 'agencyName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '딜러구분',
        dataIndex: 'dealerType',
        key: 'dealerType',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '등급',
        dataIndex: 'grade',
        key: 'grade',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '마진',
        dataIndex: 'margin',
        key: 'margin',
        render: (text) => <div className="ellipsis-cell" style={{width : 60}}>{text} &nbsp;</div>
    },
    {
        title: '홈페이지',
        dataIndex: 'homepage',
        key: 'homepage',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '거래시작일',
        dataIndex: 'tradeStartDate',
        key: 'tradeStartDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '사업자번호',
        dataIndex: 'businessRegistrationNumber',
        key: 'businessRegistrationNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '계좌번호',
        dataIndex: 'bankAccountNumber',
        key: 'bankAccountNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '등록자',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '등록일자',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>
    ,editable: true,},
    {
        title: '수정자',
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '수정일자',
        dataIndex: 'modifiedDate',
        key: 'modifiedDate',
        ender: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '담당자',
        dataIndex: 'customerManager',
        key: 'customerManager',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '전화번호',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '팩스번호',
        dataIndex: 'faxNumber',
        key: 'faxNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '이메일',
        dataIndex: 'email',
        key: 'email',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '주소',
        dataIndex: 'address',
        key: 'address',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '국가대리점',
        dataIndex: 'countryAgency',
        key: 'countryAgency',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '휴대폰',
        dataIndex: 'cellPhoneNumber',
        key: 'cellPhoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '비고',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },

];

export const tableCodeOverseasPurchaseColumns = [
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '상호',
        dataIndex: 'agencyName',
        key: 'agencyName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '딜러구분',
        dataIndex: 'dealerType',
        key: 'dealerType',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '등급',
        dataIndex: 'grade',
        key: 'grade',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '마진',
        dataIndex: 'margin',
        key: 'margin',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '홈페이지',
        dataIndex: 'homepage',
        key: 'homepage',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '거래시작일',
        dataIndex: 'tradeStartDate',
        key: 'tradeStartDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '화폐단위',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '담당자',
        dataIndex: 'manager',
        key: 'manager',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '계좌번호',
        dataIndex: 'bankAccountNumber',
        key: 'bankAccountNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '국가',
        dataIndex: 'country',
        key: 'country',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: 'FTANo',
        dataIndex: 'ftaNo',
        key: 'ftaNo',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '송금중개은행',
        dataIndex: 'bankName',
        key: 'bankName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '주소',
        dataIndex: 'address',
        key: 'address',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: 'IBanCode',
        dataIndex: 'ibanCode',
        key: 'ibanCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: 'SwiftCode',
        dataIndex: 'swiftCode',
        key: 'swiftCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '등록자',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '등록일자',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '수정자',
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '수정일자',
        dataIndex: 'modifiedDate',
        key: 'modifiedDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '담당자',
        dataIndex: 'customerManager',
        key: 'customerManager',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '전화번호',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '팩스번호',
        dataIndex: 'faxNumber',
        key: 'faxNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '이메일',
        dataIndex: 'email',
        key: 'email',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '주소',
        dataIndex: 'agencyAddress',
        key: 'agencyAddress',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '국가대리점',
        dataIndex: 'countryAgency',
        key: 'countryAgency',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '휴대폰',
        dataIndex: 'cellPhoneNumber',
        key: 'cellPhoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        title: '비고',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},

];

export const tableCodeDomesticSalesColumns = [
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '상호',
        dataIndex: 'agencyName',
        key: 'agencyName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '지역',
        dataIndex: 'region',
        key: 'region',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '거래시작일',
        dataIndex: 'tradeStartDate',
        key: 'tradeStartDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: '전화번호',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        title: '팩스번호',
        dataIndex: 'faxNumber',
        key: 'faxNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '홈페이지',
        dataIndex: 'homepage',
        key: 'homepage',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '우편번호',
        dataIndex: 'postalCode',
        key: 'postalCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '주소',
        dataIndex: 'address',
        key: 'address',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '사업자번호',
        dataIndex: 'businessRegistrationNumber',
        key: 'businessRegistrationNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '거래처',
        dataIndex: 'customerName',
        key: 'customerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '비고',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '만쿠담당자',
        dataIndex: 'managerName',
        key: 'managerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '업체확인사항',
        dataIndex: 'checkList',
        key: 'checkList',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '화물운송료',
        dataIndex: 'cargoCharge',
        key: 'cargoCharge',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '화물지점',
        dataIndex: 'cargoPoint',
        key: 'cargoPoint',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '결제방법',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '업체형태',
        dataIndex: 'dealerType',
        key: 'dealerType',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '등록자',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        title: '등록일자',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>
        ,editable: true,},
    {
        title: '수정자',
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        title: '수정일자',
        dataIndex: 'modifiedDate',
        key: 'modifiedDate',
        ender: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },

];

export const tableCodeOverseasSalesColumns = [
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '상호',
        dataIndex: 'agencyName',
        key: 'agencyName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '지역',
        dataIndex: 'region',
        key: 'region',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '거래시작일',
        dataIndex: 'tradeStartDate',
        key: 'tradeStartDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        title: '전화번호',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        title: '팩스번호',
        dataIndex: 'faxNumber',
        key: 'faxNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '우편번호',
        dataIndex: 'postalCode',
        key: 'postalCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '주소',
        dataIndex: 'address',
        key: 'address',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '거래처',
        dataIndex: 'customerName',
        key: 'customerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {

        title: '홈페이지',
        dataIndex: 'homepage',
        key: 'homepage',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {

        title: '비고란',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        title: '화폐단위',
        dataIndex: 'currencyUnit',
        key: 'customerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '만쿠담당자',
        dataIndex: 'managerName',
        key: 'managerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '거래처담당자',
        dataIndex: 'customerManager',
        key: 'customerManager',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: 'FTANo',
        dataIndex: 'ftaNo',
        key: 'ftaNo',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '업체확인사항',
        dataIndex: 'checkList',
        key: 'checkList',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        title: '등록자',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        title: '등록일자',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>
        ,editable: true,},
    {
        title: '수정자',
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        title: '수정일자',
        dataIndex: 'modifiedDate',
        key: 'modifiedDate',
        ender: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },

];


export const tableCodeExchangeColumns = [
    {
        title: '통화',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
    },
    {
        title: '통화명',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
    },
    {
        title: '매매기준율',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: '송금보낼때',
        dataIndex: 'importUnitPrice',
        key: 'importUnitPrice',
    },
    {
        title: '송금받을때',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        title: '현찰살때(스프레드)',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        title: '현찰팔때(스프레드)',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        title: 'T/C살때',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        title: '미화환산율',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
    },
]

export const tableCodeReadColumns = [
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
    },
    {
        title: 'HS-CODE',
        dataIndex: 'hsCode',
        key: 'hsCode',
    },
    ]

export const TableCodeUserColumns = [
    {
        title: '업체명',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Password',
        dataIndex: 'pw',
        key: 'pw',
    },
    {
        title: '홈페이지',
        dataIndex: 'homepage',
        key: 'homepage',
    },    {
        title: '비고',
        dataIndex: 'remarks',
        key: 'remarks',
    },

]

export const TableCodeErpColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Password',
        dataIndex: 'pw',
        key: 'pw',
    },
    {
        title: '이름',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '직급',
        dataIndex: 'position',
        key: 'position',
    },
    {
        title: '권한',
        dataIndex: 'right',
        key: 'right',
    },
    {
        title: '이메일',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '연락처',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: '팩스번호',
        dataIndex: 'faxNumber',
        key: 'faxNumber',
    },
    {
        title: '권한정보',
        dataIndex: 'rightInfo',
        key: 'rightInfo',
    },

]

export const modalCodeDiplomaColumn = [
    {
        title: '문서번호',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '제목',
        dataIndex: 'title',
        key: 'title',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
        fixed: 'left',
    },
    {
        title: '수신',
        dataIndex: 'to',
        key: 'to',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '참조',
        dataIndex: 'reference',
        key: 'reference',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        title: '소제목',
        dataIndex: 'subTitle',
        key: 'subTitle',
        editable: true,
    },
    {
        title: '내용',
        dataIndex: 'content',
        key: 'content',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
];
