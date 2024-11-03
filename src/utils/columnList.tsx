import moment from "moment";
import {convertDateTimeToKoreanFormat} from "@/utils/common/convertTimeToKoreanFormat";

const makeAbsoluteUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export default function Test(){

}

const formatNumber = (number) => {
    return Math.floor(number).toLocaleString();
};

export const searchCustomerColumn = [

    {
        headerName: '상호명',
        field: 'customerName',
        key: 'customerName',

    },
    {
        headerName: '담당자',
        field: 'managerName',
        key: 'managerName',

    },
    {
        headerName: '전화번호',
        field: 'directTel',
        key: 'directTel',

    },
    {
        headerName: '팩스/이메일',
        field: 'faxNumber',
        key: 'faxNumber',

    }
];
export const searchAgencyCodeColumn = [
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',

    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',

    }
];


export const makerColumn = [
    {
        headerName: 'MAKER',
        field: 'makerName',
        key: 'makerName',
        minWidth:180,
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        fixed: 'left',
    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        fixed: 'left',
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
        render: (text) => <a rel="noopener noreferrer"  href={makeAbsoluteUrl(text)}><div style={{width : 100}} className="ellipsis-cell">{text}</div></a>,

    },
    {
        headerName: 'AREA',
        field: 'area',
        key: 'area',
        align : 'center',
        render: (text) => <div className="ellipsis-cell" style={{width : 50}}>{text}</div>
    },
    {
        headerName: '원산지',
        field: 'origin',
        key: 'origin',
        align : 'center',
        render: (text) => <div className="ellipsis-cell" style={{width : 50}}>{text}</div>
    },
    {
        headerName: '담당자확인', //없음
        field: 'managerConfirm',
        key: 'managerConfirm',
        align : 'center',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    },
    {
        headerName: '한국대리점',
        field: 'koreanAgency',
        key: 'koreanAgency',
        render: (text) => <div className="ellipsis-cell" style={{width : 100}}>{text}</div>
    },
    {
        headerName: '직접확인',
        field: 'directConfirm',
        key: 'directConfirm',
        render: (text) => <div className="ellipsis-cell" style={{width : 50}}>{text}</div>
    },
    {
        headerName: 'FTA_No.',
        field: 'ftaNumber', // 없음
        key: 'ftaNumber',
        align : 'center',
        render: (text) => <div className="ellipsis-cell" style={{width : 50}}>{text}</div>
    },
    {
        headerName: '지시사항',
        field: 'instructions',
        key: 'instructions',
        render: (text) => <div className="ellipsis-cell" >{text}</div>
    },
];

export const subRfqWriteColumn = [
    {
        headerName: 'Model',
        field: 'model',
        key: 'model',
        fixed: 'left',
        minWidth: 150,
        render: (text) => <div style={{width : 180}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
        fixed: 'left',
    },  {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: 'NET/P',
        field: 'net',
        key: 'net',
        editable: true,
    },
    {
        headerName: '납기', //없음
        field: 'deliveryDate',
        key: 'deliveryDate',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '내용',
        field: 'content',
        key: 'content',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '회신일',
        field: 'replyDate',
        key: 'replyDate',
        render: (text) => <div style={{width : 90}} className="ellipsis-cell">{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        headerName: '비고',
        field: 'remarks', // 없음
        key: 'remarks',
        fixed: 'right',
        render: (text) => <div className="ellipsis-cell" >{text}</div>,
        editable: true,
    }
];

export const tableOrderWriteColumn = [
    {
        headerName: 'Model',
        field: 'model',
        key: 'model',
        fixed: 'left',
        minWidth: 150,
        render: (text) => <div style={{width : 150}} className="ellipsis-cell">{text}</div>,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
        align : 'center',
        render: (text) => <div style={{width : 50}} className="ellipsis-cell">{text}</div>,
        fixed: 'left',
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
    },
    {
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
    },
    {
        headerName: 'NET/P',
        field: 'net',
        key: 'net',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
    },
    {
        headerName: 'Amount', //없음
        field: 'amount',
        key: 'amount',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '주문\n수량',
        field: 'quantity',
        key: 'quantity',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '입고',
        field: 'receivedQuantity',
        key: 'receivedQuantity',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell" >{text}</div>,
        editable: true,
    },
    {
        headerName: '미입고',
        field: 'unreceivedQuantity',
        key: 'unreceivedQuantity',
        render: (text) =>  <div style={{width : 100}} className="ellipsis-cell" >{text}</div>,
        editable: true,
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        key: 'unitPrice',
        render: (text) =><div style={{width : 100}} className="ellipsis-cell" >{text}</div>,
        editable: true,
    },
    {
        headerName: '금액',
        field: 'price', // 없음
        key: 'price',
        fixed: 'right',
        render: (text) =><div style={{width : 100}} className="ellipsis-cell" >{text}</div>,
        editable: true,
    }
];


export const estimateTotalWriteColumns = [
    {
        headerName: '작성일자',
        field: 'searchStartDate',
        key: 'searchStartDate',
        fixed: 'left',
        editable: false,
    },
    {
        headerName: '문서번호',
        field: 'searchDocumentNumber',
        key: 'searchDocumentNumber',
        fixed: 'left',
    },  {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
        fixed: 'left',
    },{
        headerName: '거래처명',
        field: 'customerName',
        key: 'customerName',
        fixed: 'left',
    },
    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
        minWidth:180,
    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
    }, {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
        minWidth: 150,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
    },{
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
    },{
        headerName: 'NET',
        field: 'net',
        key: 'net',
    },{
        headerName: '금액',
        field: 'amount',
        key: 'amount',
    },{
        headerName: '화폐단위',
        field: 'priceUnit',
        key: 'priceUnit',
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        key: 'unitPrice',
    },
    {
        headerName: '등록자',
        field: 'register',
        key: 'register',
    },
    {
        headerName: '등록일자',
        field: 'registDate',
        key: 'registDate',
    }
];
export const tableEstimateReadColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        key: 'writtenDate',
        minWidth : 70,
        editable: false,
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        key: 'documentNumberFull',
        minWidth : 100,
    },
    {
        headerName: '대리점코드',
        field: 'agencyCode',
        key: 'agencyCode',
        minWidth : 40,
    },

    {
        headerName: '거래처코드',
        field: 'customerCode',
        key: 'customerCode',
        minWidth : 40,
    },
    {
        headerName: '거래처명',
        field: 'customerName',
        key: 'customerName',
        minWidth : 100,
    },
    {
        headerName: '거래처담당자',
        field: 'managerName',
        key: 'managerName',
        minWidth : 100,
    },
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        key: 'phoneNumber',
        minWidth : 100,
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        minWidth : 100,
    },
    {
        headerName: '견적서담당자',
        field: 'estimateManager',
        key: 'estimateManager',
        minWidth : 100,
    },
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
        minWidth : 100,
    },
    {
        headerName: '전화번호',
        field: 'managerPhoneNumber',
        key: 'managerPhoneNumber',
        minWidth : 100,
    },
    {
        headerName: '팩스번호',
        field: 'managerFaxNumber',
        key: 'managerFaxNumber',
        minWidth : 100,
    },
    {
        headerName: '유효기간',
        field: 'validityPeriod',
        key: 'validityPeriod',
        minWidth : 100,
    },

    {
        headerName: '결제조건',
        field: 'paymentTerms',
        key: 'paymentTerms',
        minWidth : 100,
    },
    {
        headerName: '운송조건',
        field: 'shippingTerms',
        key: 'shippingTerms',
        minWidth : 100,
    },
    {
        headerName: '환율',
        field: 'exchangeRate',
        key: 'exchangeRate',
        minWidth : 100,
    },


    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
        minWidth : 80,
    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
        minWidth : 80,
    },
    {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
        minWidth: 150,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
        minWidth : 40,
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        minWidth : 40,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll','box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        }
    },
    {
        headerName: 'Delivery',
        field: 'delivery',
        key: 'delivery',
        minWidth : 80,
    },
    {
        headerName: '주문',
        field: 'order',
        key: 'order',
        minWidth : 80,
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        key: 'unitPrice',
        minWidth : 40,
    },
    {
        headerName: '합계',
        field: 'total',
        key: 'total',
        minWidth : 40,
    },
    {
        headerName: '등록자',
        field: 'createdBy',
        key: 'createdBy',
        width : 80,
    },
    {
        headerName: '비고란',
        field: 'remarks',
        key: 'remarks',
        width : 150,
    }
];

export const tableEstimateWriteColumns = [
    {
        headerName: 'Model',
        field: 'model',
        key: 'model',
        fixed: 'left',
        minWidth: 150,
        render: (text) => <div className="ellipsis-cell" style={{width: 180}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
        render: (text) => <div className="ellipsis-cell" style={{width: 20}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        render: (text) => <div className="ellipsis-cell" style={{width: 20}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        key: 'unitPrice',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '금액',
        field: 'amount',
        key: 'amount',
        width : 120,
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
        render: (text) => <div className="ellipsis-cell" style={{width: 25}}>{text}</div>,
        editable: true,
    },
    {
        headerName: 'NET/P',
        field: 'net',
        key: 'net',
        render: (text) => <div className="ellipsis-cell" style={{width: 25}}>{text}</div>,
        editable: true,
    }
];


export const rfqWriteColumns = [
    {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
        minWidth: 150,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll','box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['USD', 'EUR', 'JPY', 'KRW', 'GBP',],
        }
    },
    {
        headerName: 'NET/P',
        field: 'net',
        key: 'net',
    },
    {
        headerName: '납기',
        field: 'deliveryDate',
        key: 'deliveryDate',
    },
    {
        headerName: '내용',
        field: 'content',
        key: 'content',
    },
    {
        headerName: '회신일',
        field: 'replyDate',
        key: 'replyDate',

    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',

    }
];


export const rfqReadColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        key: 'writtenDate',
        minWidth : 70,
        maxWidth: 120,
        editable: false,
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        key: 'documentNumberFull',
        minWidth: 100,
        maxWidth: 120,
    },

    {
        headerName: '대리점코드',
        field: 'agencyCode',
        key: 'agencyCode',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '대리점명',
        field: 'agencyName',
        key: 'agencyName',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '거래처코드',
        field: 'customerCode',
        key: 'customerCode',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '거래처명',
        field: 'customerName',
        key: 'customerName',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
        minWidth: 180,
    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
        minWidth: 150,
        // maxWidth: 120,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
        minWidth: 60,
        maxWidth: 120,
        // valueFormatter: formatNumber,
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        minWidth: 60,
        maxWidth: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll','box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
        minWidth: 60,
        maxWidth: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['USD', 'EUR', 'JPY', 'KRW', 'GBP',],
        }
    },
    {
        headerName: 'NET/P',
        field: 'net',
        key: 'net',
        minWidth: 60,
        maxWidth: 120,
    },
    {
        headerName: '납기',
        field: 'deliveryDate',
        key: 'deliveryDate',
        minWidth: 100,
        maxWidth: 120,
        cellEditor: 'agDateCellEditor',
        cellEditorParams: {
            min: '2023-01-01',
            max: '2028-12-31',
        }
    },

    {
        headerName: '내용',
        field: 'content',
        key: 'content',
        minWidth: 120,
        maxWidth: 120,
    },
    {
        headerName: '등록자',
        field: 'createdBy',
        key: 'createdBy',
        minWidth: 60,
        maxWidth: 120,
    },
    {
        headerName: '회신일',
        field: 'replyDate',
        key: 'replyDate',
        minWidth: 100,
        maxWidth: 120,
        cellEditor: 'agDateCellEditor',
        cellEditorParams: {
            min: '2023-01-01',
            max: '2028-12-31',
        }
    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
        minWidth: 100,
        maxWidth: 120,
        editable: false,
    },
    //.........
    {
        headerName: '지시사항',
        field: 'instructions',
        key: 'instructions',
        minWidth: 180,
        maxWidth: 120,
    },
    {
        headerName: '하단 태그란',
        field: 'footerTag',
        key: 'footerTag',
        minWidth: 200,
        maxWidth: 120,
    },





];


export const rfqMailColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        key: 'writtenDate',
        fixed: 'left',
        minWidth : 70,
        editable: false,

    },   {
        headerName: '문서번호',
        field: 'documentNumber',
        key: 'documentNumber',
    },
    {
        headerName: '거래처명',
        field: 'agencyName',
        key: 'agencyName',
        fixed: 'left',
    }, {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
        minWidth:180,
    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
    }, {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
        minWidth: 150,
        fixed: 'left',
    },{
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
        fixed: 'left',
    },

    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
    },{
        headerName: '전송여부',
        field: 'sentStatus',
        key: 'sentStatus',
    },{
        headerName: '첨부파일',
        field: 'add',
        key: 'add',
    },

     {
        headerName: '등록자',
        field: 'managerName',
        key: 'managerName',
    },
    {
        headerName: '비고',
        field: 'modifiedDate',
        key: 'modifiedDate',
        fixed: 'right',
    }
];


export const tableOrderReadColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        key: 'writtenDate',
        minWidth : 70,
        editable: false,
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        key: 'documentNumberFull',
        minWidth : 80,
    },
    {
        headerName: '거래처명',
        field: 'customerName',
        key: 'customerName',
        minWidth : 100,
    },
    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
        align : 'center',
        minWidth:180,
    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
        align : 'center',
        minWidth : 100,

    },
    {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
        minWidth: 150,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
        minWidth: 40,
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        align : 'center',
        minWidth: 40,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll','box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
        align : 'center',
        minWidth: 40,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['USD', 'EUR', 'JPY', 'KRW', 'GBP',],
        }
    },
    {
        headerName: 'NET',
        field: 'net',
        key: 'net',
        align : 'center',
        minWidth: 40,
    },
    {
        headerName: 'Amount',
        field: 'amount',
        key: 'amount',
        align : 'center',
        minWidth: 40,
    },
    {
        headerName: '주문수량',
        type: ['currency', 'shaded'],
        field: 'quantity',
        key: 'quantity',
        align : 'center',
        minWidth: 40,
    },
    {
        headerName: '입고수량',
        field: 'receivedQuantity',
        key: 'receivedQuantity',
        align : 'center',
        minWidth: 40,
    },
    {
        headerName: '미입고수량',
        field: 'unreceivedQuantity',
        key: 'unreceivedQuantity',
        align : 'center',
        minWidth: 40,
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        key: 'unitPrice',
        align : 'center',
        minWidth: 50,
    },
    {
        headerName: '금액',
        field: 'totalPrice',
        key: 'totalPrice',
        align : 'center',
        minWidth: 50,
    },
    {
        headerName: '예상납기',
        field: 'delivery',
        key: 'delivery',
        align : 'center',
        minWidth: 80,
    },
    {
        headerName: '(견적서)담당자',
        field: 'estimateManager',
        key: 'estimateManager',
        align : 'center',
        minWidth:40,
    },
    {
        headerName: '비고란',
        field: 'remarks',
        key: 'remarks',
        align : 'center',
        minWidth: 100,
    },
];


export const tableOrderInventoryColumns = [
    {
        headerName: 'No.',
        field: 'key',
        key: 'key',
        fixed: 'left',
        render: (text) => <div style={{width : 15}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
        fixed: 'left',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        align : 'center',
        minWidth:180,
    },
    {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
        minWidth: 150,
        fixed: 'left',
        render: (text) => <div style={{width :120}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '위치',
        field: 'location',
        key: 'location',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '잔량',
        field: 'remainingQuantity',
        key: 'remainingQuantity',
        fixed: 'left',
        render: (text) => <div style={{width : 50}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '출고량',
        field: 'usageQuantity',
        key: 'usageQuantity',
        fixed: 'left',
        render: (text) => <div style={{width : 50}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '입고량',
        field: 'receivedQuantity',
        key: 'receivedQuantity',
        render: (text) => <div style={{width : 50}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '입고일자',
        field: 'receiptDate',
        key: 'receiptDate',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        align : 'center',
    },
    {
        headerName: '문서번호',
        field: 'documentNumber',
        key: 'documentNumber',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '수입단가',
        field: 'importUnitPrice',
        key: 'importUnitPrice',
        render: (text) => <div style={{width : 58}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
        key: 'currencyUnit',
        render: (text) => <div style={{width : 58}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        render: (text) => <div style={{width : 50}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        fixed: 'right',
        render: (text) => <div style={{width : 120}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
];


export const tableOrderInventory = [
    {
        title: '입고일자',
        dataIndex: 'receiptDate',
        key: 'receiptDate',
        fixed: 'left',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        align : 'center',
    },
    {
        title: '문서번호',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        title: '수입단가',
        dataIndex: 'importUnitPrice',
        key: 'importUnitPrice',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        title: '화폐단위',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        title: '입고수량',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        title: '위치',
        dataIndex: 'location',
        key: 'location',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
    {
        title: '비고',
        dataIndex: 'remarks',
        key: 'remarks',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        align : 'center',
    },
];


export const tableOrderCustomerColumns = [
    {
        headerName: 'No',
        field: 'key',
        key: 'key',
    },
    {
        headerName: '거래처명',
        field: 'customerName',
        key: 'customerName',
    },
    {
        headerName: '미입고금액',
        field: 'unpaidAmount',
        key: 'unpaidAmount',
    },
    {
        headerName: '입고금액',
        field: 'paidAmount',
        key: 'paidAmount',
    },
    {
        headerName: '합계',
        field: 'totalAmount',
        key: 'totalAmount',
    },
];

export const subAgencyReadColumns = [
    {
        headerName: 'No',
        field: 'agencyId',
        key: 'agencyId',
    },
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
    },
    {
        headerName: '대리점명',
        field: 'agencyName',
        key: 'agencyName',
    },
    {
        headerName: '미입고외화',
        field: 'unpaidAmount',
        key: 'unpaidAmount',
    },
    {
        headerName: '입고외화',
        field: 'paidAmount',
        key: 'paidAmount',
    },
    {
        headerName: '외화합계',
        field: 'totalAmount',
        key: 'totalAmount',
    },
    {
        headerName: '원화합계',
        field: 'krwTotalAmount',
        key: 'krwTotalAmount',
    },
];


export const tableCodeDiplomaColumns = [
    {
        headerName: '문서번호',
        field: 'documentNumber',
        key: 'documentNumber',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '문서제목',
        field: 'headerName',
        key: 'headerName',
     render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '수신',
        field: 'to',
        key: 'to',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '참조',
        field: 'reference',
        key: 'reference',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '소제목',
        field: 'subheaderName',
        key: 'subheaderName',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '내용',
        field: 'content',
        key: 'content',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '등록자',
        field: 'registerer',
        key: 'registerer',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '등록일자',
        field: 'registerDate',
        key: 'registerDate',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '수정자',
        field: 'modifier',
        key: 'modifier',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '수정일자',
        field: 'modifyDate',
        key: 'modifyDate',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: false,
    },
    ]

export const tableCodeDomesticPurchaseColumns = [
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '딜러구분',
        field: 'dealerType',
        key: 'dealerType',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '등급',
        field: 'grade',
        key: 'grade',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '마진',
        field: 'margin',
        key: 'margin',
        render: (text) => <div className="ellipsis-cell" style={{width : 60}}>{text} &nbsp;</div>
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        minWidth:180,
        editable: true,},
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
        key: 'tradeStartDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '사업자번호',
        field: 'businessRegistrationNumber',
        key: 'businessRegistrationNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '계좌번호',
        field: 'bankAccountNumber',
        key: 'bankAccountNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '등록자',
        field: 'createdBy',
        key: 'createdBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>
    ,editable: true,},
    {
        headerName: '수정자',
        field: 'modifiedBy',
        key: 'modifiedBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
        ender: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '담당자',
        field: 'customerManager',
        key: 'customerManager',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        key: 'phoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '국가대리점',
        field: 'countryAgency',
        key: 'countryAgency',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '휴대폰',
        field: 'cellPhoneNumber',
        key: 'cellPhoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },

];

export const tableCodeOverseasPurchaseColumns = [
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '딜러구분',
        field: 'dealerType',
        key: 'dealerType',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '등급',
        field: 'grade',
        key: 'grade',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '마진',
        field: 'margin',
        key: 'margin',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
        key: 'tradeStartDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
        key: 'currencyUnit',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '담당자',
        field: 'manager',
        key: 'manager',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '계좌번호',
        field: 'bankAccountNumber',
        key: 'bankAccountNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '국가',
        field: 'country',
        key: 'country',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: 'FTANo',
        field: 'ftaNo',
        key: 'ftaNo',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '송금중개은행',
        field: 'bankName',
        key: 'bankName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: 'IBanCode',
        field: 'ibanCode',
        key: 'ibanCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: 'SwiftCode',
        field: 'swiftCode',
        key: 'swiftCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '등록자',
        field: 'createdBy',
        key: 'createdBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '수정자',
        field: 'modifiedBy',
        key: 'modifiedBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '담당자',
        field: 'customerManager',
        key: 'customerManager',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        key: 'phoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '주소',
        field: 'agencyAddress',
        key: 'agencyAddress',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '국가대리점',
        field: 'countryAgency',
        key: 'countryAgency',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '휴대폰',
        field: 'cellPhoneNumber',
        key: 'cellPhoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
    ,editable: true,},

];

export const tableCodeDomesticSalesColumns = [
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '지역',
        field: 'region',
        key: 'region',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
        key: 'tradeStartDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        key: 'phoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '우편번호',
        field: 'postalCode',
        key: 'postalCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '사업자번호',
        field: 'businessRegistrationNumber',
        key: 'businessRegistrationNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '거래처',
        field: 'customerName',
        key: 'customerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '만쿠담당자',
        field: 'managerName',
        key: 'managerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '업체확인사항',
        field: 'checkList',
        key: 'checkList',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '화물운송료',
        field: 'cargoCharge',
        key: 'cargoCharge',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '화물지점',
        field: 'cargoPoint',
        key: 'cargoPoint',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '결제방법',
        field: 'paymentMethod',
        key: 'paymentMethod',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '업체형태',
        field: 'dealerType',
        key: 'dealerType',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '등록자',
        field: 'createdBy',
        key: 'createdBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>
        ,editable: true,},
    {
        headerName: '수정자',
        field: 'modifiedBy',
        key: 'modifiedBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
        ender: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },

];

export const tableCodeOverseasSalesColumns = [
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '지역',
        field: 'region',
        key: 'region',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
        key: 'tradeStartDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        editable: true,
    },
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        key: 'phoneNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '우편번호',
        field: 'postalCode',
        key: 'postalCode',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '거래처',
        field: 'customerName',
        key: 'customerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {

        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {

        headerName: '비고란',
        field: 'remarks',
        key: 'remarks',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,
    },
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
        key: 'customerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '만쿠담당자',
        field: 'managerName',
        key: 'managerName',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '거래처담당자',
        field: 'customerManager',
        key: 'customerManager',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: 'FTANo',
        field: 'ftaNo',
        key: 'ftaNo',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '업체확인사항',
        field: 'checkList',
        key: 'checkList',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },
    {
        headerName: '등록자',
        field: 'createdBy',
        key: 'createdBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{moment(text).format('YYYY-MM-DD')}</div>
        ,editable: true,},
    {
        headerName: '수정자',
        field: 'modifiedBy',
        key: 'modifiedBy',
        render: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>
        ,editable: true,},
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
        ender: (text) => <div className="ellipsis-cell" style={{width : 70}}>{text}</div>,
        editable: true,
    },

];


export const tableCodeExchangeColumns = [
    {
        headerName: '통화',
        field: 'documentNumber',
        key: 'documentNumber',
    },
    {
        headerName: '통화명',
        field: 'documentNumber',
        key: 'documentNumber',
    },
    {
        headerName: '매매기준율',
        field: 'model',
        key: 'model',
        minWidth: 150,
    },
    {
        headerName: '송금보낼때',
        field: 'importUnitPrice',
        key: 'importUnitPrice',
    },
    {
        headerName: '송금받을때',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: '현찰살때(스프레드)',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: '현찰팔때(스프레드)',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: 'T/C살때',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: '미화환산율',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
]

export const tableCodeReadColumns = [
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
    },
    {
        headerName: 'HS-CODE',
        field: 'hsCode',
        key: 'hsCode',
    },
    ]

export const TableCodeUserColumns = [
    {
        headerName: '업체명',
        field: 'customerName',
        key: 'customerName',
    },
    {
        headerName: 'id',
        field: 'id',
        key: 'id',
    },
    {
        headerName: 'Password',
        field: 'pw',
        key: 'pw',
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
    },    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
    },

]

export const TableCodeErpColumns = [
    {
        headerName: 'ID',
        field: 'id',
        key: 'id',
    },
    {
        headerName: 'Password',
        field: 'pw',
        key: 'pw',
    },
    {
        headerName: '이름',
        field: 'name',
        key: 'name',
    },
    {
        headerName: '직급',
        field: 'position',
        key: 'position',
    },
    {
        headerName: '권한',
        field: 'right',
        key: 'right',
    },
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
    },
    {
        headerName: '연락처',
        field: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
    },
    {
        headerName: '권한정보',
        field: 'rightInfo',
        key: 'rightInfo',
    },

]

export const modalCodeDiplomaColumn = [
    {
        headerName: '문서번호',
        field: 'documentNumber',
        key: 'documentNumber',
        fixed: 'left',
        render: (text) => <div style={{width : 80}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '제목',
        field: 'headerName',
        key: 'headerName',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
        fixed: 'left',
    },
    {
        headerName: '수신',
        field: 'to',
        key: 'to',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '참조',
        field: 'reference',
        key: 'reference',
        align : 'center',
        render: (text) => <div style={{width : 40}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
    {
        headerName: '소제목',
        field: 'subheaderName',
        key: 'subheaderName',
        editable: true,
    },
    {
        headerName: '내용',
        field: 'content',
        key: 'content',
        render: (text) => <div style={{width : 100}} className="ellipsis-cell">{text}</div>,
        editable: true,
    },
];
