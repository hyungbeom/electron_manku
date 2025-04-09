import {iconSetMaterial, themeQuartz} from "@ag-grid-community/theming";

export const TagTypeList = {
    "model": {type: 'input'},
    "quantity": {type: 'inputNumber'},

    "currency": {type: 'select', boxList: ['USD', 'EUR', 'JPY', 'KRW', 'GBP']},
    "net": {type: 'inputNumber'},

    "currencyUnit": {
        type: 'select',
        boxList: ['EA', 'SET', 'M', 'FEAT', 'ROLL', 'BOX', 'G', 'KG', 'PACK', 'INCH', 'MOQ']
    },
    "deliveryDate": {type: 'input'},
    "content": {type: 'textArea'},
    "replyDate": {type: 'date'},
    "remarks": {type: 'textArea'},
    "searchType": {type: 'select'},
    "searchStartDate": {type: 'date'},  // 작성일자 시작일
    "searchEndDate": {type: 'date'},  // 작성일자 종료일
    "searchDocumentNumber": {type: 'input'},  // 문서번호
    "searchCustomerName": {type: 'input'},  // 고객사명
    "searchMaker": {type: 'input'},                // Maker
    "searchModel": {type: 'input'},                  // Model
    "searchItem": {type: 'input'},              // Item
    "searchCreatedBy": {type: 'input'},        // 등록직원명
    "unit": {type: 'select', boxList: ['EA', 'SET', 'M', 'FEAT', 'ROLL', 'BOX', 'G', 'KG', 'PACK', 'INCH', 'MOQ']},               // 단위

    "agencyCode": {type: 'input'},
    "dealerType": {type: 'select', boxList: ['딜러', '제조',]},
    "grade": {type: 'select', boxList: ['A', 'B', 'C', 'D']},
    "margin": {type: 'inputNumber'},
    "agencyName": {type: 'input'},
    "maker": {type: 'input'},
    "homepage": {type: 'input'},
    "businessRegistrationNumber": {type: 'input'},
    "item": {type: 'input'},
    "tradeStartDate": {type: 'input'},
    "bankAccountNumber": {type: 'input'},
    "createdBy": {type: 'input'},
    "createdDate": {type: 'date'},
    "modifiedBy": {type: 'input'},
    "modifiedDate": {type: 'date'},
    "customerManager": {type: 'input'},
    "phoneNumber": {type: 'input'},
    "faxNumber": {type: 'input'},
    "email": {type: 'input'},
    "address": {type: 'input'},
    "countryAgency": {type: 'input'},
    "cellPhoneNumber": {type: 'input'},

    "receiptDate": {type: 'date'},
    "documentNumber": {type: 'input'},
    "importUnitPrice": {type: 'inputNumber'},
    "receivedQuantity": {type: 'inputNumber'},
    "location": {type: 'input'},

    "title": {type: 'input'},
    "to": {type: 'input'},
    "reference": {type: 'input'},
    "subTitle": {type: 'input'},

    "manager": {type: 'input'},
    "country": {type: 'input'},
    "ftaNo": {type: 'input'},
    "bankName": {type: 'input'},
    "ibanCode": {type: 'input'},
    "swiftCode": {type: 'input'},

    "agencyId": {type: 'input'},
    "region": {type: 'input'},
    "postalCode": {type: 'input'},
    "customerName": {type: 'input'},
    "managerName": {type: 'input'},
    "checkList": {type: 'TextArea'},
    "cargoCharge": {type: 'select', boxList: ['화물 후불', '택배후불', '화물선불', '택배선불']},               // 단위
    "cargoPoint": {type: 'input'},
    "paymentMethod": {type: 'select', boxList: ['현금결제', '선수금', '정기결제']},

    "unitPrice": {type: 'inputNumber'},           // 단가
    "amount": {type: 'inputNumber'},
    "unreceivedQuantity": {type: 'inputNumber'},
    "totalPrice": {type: 'inputNumber'},

    "remainingQuantity": {type: 'inputNumber'},
    "usageQuantity": {type: 'inputNumber'},

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
    "documentNumberFull": "", // Inquiry No.
    "writtenDate": "",    // 작성일
    "agencyCode": "",            // 대리점코드
    "customerCode": "",             // CUSTOMER 코드
    "customerName": "",    // 상호명
    "managerName": "",      // 담당자
    "phoneNumber": "",  // 연락처
    "faxNumber": "",                // 팩스번호
    "validityPeriod": "",    // 유효기간
    "paymentTerms": "",                // 결제조건
    "shippingTerms": "",             // 운송조건
    "exchangeRate": "",                  // 환율
    "estimateManager": "",            // 담당자
    "email": "",             // E-MAIL
    "managerPhoneNumber": "",   // 연락처
    "managerFaxNumber": "",       // 팩스번호
    "maker": "",      // Maker
    "item": "",      // Item
    "delivery": "",    // 납기
    "remarks": "",          // 비고란
    "estimateDetailList": [
        {
            "model": "",   // Model
            "quantity": 0,                  // 수량
            "unit": "",                   // 단위
            "currency": "",              // CURR
            "net": 0,                 // 매입단가
            "unitPrice": 0,           // 단가
            "amount": 0               // 금액
        }
    ]
}

// export const estimateInfo = {
//     documentNumberFull : {type : 'input', title : 'INQUERY No.', size : 50},
//     writtenDate : {type : 'datePicker', title : '작성일', size : 50},
//     agencyCode : {type : 'searchInput', title : '대리점코드', size : 50},
//     customerCode : {type : 'input', title : 'CUSTOMER 코드', size : 50},
//     customerName : {type : 'searchInput', title : '상호명', size : 50},
//     managerName : {type : 'input', title : '담당자', size : 50},
//     phoneNumber : {type : 'input', title : '연락처', size : 50},
//     faxNumber : {type : 'input', title : '팩스번호', size : 50},
//     validityPeriod : {type : 'selectBox', title : '유효기간', boxList :['견적 발행 후 10일간', '견적 발행 후 30일간'], size : 50},
//     paymentTerms : {type : 'selectBox', title : '결제조건', boxList : ['발주시50% / 납품시 50%', '납품시 현금결제', '정기결제'], size : 50},
//     shippingTerms : {type : 'selectBox', title : '운송조건', boxList : ['귀사도착도', '화물 & 택배비별도'], size : 50},
//     exchangeRate : {type : 'input', title : '환율', size : 50},
//     estimateManager : {type : 'input', title : '담당자', size : 50},
//     email : {type : 'input', title : '이메일', size : 50},
//     managerPhoneNumber : {type : 'input', title : '연락처', size : 50},
//     managerFaxNumber : {type : 'input', title : '팩스번호', size : 50},
//     maker : {type : 'input', title : 'maker', size : 50},
//     item : {type : 'input', title : 'item', size : 50},
//     delivery : {type : 'input', title : 'delivery', size : 50},
//     remarks : {type : 'inputArea', title : '비고란', size : 100},
// }


export const estimateReadInitial = {
    searchDocumentNumber: '',
    searchDate: '',
    searchType: 0,
    searchCustomerName: '',
    searchMaker: '',
    searchModel: '',
    searchItem: '',
    searchCreatedBy: '',
}

export const estimateReadInfo = {
    searchDocumentNumber: {type: 'input', title: '문서번호', size: 50},
    searchDate: {type: 'datePicker', title: '작성일자', size: 50},
    searchType: {type: 'selectBox', title: '검색조건', boxList: ['전체', '주문', '미주문'], size: 50},
    searchCustomerName: {type: 'input', title: '고객사명', size: 50},
    searchMaker: {type: 'input', title: 'Maker', size: 50},
    searchModel: {type: 'input', title: 'Model', size: 50},
    searchItem: {type: 'input', title: 'Item', size: 50},
    searchCreatedBy: {type: 'input', title: '등록직원명', size: 50},
}


export const estimateTotalWriteInitial = {
    searchDocumentNumber: '',
    searchDate: '',
    searchCustomerName: '',
    searchMaker: '',
    storeCode: '',
    searchModel: '',
    searchItem: '',
    searchCreatedBy: '',
}

export const estimateTotalWriteInfo = {
    searchDocumentNumber: {type: 'input', title: '문서번호', size: 50},
    searchDate: {type: 'datePicker', title: '작성일자', size: 50},
    searchType: {type: 'selectBox', title: '검색조건', boxList: ['전체', '주문', '미주문'], size: 50},
    searchCustomerName: {type: 'input', title: '고객사명', size: 50},
    searchMaker: {type: 'input', title: 'Maker', size: 50},
    storeCode: {type: 'input', title: '대리점코드', size: 50},
    searchModel: {type: 'input', title: 'Model', size: 50},
    searchItem: {type: 'input', title: 'Item', size: 50},
    searchCreatedBy: {type: 'input', title: '등록직원명', size: 50},
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
        title: '고객사명',
        dataIndex: 'searchCustomerName',
        key: 'searchCustomerName',
    },
    {
        title: 'Maker',
        dataIndex: 'maker',
        key: 'maker',
    },
    {
        title: 'Item',
        dataIndex: 'item',
        key: 'item',
    },
    {
        title: 'Model',
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
    }, {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
    }, {
        title: '매입 단가',
        dataIndex: 'net',
        key: 'net',
    }, {
        title: '금액',
        dataIndex: 'amount',
        key: 'amount',
    }, {
        title: '화폐단위',
        dataIndex: 'payUnit',
        key: 'payUnit',
    }, {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
    }, {
        title: '작성자',
        dataIndex: 'writer',
        key: 'writer',
    }, {
        title: '등록일자',
        dataIndex: 'registDate',
        key: 'registDate',
    },
];

// =============================   data   ================================

export const mankuInformation = {
    registerNumber: {title: "등록번호", content: "714-87-01453", id: "registerNumber"},
    companyName: {title: "등록번호", content: "714-87-01453", id: "registerNumber"},
    owner: {title: "등록번호", content: "714-87-01453", id: "registerNumber"},
    address: {title: "등록번호", content: "714-87-01453", id: "registerNumber"},
    businessForm: {title: "등록번호", content: "714-87-01453", id: "registerNumber"},
    businessType: {title: "등록번호", content: "714-87-01453", id: "registerNumber"},
}


export const tableTheme = themeQuartz
    .withPart(iconSetMaterial)
    .withParams({
        browserColorScheme: "light",
        cellHorizontalPaddingScale: 0.5,
        columnBorder: true,
        fontSize: "10px",
        headerBackgroundColor: "#FDFDFD",
        headerFontSize: "12px",
        headerFontWeight: 550,
        headerVerticalPaddingScale: 0.8,
        iconSize: "11px",
        rowBorder: true,
        rowVerticalPaddingScale: 0.8,
        sidePanelBorder: true,
        spacing: "5px",
        wrapperBorder: true,
        wrapperBorderRadius: "6px",
    });


export const paperTopInfo = {
    ko: {
        agencyName: '수신처',
        totalDate: '발주일자',
        agencyManagerName: '담당자',
        documentNumberFull: '발주번호',
        deliveryCondition: '납품조건',
        yourPoNo: '귀사견적',
        paymentTerms: '결제조건.',
        managerId: '담당자',
        deliveryDateCondition: '납기조건',
        managerPhoneNumber: '연락처',
        blank: '',
        managerEmail: 'E-Mail'
    },

    en: {
        agencyName: 'MESSER',
        writtenDate: 'DATE',
        agencyManagerName: 'ATTN',
        managerId: 'Contact Person',
        attnTo: 'YOUR OFFER NO.',
        managerPhoneNumber: 'TEL',
        documentNumberFull: 'MANKU No.',
        managerEmail: 'E-mail',
        deliveryTerms: 'Delivery',
        hscode: 'HS-code',
        incoterms: 'Incoterms',
        blank: '',
        paymentTerms: 'Payment'
    }
}

export const estimateTopInfo = {

    writtenDate: '견적일자',
    name: '담당자',
    documentNumberFull: '견적서 No',
    contactNumber: '연락처',
    customerName: '고객사',
    email: 'E-mail',
    customerManagerName: '담당자',
    validityPeriod: '유효기간',
    customerManagerPhone: '연락처',
    paymentTerms: '결제조건',
    customerManagerEmail: 'E-mail',
    delivery: '납기',
    faxNumber: 'Fax',
    shippingTerms: '납품조건'
}