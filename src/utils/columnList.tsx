import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";

const makeAbsoluteUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};
export default function Test(){

}
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
    },  {
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
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        fixed: 'left',
    },  {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        fixed: 'left',
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
        title: '주문', //없음
        dataIndex: 'order',
        key: 'order',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: '입고',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
    },
    {
        title: '미입고',
        dataIndex: 'unrReceivedQuantity', // 없음
        key: 'unrReceivedQuantity',
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
export const estimateReadColumns = [
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

export const estimateWriteColumns = [
    {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
        fixed: 'left',
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        fixed: 'left',
    },  {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        fixed: 'left',
    },{
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        fixed: 'left',
    },
    {
        title: '금액',
        dataIndex: 'amount',
        key: 'amount',
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
        fixed: 'left',
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

export const subInvenWriteColumns = [
    {
        title: '입고일자',
        dataIndex: 'receiptDate',
        key: 'receiptDate',
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
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: '수입단가',
        dataIndex: 'importUnitPrice',
        key: 'importUnitPrice',
    },
    {
        title: '화폐단위',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        title: '입고수량',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: '위치',
        dataIndex: 'location',
        key: 'location',
    },
    {
        title: '비고',
        dataIndex: 'remarks',
        key: 'remarks',
    },
];

export const subCustomerReadColumns = [
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


