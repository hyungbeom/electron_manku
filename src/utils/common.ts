export const TagTypeList = {
    "model": {type : 'input'},
    "quantity": {type : 'inputNumber'},

    "currency": {type : 'select', boxList : ['USD', 'EUR', 'JPY', 'KRW', 'GBP']},
    "net": {type : 'inputNumber'},

    "currencyUnit": {type : 'select', boxList : ['EA', 'SET', 'M', 'FEAT', 'ROLL', 'BOX','G','KG','PACK', 'INCH', 'MOQ']},
    "deliveryDate": {type : 'input'},
    "content": {type : 'textArea'},
    "replyDate": {type : 'date'},
    "remarks": {type : 'textArea'},
    "searchType": {type : 'select'},
    "searchStartDate": {type : 'date'},  // 작성일자 시작일
    "searchEndDate": {type : 'date'},  // 작성일자 종료일
    "searchDocumentNumber": {type : 'input'},  // 문서번호
    "searchCustomerName": {type : 'input'},  // 거래처명
    "searchMaker": {type : 'input'},                // MAKER
    "searchModel": {type : 'input'},                  // MODEL
    "searchItem": {type : 'input'},              // ITEM
    "searchCreatedBy": {type : 'input'},        // 등록직원명
    "unit": {type : 'select', boxList : ['EA', 'SET', 'M', 'FEAT', 'ROLL', 'BOX','G','KG','PACK', 'INCH', 'MOQ']},               // 단위

    "agencyCode": {type : 'input'},
    "dealerType": {type : 'select', boxList : ['딜러', '제조',]},
    "grade": {type : 'select', boxList : ['A', 'B', 'C', 'D']},
    "margin": {type : 'inputNumber'},
    "agencyName": {type : 'input'},
    "maker": {type : 'input'},
    "homepage": {type : 'input'},
    "businessRegistrationNumber": {type : 'input'},
    "item": {type : 'input'},
    "tradeStartDate": {type : 'input'},
    "bankAccountNumber": {type : 'input'},
    "createdBy": {type : 'input'},
    "createdDate": {type : 'date'},
    "modifiedBy": {type : 'input'},
    "modifiedDate": {type : 'date'},
    "customerManager": {type : 'input'},
    "phoneNumber": {type : 'input'},
    "faxNumber": {type : 'input'},
    "email": {type : 'input'},
    "address": {type : 'input'},
    "countryAgency": {type : 'input'},
    "cellPhoneNumber": {type : 'input'},

    "receiptDate": {type : 'date'},
    "documentNumber": {type : 'input'},
    "importUnitPrice": {type : 'inputNumber'},
    "receivedQuantity": {type : 'inputNumber'},
    "location": {type : 'input'},

    "title": {type : 'input'},
    "to": {type : 'input'},
    "reference": {type : 'input'},
    "subTitle": {type : 'input'},

    "manager": {type : 'input'},
    "country": {type : 'input'},
    "ftaNo": {type : 'input'},
    "bankName": {type : 'input'},
    "ibanCode": {type : 'input'},
    "swiftCode": {type : 'input'},

    "agencyId": {type:'input'},
    "region": {type : 'input'},
    "postalCode": {type : 'input'},
    "customerName": {type : 'input'},
    "managerName": {type : 'input'},
    "checkList": {type : 'TextArea'},
    "cargoCharge": {type : 'select', boxList : ['화물 후불', '택배후불', '화물선불', '택배선불']},               // 단위
    "cargoPoint": {type : 'input'},
    "paymentMethod": {type : 'select', boxList : ['현금결제', '선수금', '정기결제']},

    "unitPrice": {type : 'inputNumber'},           // 단가
    "amount": {type : 'inputNumber'},
    "unreceivedQuantity": {type : 'inputNumber'},
    "price": {type : 'inputNumber'},

    "remainingQuantity": {type : 'inputNumber'},
    "usageQuantity": {type : 'inputNumber'},



}




export const refWriteInitial = {
    "documentNumber": 1,
    "writtenDate": "2024-09-11",
    "agencyCode": "k10",
    "agencyName": "인텍오토메이션",
    "customerCode": "1",
    "customerName": "(주)발해에프유테크",
    "phoneNumber": "test",
    "faxNumber": "033-921984109",
    "customerManagerID": 2,
    "managerName": null,
    "maker": "maker",
    "item": "item",
    "remarks": "note",
    "footerTag": null,
    "createdBy": "sample1",
    "attachment": "",
    "instructions": "remarks",
    "estimateRequestDetailList": [
        {
            "model": "model",
            "quantity": 1,
            "unit": "ea",
            "currency": "krw",
            "net": 60000.00,
            "sentStatus": null,
            "serialNumber": 1,
            "replySummaryID": 43407,
            "unitPrice": 60000.00,
            "currencyUnit": "ea",
            "deliveryDate": "a day ago",
            "content": "test",
            "replyDate": "2024-09-27",
            "remarks": "test"
        }
    ]
}

export const estimateWriteInitial = {
    "documentNumberFull": "", // INQUIRY No.
    "writtenDate": "",    // 작성일
    "agencyCode": "",            // 대리점코드
    "customerCode": "",             // CUSTOMER 코드
    "customerName": "",    // 상호명
    "managerName": "",      // 담당자
    "phoneNumber": "",  // 전화번호
    "faxNumber": "",                // 팩스번호
    "validityPeriod": "",    // 유효기간
    "paymentTerms": "",                // 결제조건
    "shippingTerms": "",             // 운송조건
    "exchangeRate": "",                  // 환율
    "estimateManager": "",            // 담당자
    "email": "",             // E-MAIL
    "managerPhoneNumber": "",   // 전화번호
    "managerFaxNumber": "",       // 팩스번호
    "maker": "",      // MAKER
    "item": "",      // ITEM
    "delivery": "",    // Delivery
    "remarks": "",          // 비고란
    "estimateDetailList": [
        {
            "model": "",   // MODEL
            "quantity": 0,                  // 수량
            "unit": "",                   // 단위
            "currency": "",              // CURR
            "net": 0,                 // NET/P
            "unitPrice": 0,           // 단가
            "amount": 0               // 금액
        }
    ]
}

export const estimateInfo = {
    documentNumberFull : {type : 'input', title : 'INQUERY No.', size : 50},
    writtenDate : {type : 'datePicker', title : '작성일', size : 50},
    agencyCode : {type : 'searchInput', title : '대리점코드', size : 50},
    customerCode : {type : 'input', title : 'CUSTOMER 코드', size : 50},
    customerName : {type : 'searchInput', title : '상호명', size : 50},
    managerName : {type : 'input', title : '담당자', size : 50},
    phoneNumber : {type : 'input', title : '전화번호', size : 50},
    faxNumber : {type : 'input', title : '팩스번호', size : 50},
    validityPeriod : {type : 'selectBox', title : '유효기간', boxList :['견적 발행 후 10일간', '견적 발행 후 30일간'], size : 50},
    paymentTerms : {type : 'selectBox', title : '결제조건', boxList : ['발주시50% / 납품시 50%', '납품시 현금결제', '정기결제'], size : 50},
    shippingTerms : {type : 'selectBox', title : '운송조건', boxList : ['귀사도착도', '화물 & 택배비별도'], size : 50},
    exchangeRate : {type : 'input', title : '환율', size : 50},
    estimateManager : {type : 'input', title : '담당자', size : 50},
    email : {type : 'input', title : '이메일', size : 50},
    managerPhoneNumber : {type : 'input', title : '전화번호', size : 50},
    managerFaxNumber : {type : 'input', title : '팩스번호', size : 50},
    maker : {type : 'input', title : 'maker', size : 50},
    item : {type : 'input', title : 'item', size : 50},
    delivery : {type : 'input', title : 'delivery', size : 50},
    remarks : {type : 'inputArea', title : '비고란', size : 100},
}



export const estimateReadInitial = {
    searchDocumentNumber : '',
    searchDate : '',
    searchType : 0,
    searchCustomerName : '',
    searchMaker :'',
    searchModel : '',
    searchItem : '',
    searchCreatedBy : '',
}

export const estimateReadInfo = {
    searchDocumentNumber : {type : 'input', title : '문서번호', size : 50},
    searchDate : {type : 'datePicker', title : '작성일자', size : 50},
    searchType : {type : 'selectBox', title : '검색조건',boxList : ['전체','주문','미주문'], size : 50},
    searchCustomerName : {type : 'input', title : '거래처명', size : 50},
    searchMaker : {type : 'input', title : 'MAKER', size : 50},
    searchModel : {type : 'input', title : 'MODEL', size : 50},
    searchItem : {type : 'input', title : 'ITEM', size : 50},
    searchCreatedBy : {type : 'input', title : '등록직원명', size : 50},
}


export const estimateTotalWriteInitial = {
    searchDocumentNumber : '',
    searchDate : '',
    searchCustomerName : '',
    searchMaker :'',
    storeCode :'',
    searchModel : '',
    searchItem : '',
    searchCreatedBy : '',
}

export const estimateTotalWriteInfo = {
    searchDocumentNumber : {type : 'input', title : '문서번호', size : 50},
    searchDate : {type : 'datePicker', title : '작성일자', size : 50},
    searchType : {type : 'selectBox', title : '검색조건',boxList : ['전체','주문','미주문'], size : 50},
    searchCustomerName : {type : 'input', title : '거래처명', size : 50},
    searchMaker : {type : 'input', title : 'MAKER', size : 50},
    storeCode : {type : 'input', title : '대리점코드', size : 50},
    searchModel : {type : 'input', title : 'MODEL', size : 50},
    searchItem : {type : 'input', title : 'ITEM', size : 50},
    searchCreatedBy : {type : 'input', title : '등록직원명', size : 50},
}

export const estimateTotalWriteColumn = [
    {
        title: '작성일자',
        dataIndex: 'searchDate',
        key: 'searchDate',
        fixed: 'left',

    },
    {
        title: '문서번호',
        dataIndex: 'searchDocumentNumber',
        key: 'searchDocumentNumber',
    },
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
    },
    {
        title: '거래처명',
        dataIndex: 'searchCustomerName',
        key: 'searchCustomerName',
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
    },    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
    },    {
        title: 'NET',
        dataIndex: 'net',
        key: 'net',
    },  {
        title: '금액',
        dataIndex: 'amount',
        key: 'amount',
    },  {
        title: '화폐단위',
        dataIndex: 'payUnit',
        key: 'payUnit',
    },  {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
    },  {
        title: '등록자',
        dataIndex: 'writer',
        key: 'writer',
    },  {
        title: '등록일자',
        dataIndex: 'registDate',
        key: 'registDate',
    },
];

// =============================   data   ================================