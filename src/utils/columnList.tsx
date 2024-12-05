import moment from "moment";
import {commonManage} from "@/utils/commonManage";

const makeAbsoluteUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

const dateFormat = (params) => {
    return moment(params.value).format('YYYY-MM-DD')
};

export const numberFormat = (params) => {
    return Math.floor(params.value).toLocaleString();
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
        headerName: '구분',
        field: 'agencyType',
        key: 'agencyType',

    },
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',

    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',

    },
    {
        headerName: '담당자',
        field: 'managerName',
        key: 'managerName',

    },
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        key: 'phoneNumber',
    },


];

export const searchMakerColumn = [
    {
        headerName: 'MAKER',
        field: 'makerName',
        minWidth: 180,
        editable: true,
    },
    {
        headerName: 'ITEM',
        field: 'item',
        editable: true,
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        editable: true,
    },
    {
        headerName: 'AREA',
        field: 'area',
        editable: true,
    },
    {
        headerName: '원산지',
        field: 'origin',
        editable: true,
    },
    {
        headerName: '담당자확인', //없음
        field: 'managerConfirm',
        editable: true,
    },
    {
        headerName: '한국대리점',
        field: 'koreanAgency',
        editable: true,
    },
    {
        headerName: '직접확인',
        field: 'directConfirm',
        editable: true,
    },
    {
        headerName: 'FTA_No.',
        field: 'ftaNumber', // 없음
        editable: true,
    },
    {
        headerName: '지시사항',
        field: 'instructions',
        editable: true,
    },
    {
        headerName: '등록자',
        field: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
        ,
    },
];


export const makerColumn = [
    {
        headerName: 'MAKER',
        field: 'makerName',
        key: 'makerName',
        minWidth: 180,
        render: (text) => <div style={{width: 80}} className="ellipsis-cell">{text}</div>,

    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
        render: (text) => <div style={{width: 80}} className="ellipsis-cell">{text}</div>,

    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
        render: (text) => <a rel="noopener noreferrer" href={makeAbsoluteUrl(text)}>
            <div style={{width: 100}} className="ellipsis-cell">{text}</div>
        </a>,

    },
    {
        headerName: 'AREA',
        field: 'area',
        key: 'area',
        align: 'center',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>
    },
    {
        headerName: '원산지',
        field: 'origin',
        key: 'origin',
        align: 'center',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>
    },
    {
        headerName: '담당자확인', //없음
        field: 'managerConfirm',
        key: 'managerConfirm',
        align: 'center',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{text}</div>
    },
    {
        headerName: '한국대리점',
        field: 'koreanAgency',
        key: 'koreanAgency',
        render: (text) => <div className="ellipsis-cell" style={{width: 100}}>{text}</div>
    },
    {
        headerName: '직접확인',
        field: 'directConfirm',
        key: 'directConfirm',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>
    },
    {
        headerName: 'FTA_No.',
        field: 'ftaNumber', // 없음
        key: 'ftaNumber',
        align: 'center',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>
    },
    {
        headerName: '지시사항',
        field: 'instructions',
        key: 'instructions',
        render: (text) => <div className="ellipsis-cell">{text}</div>
    },
];

export const subRfqWriteColumn = [
    {
        headerName: 'Model',
        field: 'model',
        minWidth: 150,
        editable: true,
    },
    {
        headerName: '수량',
        field: 'quantity',
        editable: true,
        cellEditor: 'agNumberCellEditor',
        valueFormatter: numberFormat,
    },
    {
        headerName: '단위',
        field: 'unit',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll', 'box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: 'NET/P',
        field: 'net',
        cellEditor: 'agNumberCellEditor',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 2),
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: '납기', //없음
        field: 'deliveryDate',
        editable: true,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
            min: 0,
            max: 100
        }
    },
    {
        headerName: '회신여부',
        field: 'content',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['미회신', '회신', '정보부족', '한국대리점', 'MOQ', 'OEM', '단종', '견적포기', '입찰마감', '견적불가', '기타'],
        }

    },
    {
        headerName: '회신일',
        field: 'replyDate',
        editable: true,
        cellEditor: 'agDateCellEditor',
        valueFormatter: (params) => {
            return (!params.value || params.value === 'Invalid date') ? '' : dateFormat(params)
        }

    },
    {
        headerName: '비고',
        field: 'remarks',
        editable: true,
    }
];

export const tableOrderWriteColumn = [
    {
        headerName: 'Model',
        field: 'model',
        minWidth: 150,
        editable: true,
    },

    {
        headerName: '단위',
        field: 'unit',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll', 'box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        },
    },
    {
        headerName: 'CURR',
        field: 'currency',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: 'NET/P',
        field: 'net',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 2),
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: 'Amount',
        field: 'totalAmount',
        editable: true,
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, net} = params.data;
            return Math.floor(quantity * net).toLocaleString();
        }
    },
    {
        headerName: '수량',
        field: 'quantity',
        editable: true,
        valueFormatter: numberFormat,
    },
    {
        headerName: '입고',
        field: 'receivedQuantity',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 0),
    },
    {
        headerName: '미입고',
        field: 'unreceivedQuantity',
        valueFormatter: (params) => {
            const {quantity, receivedQuantity} = params.data;
            return !isNaN(quantity - receivedQuantity) ? quantity - receivedQuantity : ''
        }
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        editable: true,
        valueFormatter: numberFormat,

    },
    {
        headerName: '금액',
        field: 'totalPrice',
        editable: true,
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, unitPrice} = params.data;
            return Math.floor(quantity * unitPrice).toLocaleString();
        }
    }
];


export const estimateTotalColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        key: 'writtenDate',
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        key: 'documentNumberFull',

    }, {
        headerName: '대리점코드',
        field: 'agencyCode',
        key: 'agencyCode',

    }, {
        headerName: '고객사명',
        field: 'customerName',
        key: 'customerName',
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
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
    },
    {
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
    },
    {
        headerName: 'NET',
        field: 'net',
        key: 'net',
    },
    {
        headerName: '금액',
        field: 'amount',
        key: 'amount',
    },
    {
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
        field: 'createdBy',
        key: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
    }
];
export const tableEstimateReadColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        width: 70,
        pinned: 'left'
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        width: 100,
        pinned: 'left'
    },
    {
        headerName: '대리점코드',
        field: 'agencyCode',
        minWidth: 70,
    },
    {
        headerName: '거래처',
        children: [
            {
                headerName: '거래처코드',
                field: 'customerCode',
                minWidth: 70,
            },
            {
                headerName: '고객사명',
                field: 'customerName',
                minWidth: 100,
            },
            {
                headerName: '거래처담당자',
                field: 'managerName',
                minWidth: 100,
            },
            {
                headerName: '전화번호',
                field: 'phoneNumber',
                minWidth: 100,
            },
            {
                headerName: '팩스번호',
                field: 'faxNumber',
                minWidth: 100,
            },

        ]
    },
    {
        headerName: '만쿠 담당자',
        children: [
            {
                headerName: '담당자',
                field: 'estimateManager',
                minWidth: 70,
            },
            {
                headerName: '이메일',
                field: 'email',
                minWidth: 100,
            },
            {
                headerName: '전화번호',
                field: 'managerPhoneNumber',
                minWidth: 100,
            },
            {
                headerName: '팩스번호',
                field: 'managerFaxNumber',
                minWidth: 100,
            },
        ]
    },
    {
        headerName: '운송',
        children: [

            {
                headerName: '결제조건',
                field: 'paymentTerms',
                minWidth: 100,
            },
            {
                headerName: '운송조건',
                field: 'shippingTerms',
                minWidth: 100,
            },
            {
                headerName: 'Delivery',
                field: 'delivery',
                minWidth: 80,
            },
            {
                headerName: '환율',
                field: 'exchangeRate',
                minWidth: 100,
                cellDataType: 'number',
                valueFormatter: (params) => {
                    return isNaN(params) ? null : parseFloat(params)
                }

            },
        ]
    },

    {
        headerName: '물품',
        children: [
            {
                headerName: 'MAKER',
                field: 'maker',
                minWidth: 80,
            },
            {
                headerName: 'ITEM',
                field: 'item',
                minWidth: 80,
            },
            {
                headerName: 'MODEL',
                field: 'model',
                minWidth: 150,
            },
            {
                headerName: '수량',
                field: 'quantity',
                minWidth: 40,
                cellDataType: 'number',
                valueFormatter: numberFormat,
            },
            {
                headerName: '단위',
                field: 'unit',
                minWidth: 40,
            },

            {
                headerName: '주문여부',
                field: 'order',
                minWidth: 80,
                cellDataType: 'text',
                initialValue: '미주문'
            },
            {
                headerName: '단가',
                field: 'unitPrice',
                minWidth: 70,
                cellDataType: 'number',
                valueFormatter: numberFormat,
                cellStyle: { textAlign: 'right' }
            },
            {
                headerName: '합계',
                field: 'amount',
                minWidth: 70,
                cellDataType: 'number'
            },
            {
                headerName: 'Amount',
                field: 'totalAmount',
                editable: true,
                valueFormatter: (params) => {
                    if (params.node.rowPinned) {
                        // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                        return params.value !== undefined ? params.value.toLocaleString() : '0';
                    }
                    const {quantity, unitPrice} = params.data;
                    return Math.floor(quantity * unitPrice).toLocaleString();
                },
                cellStyle: { textAlign: 'right' }
            },
        ]
    },
    {
        headerName: '견적유효기간',
        field: 'validityPeriod',
        minWidth: 100,
    },
    {
        headerName: '비고란',
        field: 'remarks',
        width: 150,
    },
    {
        headerName: '등록자',
        field: 'createdBy',
        width: 80,
    },

];

export const tableEstimateWriteColumns = [
    {
        headerName: 'Model',
        field: 'model',
        editable: true,
        width: 1320,
    },
    {
        headerName: '수량',
        field: 'quantity',
        editable: true,
        valueFormatter: numberFormat,
    },
    {
        headerName: '단위',
        field: 'unit',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll', 'box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        },
        editable: true,
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 0),
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: '금액',
        field: 'amount',
        width: 120,
        // editable: true,
        // valueFormatter: numberFormat,
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, unitPrice} = params.data;
            return  (!quantity || !unitPrice) ? null : Math.floor(quantity * unitPrice).toLocaleString();
        },
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: 'NET/P',
        field: 'net',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 2),
        cellStyle: { textAlign: 'right' }
    }
];



export const rfqReadColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        width: 70,
        pinned: 'left'
    },
    {
        // headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        // checkboxSelection: true, // 각 행에 체크박스 추가
        headerName: 'Document Number',
        field: 'documentNumberFull',
        cellRenderer: (params) => {
            const rowIndex = params.node.rowIndex;
            const currentData = params.value;
            const previousData = params.api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.documentNumberFull;

            // 이전 값과 같다면 빈 문자열 반환
            if (rowIndex > 0 && currentData === previousData) {
                return '';
            }
            return currentData; // 첫 번째 값만 출력
        },
    },

    {
        headerName: '대리점명',
        field: 'agencyName',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '거래처',
        children: [
            {
                headerName: '고객사명',
                field: 'customerName',
                minWidth: 100,
                maxWidth: 120,
            },
            {
                headerName: '담당자',
                field: 'managerName',
                minWidth: 100,
                maxWidth: 120,
            },
            {
                headerName: '연락처',
                field: 'phoneNumber',
                minWidth: 100,
                maxWidth: 120,
            },
        ]
    },

    {
        headerName: '물품',
        children: [
            {
                headerName: 'MAKER',
                field: 'maker',
                minWidth: 180,
            },
            {
                headerName: 'ITEM',
                field: 'item',
                minWidth: 100,
                maxWidth: 120,
            },
            {
                headerName: 'MODEL',
                field: 'model',
                minWidth: 150,
                // maxWidth: 120,
            },
            {
                headerName: '수량',
                field: 'quantity',
                minWidth: 60,
                maxWidth: 120,
                valueFormatter: numberFormat,
            },
            {
                headerName: '단위',
                field: 'unit',
                minWidth: 60,
                maxWidth: 120,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: ['ea', 'set', 'm', 'feet', 'roll', 'box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
                }
            },
            {
                headerName: 'CURR',
                field: 'currency',
                minWidth: 60,
                maxWidth: 120,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
                }
            },
            {
                headerName: 'NET/P',
                field: 'net',
                minWidth: 60,
                maxWidth: 120,
                valueFormatter: params => commonManage.calcFloat(params, 2),
                cellStyle: { textAlign: 'right' }
            },
            {
                headerName: '납기',
                field: 'deliveryDate',
                minWidth: 100,
                maxWidth: 120,
                cellEditor: 'agDateCellEditor',
                cellEditorParams: {
                    min: '2023-01-01',
                    max: '2028-12-31',
                }
            },

            {
                headerName: '회신여부',
                field: 'content',
                minWidth: 120,
                maxWidth: 120,
            },
        ]
    },


    {
        headerName: '등록자',
        field: 'createdBy',
        minWidth: 60,
        maxWidth: 120,
    },
    {
        headerName: '회신일',
        field: 'replyDate',
        minWidth: 100,
        maxWidth: 120,
        cellEditor: 'agDateCellEditor',
        cellEditorParams: {
            min: '2023-01-01',
            max: '2028-12-31',
        }
    },
    {
        headerName: 'End User',
        field: 'endUser',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '비고',
        field: 'remarks',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        minWidth: 100,
        maxWidth: 120,
        valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },

    {
        headerName: '지시사항',
        field: 'instructions',
        minWidth: 180,
        maxWidth: 120,
    },
    {
        headerName: '하단 태그란',
        field: 'footerTag',
        minWidth: 200,
        maxWidth: 120,
    },


];


export const projectColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        width: 70,
        pinned: 'left'
    },
    {
        headerName: 'rfq No.',
        field: 'rfqNo',
        width: 100,
        pinned: 'left'
    },
    {
        headerName: '마감일자',
        field: 'agencyName',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '거래처',
        children: [
            {
                headerName: '고객사명',
                field: 'customerName',
                minWidth: 100,
                maxWidth: 120,
            },
            {
                headerName: '담당자',
                field: 'managerName',
                minWidth: 100,
                maxWidth: 120,
            },
            {
                headerName: '전화번호',
                field: 'phoneNumber',
                minWidth: 100,
                maxWidth: 120,
            },
        ]
    },
    {
        headerName: '매입처',
        children: [
            {
                headerName: '매입처명',
                field: 'agencyName',
                minWidth: 100,
                maxWidth: 120,
            },
            {
                headerName: '담당자',
                field: 'managerName',
                key: 'managerName',
                minWidth: 100,
                maxWidth: 120,
            },
            {
                headerName: '전화번호',
                field: 'phoneNumber',
                key: 'phoneNumber',
                minWidth: 100,
                maxWidth: 120,
            },
        ]
    },
    {
        headerName: '물품',
        children: [
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
                valueFormatter: numberFormat,
            },
            {
                headerName: '단위',
                field: 'unit',
                key: 'unit',
                minWidth: 60,
                maxWidth: 120,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: ['ea', 'set', 'm', 'feet', 'roll', 'box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
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
                    values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
                }
            },
            {
                headerName: 'NET/P',
                field: 'net',
                key: 'net',
                minWidth: 60,
                maxWidth: 120,
                valueFormatter: params => commonManage.calcFloat(params, 2),
                cellStyle: { textAlign: 'right' }
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
                headerName: '회신여부',
                field: 'content',
                key: 'content',
                minWidth: 120,
                maxWidth: 120,
            },
        ]
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
    },

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



export const tableOrderReadColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        width: 70,
        pinned: 'left',
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        width: 80,
        pinned: 'left',
    },
    {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 150,
    },
    {
        headerName: 'MAKER',
        field: 'maker',
        align: 'center',
        minWidth: 180,
    },
    {
        headerName: 'ITEM',
        field: 'item',
        align: 'center',
        minWidth: 100,

    },
    {
        headerName: 'MODEL',
        field: 'model',
        minWidth: 150,
    },
    {
        headerName: '단위',
        field: 'unit',
        align: 'center',
        minWidth: 70,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll', 'box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        align: 'center',
        minWidth: 50,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: 'NET',
        field: 'net',
        align: 'center',
        minWidth: 40,
        valueFormatter: numberFormat,
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: '주문수량',
        field: 'quantity',
        key: 'quantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: numberFormat,
    },
    {
        headerName: '입고수량',
        field: 'receivedQuantity',
        key: 'receivedQuantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: numberFormat,
    },
    {
        headerName: '미입고수량',
        field: 'unreceivedQuantity',
        key: 'unreceivedQuantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: numberFormat,
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        key: 'unitPrice',
        align: 'center',
        minWidth: 50,
        valueFormatter: numberFormat,
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: '금액',
        field: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
        minWidth: 60,
        valueFormatter: (params) => {
            const {quantity, unitPrice} = params.data;
            return Math.floor(quantity * unitPrice).toLocaleString();
        },
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: '예상납기',
        field: 'delivery',
        key: 'delivery',
        align: 'center',
        minWidth: 80,
    },
    {
        headerName: '견적서담당자',
        field: 'estimateManager',
        key: 'estimateManager',
        align: 'center',
        minWidth: 70,
    },
    {
        headerName: '비고란',
        field: 'remarks',
        key: 'remarks',
        align: 'center',
        minWidth: 100,
    },
];


export const tableOrderInventoryColumns = [
    {
        headerName: 'No.',
        field: 'key',
        key: 'key',

        render: (text) => <div style={{width: 15}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',

        render: (text) => <div style={{width: 100}} className="ellipsis-cell">{text}</div>,
        align: 'center',
        minWidth: 180,
    },
    {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
        minWidth: 150,

        render: (text) => <div style={{width: 120}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '위치',
        field: 'location',
        key: 'location',

        render: (text) => <div style={{width: 80}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '잔량',
        field: 'remainingQuantity',
        key: 'remainingQuantity',

        render: (text) => <div style={{width: 50}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '출고량',
        field: 'usageQuantity',
        key: 'usageQuantity',

        render: (text) => <div style={{width: 50}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '입고량',
        field: 'receivedQuantity',
        key: 'receivedQuantity',
        render: (text) => <div style={{width: 50}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '입고일자',
        field: 'receiptDate',
        key: 'receiptDate',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{moment(text).format('YYYY-MM-DD')}</div>,
        align: 'center',
    },
    {
        headerName: '문서번호',
        field: 'documentNumber',
        key: 'documentNumber',
        render: (text) => <div style={{width: 80}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '수입단가',
        field: 'importUnitPrice',
        key: 'importUnitPrice',
        render: (text) => <div style={{width: 58}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
        key: 'currencyUnit',
        render: (text) => <div style={{width: 58}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
        render: (text) => <div style={{width: 50}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',

        render: (text) => <div style={{width: 120}} className="ellipsis-cell">{text}</div>,
        align: 'center',
    },
];

export const remittanceDomesticColumns = [

    {
        headerName: '운송사',
        field: 'customerName',
        width: 70,
        pinned: 'left',
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        width: 80,
        pinned: 'left',
    },
    {
        headerName: '거래처코드',
        field: 'writtenDate',
        width: 70,
    },
    {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 120,
    },
    {
        headerName: '발주일',
        field: 'writtenDate',
        width: 120,
    },
    {
        headerName: '송금일',
        field: 'writtenDate',
        width: 120,
    },
    {
        headerName: '송금액',
        field: 'writtenDate',
        width: 70,
    },
    {
        headerName: '화폐단위',
        field: 'unit',
        align: 'center',
        minWidth: 70,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll', 'box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        },
    },
    {
        headerName: '환율',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '원화',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '수수료',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '부가세',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '관세',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '운임비',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '비용 합계',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: 'VAT 포함',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: '지불수단',
        field: 'unit',
        align: 'center',
        minWidth: 60,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['현금', '신용',],
        },
    },
    {
        headerName: '판매금액',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: '영업이익',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: 'VAT 포함',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: '입고일',
        field: 'customerName',
        minWidth: 120,
    },
    {
        headerName: '출고일',
        field: 'customerName',
        minWidth: 120,
    },
    {
        headerName: '계산서발행일',
        field: 'customerName',
        minWidth: 120,
    },
    {
        headerName: '결제여부',
        field: 'unit',
        align: 'center',
        minWidth: 70,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['미결제', '부분결제', '결제완료'],
        },
    },
    {
        headerName: '선수금',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: '무게',
        field: 'customerName',
        minWidth: 70,
    },
];


export const tableOrderInventory = [
    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
    },
    {
        headerName: 'MODEL',
        field: 'model',
        key: 'model',
    },
    {
        headerName: '잔량',
        field: 'remainingQuantity',
        key: 'remainingQuantity',
    },
    {
        headerName: '출고',
        field: 'shippedQuantity',
        key: 'shippedQuantity',
    },
    {
        headerName: '합계',
        field: 'totalQuantity',
        key: 'totalQuantity',
    },
    {
        headerName: '위치',
        field: 'location',
        key: 'location',
    },

];


export const tableOrderCustomerColumns = [
    {
        headerName: 'No',
        field: 'key',
        key: 'key',
    },
    {
        headerName: '고객사명',
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
        field: 'key',
        key: 'key',
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
        field: 'pendingForeignAmount',
        key: 'pendingForeignAmount',
        valueFormatter: numberFormat,
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: '입고외화',
        field: 'receivedForeignAmount',
        key: 'receivedForeignAmount',
        valueFormatter: numberFormat,
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: '외화합계',
        field: 'totalForeignAmount',
        key: 'totalForeignAmount',
        valueFormatter: numberFormat,
        cellStyle: { textAlign: 'right' }
    },
    {
        headerName: '원화합계',
        field: 'totalAmountInKrw',
        key: 'totalAmountInKrw',
        valueFormatter: numberFormat,
        cellStyle: { textAlign: 'right' }
    },
];



export const tableCodeDomesticAgencyWriteColumns = [
    {
        headerName: '담당자',
        field: 'managerName',
        key: 'managerName',
        editable: true,
    },
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        key: 'phoneNumber',
        editable: true,
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        editable: true,
    },
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
        editable: true,
    },
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
        editable: true,
    },
    {
        headerName: '국가대리점',
        field: 'countryAgency',
        key: 'countryAgency',
        editable: true,
    },
    {
        headerName: '휴대폰',
        field: 'mobilePhone',
        key: 'mobilePhone',
        editable: true,
    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        editable: true,
    },
]


export const tableCodeDomesticPurchaseColumns = [
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',
    },
    {
        headerName: '딜러구분',
        field: 'dealerType',
        key: 'dealerType',
    },
    {
        headerName: '등급',
        field: 'grade',
        key: 'grade',
    },
    {
        headerName: '마진',
        field: 'margin',
        key: 'margin',
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
    },
    {
        headerName: 'MAKER',
        field: 'maker',
        key: 'maker',
        minWidth: 180,
    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
        key: 'tradeStartDate',
    },
    {
        headerName: '사업자번호',
        field: 'businessRegistrationNumber',
        key: 'businessRegistrationNumber',
    },
    {
        headerName: '계좌번호',
        field: 'bankAccountNumber',
        key: 'bankAccountNumber',
    },
    {
        headerName: '등록자',
        field: 'createdBy',
        key: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
        valueFormatter: (params) => {
            return (!params.value || params.value === 'Invalid date') ? '' : dateFormat(params)
        }

    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
        key: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
        valueFormatter: (params) => {
            return (!params.value || params.value === 'Invalid date') ? '' : dateFormat(params)
        }

    },
    {
        headerName: '매입처 담당자',
        children: [
            {
                headerName: '담당자',
                field: 'managerName',
                key: 'managerName',
            },
            {
                headerName: '전화번호',
                field: 'phoneNumber',
                key: 'phoneNumber',
            },
            {
                headerName: '팩스번호',
                field: 'faxNumber',
                key: 'faxNumber',
            },
            {
                headerName: '이메일',
                field: 'email',
                key: 'email',
            },
            {
                headerName: '주소',
                field: 'address',
                key: 'address',
            },
            {
                headerName: '국가대리점',
                field: 'countryAgency',
                key: 'countryAgency',
            },
            {
                headerName: '휴대폰',
                field: 'mobilePhone',
                key: 'mobilePhone',
            },
            {
                headerName: '비고',
                field: 'remarks',
                key: 'remarks',
            },
        ]
    },


];

export const tableCodeOverseasPurchaseColumns = [
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',
    },
    {
        headerName: '딜러구분',
        field: 'dealerType',
        key: 'dealerType',
    },
    {
        headerName: '등급',
        field: 'grade',
        key: 'grade',
    },
    {
        headerName: '마진',
        field: 'margin',
        key: 'margin',
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
    },
    {
        headerName: 'ITEM',
        field: 'item',
        key: 'item',
    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
        key: 'tradeStartDate',
    },
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: '담당자',
        field: 'manager',
        key: 'manager',
    },
    {
        headerName: '계좌번호',
        field: 'bankAccountNumber',
        key: 'bankAccountNumber',
    },
    {
        headerName: '국가',
        field: 'country',
        key: 'country',
    },
    {
        headerName: 'FTANo',
        field: 'ftaNo',
        key: 'ftaNo',
    },
    {
        headerName: '송금중개은행',
        field: 'bankName',
        key: 'bankName',
    },
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
    },
    {
        headerName: 'IBanCode',
        field: 'ibanCode',
        key: 'ibanCode',
    },
    {
        headerName: 'SwiftCode',
        field: 'swiftCode',
        key: 'swiftCode',
    },
    {
        headerName: '등록자',
        field: 'createdBy',
        key: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
        key: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
    },
    {
        headerName: '매입처 담당자',
        children: [
            {
                headerName: '담당자',
                field: 'customerManager',
                key: 'customerManager',
            },
            {
                headerName: '전화번호',
                field: 'phoneNumber',
                key: 'phoneNumber',
            },
            {
                headerName: '팩스번호',
                field: 'faxNumber',
                key: 'faxNumber',
            },
            {
                headerName: '이메일',
                field: 'email',
                key: 'email',
            },
            {
                headerName: '주소',
                field: 'agencyAddress',
                key: 'agencyAddress',
            },
            {
                headerName: '국가대리점',
                field: 'countryAgency',
                key: 'countryAgency',
            },
            {
                headerName: '휴대폰',
                field: 'cellPhoneNumber',
                key: 'cellPhoneNumber',
            },
            {
                headerName: '비고',
                field: 'remarks',
                key: 'remarks',
            },
        ]
    },
];


export const tableCodeOverseasAgencyWriteColumns = [

    {
        headerName: '담당자',
        field: 'customerManager',
        key: 'customerManager',
        editable: true,
    },
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        key: 'phoneNumber',
        editable: true,
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        editable: true,
    },
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
        editable: true,
    },
    {
        headerName: '주소',
        field: 'agencyAddress',
        key: 'agencyAddress',
        editable: true,
    },
    {
        headerName: '국가대리점',
        field: 'countryAgency',
        key: 'countryAgency',
        editable: true,
    },
    {
        headerName: '휴대폰',
        field: 'cellPhoneNumber',
        key: 'cellPhoneNumber',
        editable: true,
    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        editable: true,
    },
]

export const tableCodeDomesticSalesColumns = [

    {
        headerName: '코드',
        field: 'customerCode',

    },
    {
        headerName: '상호',
        field: 'customerName',

    },
    {
        headerName: '지역',
        field: 'customerRegion',

    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
    },
    {
        headerName: '전화번호',
        field: 'customerTel',

    },
    {
        headerName: '팩스번호',
        field: 'customerFax',

    },
    {
        headerName: '홈페이지',
        field: 'homepage',

    },
    {
        headerName: '우편번호',
        field: 'zipCode',

    },
    {
        headerName: '주소',
        field: 'address',

    },
    {
        headerName: '사업자번호',
        field: 'businessRegistrationNumber',

    },
    {
        headerName: '거래처',
        field: 'customerType',

    },

    {
        headerName: '비고',
        field: 'remarks',

    },
    {
        headerName: '만쿠담당자',
        field: 'mankuTradeManager',
    },
    {
        headerName: '업체확인사항',
        field: 'companyVerify',
    },
    {
        headerName: '화물운송료',
        field: 'freightCharge',

    },

    {
        headerName: '화물지점',
        field: 'freightBranch',

    },
    {
        headerName: '결제방법',
        field: 'paymentMethod',

    },
    {
        headerName: '업체형태',
        field: 'companyType',

    },
    {
        headerName: '등록자',
        field: 'createdBy',

    },
    {
        headerName: '등록일자',
        field: 'createdDate',

    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
    },

];


export const tableCodeDomesticWriteColumn = [
    {
        headerName: '담당자',
        field: 'managerName',
        editable: true,
    },
    {
        headerName: '전화번호',
        field: 'phoneNumber',
        editable: true,
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        editable: true,
    },
    {
        headerName: '휴대폰번호',
        field: 'email',
        editable: true,
    },
    {
        headerName: '이메일',
        field: 'email',
        editable: true,
    },
    {
        headerName: '비고',
        field: 'remarks',
        editable: true,
    },
]


export const tableCodeOverseasSalesColumns = [
    {
        headerName: '코드',
        field: 'agencyCode',
    },
    {
        headerName: '상호',
        field: 'agencyName',
    },
    {
        headerName: '지역',
        field: 'region',
    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
    },
    {
        headerName: '전화번호',
        field: 'phoneNumber',
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
    },
    {
        headerName: '우편번호',
        field: 'postalCode',
    },
    {
        headerName: '주소',
        field: 'address',
    },
    {
        headerName: '거래처',
        field: 'customerName',
    },
    {

        headerName: '홈페이지',
        field: 'homepage',
    },
    {

        headerName: '비고란',
        field: 'remarks',
    },
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
    },
    {
        headerName: '만쿠담당자',
        field: 'managerName',
    },
    {
        headerName: '거래처담당자',
        field: 'customerManager',
    },
    {
        headerName: 'FTANo',
        field: 'ftaNo',
    },
    {
        headerName: '업체확인사항',
        field: 'checkList',
    },
    {
        headerName: '등록자',
        field: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
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
        maxWidth: 250
    },
    {
        headerName: 'HS-CODE',
        field: 'hsCode',
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
    }, {
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
    },
    {
        headerName: '제목',
        field: 'documentTitle',
    },
    {
        headerName: '수신',
        field: 'recipient',
    },
    {
        headerName: '참조',
        field: 'reference',
    },
    {
        headerName: '소제목',
        field: 'subTitle',
    },
    {
        headerName: '내용',
        field: 'content',
    },

];
