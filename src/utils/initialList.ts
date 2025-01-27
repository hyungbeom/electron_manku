import moment from "moment/moment";
import {
    searchAgencyCodeColumn,
    searchCustomerColumn,
    searchMakerColumn,
    tableOrderReadColumns
} from "@/utils/columnList";

export const makerRegistInitial = {
    "makerName": "",                   // MAKER
    "item": "",               // ITEM
    "homepage": "",  // 홈페이지
    "area": "",                            // AREA
    "origin": "",                               // 원산지
    "managerConfirm": "",                       // 담당자확인
    "koreanAgency": "",                         // 한국대리점
    "directConfirm": "",                        // 직접확인
    "ftaNumber": "",                            // FTA-No
    "instructions": ""                          // 지시사항
}


export const estimateDetailUnit = {
    "model": "",   // MODEL
    "quantity": 0,                  // 수량
    "unit": "EA",                   // 단위
    "currency": null,          // CURR
    "net": 0,                 // NET/P
    "unitPrice": 0,           // 단가
    "amount": 0,               // 금액
    "serialNumber": 1           // 견적의뢰 내역 순서 (1부터 시작)
}
export const estimateWriteInitial = {
    "writtenDate": moment().format('YYYY-MM-DD'),    // 작성일
    "documentNumberFull": "", // INQUIRY No.
    "agencyCode": "",            // 대리점코드
    "agencyManagerName": "",
    "agencyManagerPhoneNumber": "",
    "customerCode": "",             // CUSTOMER 코드
    "customerName": "",    // 상호명
    "managerName": "",      // 담당자
    "phoneNumber": "",  // 전화번호
    "faxNumber": "",                // 팩스번호
    "validityPeriod":'견적 발행 후 10일간',    // 유효기간
    "paymentTerms": '발주시 50% / 납품시 50%',                // 결제조건
    "shippingTerms": '귀사도착도',             // 운송조건
    "exchangeRate": "",                  // 환율
    "estimateManager": "",            // 담당자
    "email": "",             // E-MAIL
    "managerPhoneNumber": "",   // 전화번호
    "managerFaxNumber": "",       // 팩스번호
    "maker": "",      // MAKER
    "item": "",      // ITEM
    "delivery": null,    // Delivery
    "remarks": "",          // 비고란
    "currencyUnit": "",          // 비고란
    "estimateDetailList": [],
    count : 0
}

export const tableEstimateWriteInitial = {
    "model": "",   // MODEL
    "quantity": 0,                  // 수량
    "unit": "EA",                   // 단위
    "currency": "USD",              // CURR
    "net": 0,                 // NET/P
    "unitPrice": 0,           // 단가
    "amount": 0               // 금액
}


// ======================================    견적의뢰 작성    ========================================


export const estimateRequestDetailUnit = {
    "model": "",             // MODEL
    "quantity": 0,           // 수량
    "unit": "ea",            // 단위
    "currency": "krw",       // CURR
    "net": 0,                // NET/P
    "serialNumber": 0,       // 항목 순서 (1부터 시작)
    "deliveryDate": 0,      // 납기
    "content": "미회신",       // 내용
    "replyDate": null,         // 회신일
    "remarks": ""            // 비고
}


export const rfqWriteInitial = {
    writtenDate: moment().format('YYYY-MM-DD'),
    managerAdminId: 0,           // 작성자 대용
    managerAdminName: '',
    documentNumberFull: '',   // ====== api 통해서 가져와야 함?
    rfqNo: '',
    projectTitle: '',
// ====================================
    agencyCode: '',
    agencyName: '',
    agencyManagerName: '',
    agencyManagerId: null,
    dueDate: null,
    agencyType: '',
    // ======================
    customerCode: null, //없어도 되는것
    customerName: '',
    managerName: '',
    phoneNumber: '',
    faxNumber: '',
    customerManagerEmail: '',

    // ======================
    maker: '',
    item: '',
    instructions: '',
    uploadType: 0,

// =============================


    remarks: '',
    endUser: '',

// ===========================

    "estimateRequestDetailList": [
        // estimateRequestDetailUnit
    ]
}

// ==============================================================================


export const customerInitial = {
    "customerCode": "",                // 고객사코드
    "customerName": "",  // 고객사명(상호명)
    "phoneNumber": "",              // 전화번호
    "faxNumber": "",       // 팩스
    "customerManagerEmail": "",       // 이메일
    "managerName": ""        // 담당자명
}


export const makerWriteInitial = {
    "makerName": "",                   // MAKER
    "item": "",               // ITEM
    "homepage": "",  // 홈페이지
    "area": "",                            // AREA
    "origin": "",                               // 원산지
    "managerConfirm": "",                       // 담당자확인
    "koreanAgency": "",                         // 한국대리점
    "directConfirm": "",                        // 직접확인
    "ftaNumber": "",                            // FTA-No
    "instructions": ""
}

export const subRfqWriteInitial = {
    "model": "",           // MODEL
    "quantity": 1,              // 수량
    "unit": "ea",               // 단위
    "currency": "KRW",          // CURR
    "net": 0,            // NET/P
    "deliveryDate": "",   // 납기
    "content": "",         // 내용
    "replyDate": "",  // 회신일
    "remarks": "",           // 비고
    "serialNumber": 0           // 견적의뢰 내역 순서 (1부터 시작)
}

export const subRfqTableInitial = {
    "model": "",             // MODEL
    "quantity": 0,           // 수량
    "unit": "ea",            // 단위
    "currency": "KRW",       // CURR
    "net": 0,                // NET/P
    "serialNumber": 0,       // 항목 순서 (1부터 시작)
    "deliveryDate": "",      // 납기
    "content": "미회신",       // 내용
    "replyDate": null,      // 회신일
    "remarks": ""            // 비고
}


export const tableOrderWriteInitial = {
    "model": "",           // MODEL
    "unit": "ea",               // 단위
    "currency": "krw",          // CURR
    "net": 0,            // NET/P
    "quantity": 1,              // 수량
    "receivedQuantity": 0,
    "unreceivedQuantity": 0,
    "unitPrice": 0,
    "amount": 0,
}


export const subRfqReadInitial = {
    "searchDate": [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],   // front 사용
    "searchEstimateRequestId": "",      // 견적의뢰 Id
    "searchType": "0",                   // 검색조건 1: 회신, 2: 미회신
    "searchStartDate": "",              // 작성일자 시작일
    "searchEndDate": "",                // 작성일자 종료일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 고객사명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchCreatedBy": "",              // 등록직원명
    "searchManagerName": "",            // 담당자명
    "searchMobileNumber": "",           // 담당자 연락처
    "searchBiddingNumber": "",          // 입찰번호(미완성)
    "page": 1,
    "limit": -1
}

export const subRfqReadMailInitial = {

    "searchDate": [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],   // front 사용
    "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
    "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 고객사명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchCreatedBy": "",              // 등록직원명
    "searchRfqNo": "",                  // 견적의뢰 RFQ No
    "searchProjectTitle": "",           // 프로젝트 제목
    "searchEndUser": "",                // End User
    "searchStartDueDate": "",           // 마감일 검색 시작일
    "searchEndDueDate": "",             // 마감일 검색 종료일
    "searchAgencyManagerName": "",      // 대리점 담당자 이름

    // 메일 전송 목록 검색 필드 추가 2024.11.28
    "searchSentStatus": 0,              // 전송 여부 1: 전송, 2: 미전송
    "searchReplyStatus": 0,             // 회신 여부 1: 회신, 2: 미회신
    "searchAgencyCode": "",          // 대리점코드 검색

    "page": 1,
    "limit": -1

}

export const estimateReadInitial = {
    searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    "searchType": 0,                   // 검색조건 1: 회신, 2: 미회신
    searchStartDate: moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
    searchEndDate: moment().format('YYYY-MM-DD'),                // 작성일자 종료일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 고객사명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchCreatedBy": "",      // 등록 관리자 이름
}

export const projectReadInitial = {
    searchManagerAdminName: "",
    searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    searchStartDate: moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
    searchEndDate: moment().format('YYYY-MM-DD'),                // 작성일자 종료일
    searchCreatedBy: "",
    searchDocumentNumberFull: "",
    searchProjectTitle: "",
    searchConnectInquiryNo: "",
    searchCustomerName: "",
    searchCustomerManagerName: "",
    searchCustomerPhone: "",
    searchCustomerEmail: "",
    searchAgencyName: "",
    searchAgencyManagerName: "",
    searchAgencyManagerPhone: "",
    searchAgencyManagerEmail: "",
    page: 1,
    limit: -1
}


export const tableEstimateReadInitial = {
    "estimateId": 0,
    "documentNumber": 0,
    "writtenDate": "",
    "agencyCode": "",
    "agencyName": "",
    "customerCode": "",
    "customerName": "",
    "phoneNumber": "",
    "faxNumber": "",
    "validityPeriod": "",
    "paymentTerms": "",
    "shippingTerms": "",
    "exchangeRate": "",
    "managerName": "",
    "email": "",
    "managerPhoneNumber": "",
    "managerFaxNumber": "",
    "maker": "",
    "item": "",
    "delivery": "",
    "remarks": "",
    "createdBy": "",
    "createdDate": "",
    "modifiedBy": "",
    "modifiedDate": "",
    "documentNumberFull": "",
    "subNumber": 0,
    "estimateManager": "",
    "key": 1,
    "estimateDetailList": [
        {
            "estimateDetailId": 0,
            "estimateId": 0,
            "model": "",
            "quantity": 1,
            "unit": "ea",
            "currency": "USD",
            "net": 0,
            "unitPrice": 0,
            "currencyUnit": null,
            "amount": 0,
            "orderProcessing": null,
            "orderDate": null,
            "order": '미주문',
            "serialNumber": null
        }
    ]
}

export const orderDetailUnit = {
    "model": "",           // MODEL
    "unit": "ea",               // 단위
    "currency": null,
    "net": 0,            // NET/P
    "quantity": 0,              // 수량
    "receivedQuantity": 0,
    "unreceivedQuantity": 0,
    "unitPrice": 0,
    "amount": 0,
}
export const orderWriteInitial = {
    "ourPoNo": "",    //  PO No
    "documentNumberFull": "",    // Our PO No
    "writtenDate": moment().format('YYYY-MM-DD'),
    "yourPoNo": "",                // Your PO No
    "agencyCode": "",  // Messrs
    "agencyName": "",  // Messrs
    "customerName": "",          // 고객사명
    "customerId": 0,          // 고객사명
    "estimateManager": "",            // 견적서담당자
    "managerID": "",                 // Responsibility
    "managerPhoneNumber": "",  // Tel
    "managerFaxNumber": "",      // E-Mail
    "managerEmail": "",   // Fax
    "paymentTerms": "",    // Payment Terms
    "deliveryTerms": "",              // Delivery Terms
    "maker": "",                    // MAKER
    "item": "",                       // ITEM
    "delivery": '',               // Delivery
    "remarks": "",                      // 비고란
    "currencyUnit": "",                      // 비고란
    "orderDetailList": [],
}

export const orderStockInitial = {
    "receiptDate": "",          // MAKER 검색
    "documentNumber": "",          // MODEL 검색
    "maker": "",       // 위치 검색
    "page": 1,
    "limit": 20
}

export const tableOrderInventoryInitial = {
    "receiptDate": "",        // 입고일자
    "documentNumber": "",     // 문서번호
    "maker": "",                 // MAKER
    "model": "",                 // Model
    "importUnitPrice": null,          // 수입단가
    "currencyUnit": "KRW",              // 화폐단위
    "receivedQuantity": null,           // 입고수량
    "usageQuantity": null,           // 입고수량
    "unit": "EA",                       // 단위
    "location": "",            // 위치
    "remarks": ""          // 비고
}


export const deliveryDaehanInitial = {
    "deliveryType": "CJ",                          // 배송 유형 (CJ: 대한통운, DAESIN: 대신택배, QUICK: 퀵/직납/대리점)
    "deliveryDate": moment().format('YYYY-MM-DD'),                  // 출고일자
    "customerName": "",                // 고객사명
    "recipientName": "",                     // 받는 분 성명
    "recipientPhone": "",             // 받는 분 전화번호
    "recipientAltPhone": "",          // 받는 분 기타 연락처
    "recipientPostalCode": "",                // 받는 분 우편번호
    "recipientAddress": "",        // 받는 분 주소
    "trackingNumber": "",               // 운송장 번호 (CJ 전용)
    "customerOrderNo": "",                 // 고객 주문 번호 (CJ 전용)
    "destination": "",                       // 도착지 (DAESIN 전용)
    "productName": "",                       // 품목명
    "quantity": 0,                                 // 수량

    "packagingType": 0,                                 // 포장유형 (B or P)
    "shippingType": 0,                                 // 배송방식(택배 or 화물)

    "paymentMethod": "착불",                       // 결제 방식 (착불, 후불) (DAESIN/QUICK 전용)
    "classification": "",                     // 구분 (용달, 대리점 등 QUICK 전용)
    "connectInquiryNo": "",                // 연결된 문의 번호
    "isConfirm": "X"
}


export const tableOrderReadInitial = {
    "orderId": 4114,
    "documentNumberFull": "ARC-24-0326-1",
    "writtenDate": "2024-09-04",
    "agencyCode": "R&D Trading Co.",
    "customerName": "정원엔지니어링",
    "managerId": "MinkukKim",
    "managerPhoneNumber": "02-465-7838",
    "managerFaxNumber": "02-465-7839",
    "managerEmail": "sales@manku.co.kr",
    "paymentTerms": "By in advance T/T",
    "packing": null,
    "deliveryTerms": "7~8weeks",
    "inspection": null,
    "maker": "Dynapar",
    "item": "Encoder",
    "delivery": "2024-10-25",
    "remarks": "",
    "createdBy": "MinkukKim",
    "createdDate": "2024-09-04T17:46:31.63",
    "modifiedBy": "MinkukKim",
    "modifiedDate": "2024-09-04T17:46:31.63",
    "estimateManager": "권혁구",
    "yourPoNo": "",
    "key": 5,
    "orderDetailList": [
        {
            "orderDetailId": 7504,
            "orderId": 4114,
            "model": "X253600033",
            "quantity": 1,
            "unit": "ea",
            "currency": "USD",
            "net": 2140.00,
            "currencyUnit": "",
            "unitPrice": 3724000,
            "amount": 3724000,
            "estimateDetailId": 28729,
            "receivedQuantity": 0,
            "serialNumber": 1
        }
    ]
}

export const orderReadInitial = {
    "searchDate": [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],              // 작성일자 시작일
    searchStartDate: moment().subtract(1, 'years').format('YYYY-MM-DD'),
    searchEndDate: moment().format('YYYY-MM-DD'),
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 고객사명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchEstimateManager": "",              // 등록직원명
    "page": 1,
    "limit": -1
}

export const remittanceDomesticInitial = {
    connectInquiryNo: '',
    customerName: '',
    agencyName: '',
    requestDate: moment().format('YYYY-MM-DD'),
    assignedDate: moment().format('YYYY-MM-DD'),
    isSend: 'X',
    isInvoice: 'X',
    supplyAmount: 0,
    managerAdminId: null,
    managerAdminName: '',
    surtax: 0,
    total: 0,
}
export const remittanceDomesticSearchInitial = {
    "searchDate": [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    "searchConnectInquiryNo": "",   // InquiryNo
    "searchCustomerName": "",       // 고객사명
    "searchAgencyName": "",         // 매입처명
    "searchManagerAdminName": "",   // 담당자
    "searchRequestStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),   // 송금요청일자 검색 시작일
    "searchRequestEndDate": moment().format('YYYY-MM-DD'),     // 송금요청일자 검색 종료일
    "searchIsSend": "",             // 송금여부 O, X
    "searchIsInvoice": "",          // 계산서 발행여부 O, X
    "page": 1,
    "limit": -1
}

export const inventoryReadInitial = {
    "searchText": "",              // 재고 등록 검색 (문서번호, MAKER, Model)
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchLocation": "",                   // ITEM
    "page": 1,
    "limit": 10
}


export const orderCustomerReadInitial = {
    "searchDate": "",
    "searchStartDate": "",      // 조회일자 시작일
    "searchEndDate": "",        // 조회일자 종료일
    "searchAgencyCode": "",
    "page": 1,
    "limit": -1
}

export const orderAgencyReadInitial = {
    "searchText": "",              // 재고 등록 검색 (문서번호, MAKER, Model)
    "searchDate": "",                  // MAKER
    "page": 1,
    "limit": 10
}


export const tableOrderCustomerInitial = {
    "customerName": "",
    "unpaidAmount": 0,
    "paidAmount": 0,
    "totalAmount": 0,
    "key": 1
}

export const subCodeExchangeInitial = {
    "searchDate": "",              // 작성일자 시작일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 고객사명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchEstimateManager": "",              // 등록직원명
    "page": 1,
    "limit": 10
}

// ---------

export const codeSaveInitial = {
    searchText: '',
    item: '',
    hsCode: ''
}
export const codeReadInitial = {
    "searchText": "",         // 문서번호
    "page": 1,
    "limit": 10
}


export const codeUserSaveInitial = {
    "customerName": "",                  // MAKER
    "homepage": "",         // 문서번호
    "id": "",
    "pw": "",
    "remarks": "",
}
export const codeUserReadInitial = {
    "searchCustomerName": "",
    "page": 1,
    "limit": 10
}

export const codeErpSaveInitial = {
    "id": "",
    "pw": "",
    "name": "",
    "position": "",
    "right": "",
    "email": "",
    "phoneNumber": "",
    "faxNumber": "",
    "rightInfo": "",
}
export const codeDiplomaReadInitial = {
    searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    searchStartDate: moment().subtract(1, 'years').format('YYYY-MM-DD'),
    searchEndDate: moment().format('YYYY-MM-DD'),
    "searchDocumentNumber": "",           // 문서번호 검색
}

export const tableCodeDiplomaInitial = {
    "documentNumber": "",
    "title": "",
    "to": "",
    "reference": "",
    "subTitle": "",
    "content": "",
    "registerer": "",
    "registerDate": null,
    "modifier": "",
    "modifyDate": null,
}

export const modalCodeDiplomaInitial = {
    "documentNumber": "",
    "title": "",
    "to": "",
    "reference": "",
    "subTitle": "",
    "content": "",
}

export const codeDomesticPurchaseInitial = {
    "searchType": 1,
    "searchText": "",
    "page": 1,
    "limit": -1
}


export const codeDomesticAgencyWriteInitial = {
    "agencyCode": "",        // 코드(약칭)
    "dealerType": "딜러",        // "딜러", "제조"
    "grade": "A",               // 등급
    "margin": 0,                // 마진
    "agencyName": "",   // 상호
    "maker": "",            // MAKER
    "homepage": "",   // 홈페이지
    "tradeStartDate": "",         // 거래시작일
    "businessRegistrationNumber": "",       // 사업자 번호
    "bankAccountNumber": "",                // 계좌번호
    "item": "",                             // 아이템
    "agencyManagerList": [],
    searchType : 1
}


export const codeDomesticSalesWriteInitial = {
    "customerId": 1,
    "customerCode": "",
    "customerName": "",
    "customerRegion": "",
    "tradeStartDate": "",
    "customerTel": "",
    "customerFax": "",
    "homepage": "",
    "zipCode": "",
    "address": "",
    "businessRegistrationNumber": "",
    "customerType": "",
    "remarks": "",
    "mankuTradeManager": "",
    "companyVerify": "",
    "freightCharge": "화물 후불",
    "freightBranch": "",
    "paymentMethod": "현금 결제",
    "companyType": "딜러",
    "createdBy": "",
    "createdDate": "",
    "modifiedBy": "",
    "modifiedDate": "",
    "representative": "",
    "businessType": "",
    "businessItem": "",
    "key": 1,
    "customerManagerList": []
}

export const codeOverseasSalesWriteInitial = {
    "customerCode": "",
    "customerName": "",
    "tradeStartDate": "",
    "phoneNumber": "",
    "customerRegion": "",
    "homepage": "",
    "faxNumber": "",
    "currencyUnit": "USD",
    "manager": "",
    "ftaNumber": "",
    "customerType": "",
    "address": "",
    "mankuTradeManager": "",
    "remarks": "",
    "companyVerification": "",
    "overseasCustomerManagerList": []
}


export const tableCodeDomesticSalesInitial = {
    "customerId": 0,
    "customerCode": "",
    "customerName": "",
    "customerRegion": "",
    "tradeStartDate": "",
    "customerTel": "",
    "customerFax": "",
    "homepage": "",
    "zipCode": "",
    "address": "",
    "businessRegistrationNumber": "",
    "customerType": "",
    "remarks": "",
    "mankuTradeManager": "",
    "companyVerify": "",
    "freightCharge": "",
    "freightBranch": "",
    "paymentMethod": "",
    "companyType": "",
    "createdBy": "",
    "createdDate": "",
    "modifiedBy": "",
    "modifiedDate": "",
    "representative": "",
    "businessType": "",
    "businessItem": "",
}

export const tableCodeOverseasSalesInitial = {
    "overseasCustomerId": 0,
    "customerCode": "",
    "customerName": "",
    "customerRegion": "",
    "tradeStartDate": "",
    "phoneNumber": "",
    "faxNumber": "",
    "address": "",
    "customerType": "",
    "currencyUnit": "",
    "mankuTradeManager": "",
    "homepage": "",
    "manager": "",
    "ftaNumber": "",
    "remarks": "",
    "companyVerification": "",
    "createdBy": "",
    "createdDate": "",
    "modifiedBy": "",
    "modifiedDate": "",
}


export const codeOverseasAgencyInitial = {
    "overseasAgencyId": null,
    "agencyCode": "",
    "agencyName": "",
    "dealerType": "딜러",
    "grade": "",
    "margin": null,
    "homepage": "",
    "item": "",
    "tradeStartDate": "",
    "currencyUnit": "",
    "manager": "",
    "bankAccountNumber": "",
    "country": "USA",
    "ftaNumber": "",
    "intermediaryBank": "",
    "address": "",
    "ibanCode": "",
    "swiftCode": "",
    "createdBy": "",
    "createdDate": "",
    "modifiedBy": "",
    "modifiedDate": "",
    "key": 1,
    "overseasAgencyManagerList": []
}

export const codeOverseasAgencyWriteInitial = {
    "agencyCode": "",                      // 코드(약칭)
    "agencyName": "",       // 상호
    "dealerType": "",               // 딜러/제조
    "grade": "",                             // 등급
    "margin": null,                           // 마진
    "homepage": "",   // 홈페이지
    "item": "",                        // ITEM
    "tradeStartDate": "",               // 거래 시작일
    "currencyUnit": "",                        // 화폐단위
    "manager": "",                     // 담당자
    "bankAccountNumber": "",            // Account No
    "country": "",                             // 국가
    "ftaNumber": "",                      // FTA No
    "intermediaryBank": "",        // 송금중개은행
    "address": "",  // 주소
    "ibanCode": "",           // IBan Code
    "swiftCode": "",                      // Swift Code
    "overseasAgencyManagerList": []
}

export const printEstimateInitial = {
    "customerId": null,
    "customerCode": "",
    "customerName": "",
    "customerRegion": "",
    "customerTel": "",
    "address": "",
    "businessRegistrationNumber": "",

    "representative": "",
    "businessType": "",
    "businessItem": "",
    "manager": null,

    "customerCategory": "",
    receiveComp :[]
}


export const ModalInitList = {agencyCode: false, customerName: false, maker: false, orderList: false}

export const modalList = {
    agencyCode: {
        url: 'agency/getAgencyListForEstimate',
        title: '대리점 코드 조회',
        column: searchAgencyCodeColumn,
        list: 'agencyList',
        placeholder: '코드 또는 상호를 입력하세요'
    },
    customerName: {
        url: 'customer/getCustomerListForEstimate',
        title: '고객사 상호명 조회',
        column: searchCustomerColumn,
        list: 'customerList',
        placeholder: '상호명 또는 담당자명 입력하세요'
    },
    maker: {
        url: 'maker/getMakerList',
        title: 'maker 조회',
        column: searchMakerColumn,
        list: 'makerList',
        placeholder: 'Maker 또는 Area 또는 Item 입력하세요'
    },
    orderList: {
        url: 'order/getOrderList',
        title: '발주서 조회',
        column: tableOrderReadColumns,
        list: 'orderList',
        placeholder: '문서번호 또는 고객사명을 입력하세요'
    },
}


export const searchOrderInitial = {
    searchConnectInquiryNo: "",
    searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    searchStartDate: moment().subtract(1, 'years').format('YYYY-MM-DD'),
    searchEndDate: moment().format('YYYY-MM-DD'),
    searchCustomerName: "",
    searchRecipientPhone: "",
    searchIsConfirm: "",
    searchTrackingNumber: "",
}


export const projectWriteInitial = {
    managerAdminName: '',
    managerAdminId: null,
    writtenDate: moment().format('YYYY-MM-DD'),
    documentNumberFull: '',
    projectTitle: '',
    dueDate: '',
    customerName: '',
    customerManagerName: '',
    customerManagerPhone: '',
    customerManagerEmail: '',
    remarks: '',
    instructions: '',
    specialNotes: '',
    projectDetailList: []
}

export const storeWriteInitial = {
    blNo: "",              // BL No.
    carrierName: "",        // 운수사명
    arrivalDate: '',    // 입고일자
    tariff: null,          // 관세
    vatAmount: null,              // 부가세
    shippingFee: null,            // 운임비
    total: null,
    totalVat: null,
    saleTotal: null,
    saleVatTotal: null,
    operationIncome: null,
    orderStatusDetailList: []
}

export const storeDetailUnit = {
    orderDocumentNumberFull: "",           // 발주서 Inquiry No
    itemDetailNo: '',                              // 세부 항목 번호
    customerName: '',                           // 고객사명
    agencyName: '',                             // 매입처명
    orderDate: '',                          // 발주일자
    remittanceDate: '',                     // 송금일자
    amount: 0,                                   // 금액
    currencyUnit: "",                              // 화폐 단위
    salesAmount: 0,                              // 판매금액
    deliveryDate: "",                       // 출고일자
    exchangeRate: 1,                               // 환율
    commissionFee: 0,                                     // 수수료
    receiptDate: "",                        // 입고일자
    paymentStatus: "",                            // 결제여부
    advancePayment: 0,                             // 선수금
    returnAmount: 0,                             // 원화환산금액
    remarks: "",
    invoiceDate: ""                         // 계산서 발행일
}

export const storeRealInitial = {
    "searchBlNo": "",                           // B/L No.
    "searchPaymentStatus": "",                  // 결제 여부
    "searchArrivalDate": [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],               // 입고일자 시작-종료
    "searchStartArrivalDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),               // 입고일자 시작
    "searchEndArrivalDate": moment().format('YYYY-MM-DD'),                 // 입고일자 종료
    "searchOrderDocumentNumberFull": "",        // 발주 Inquirty No
    "searchCustomerName": "",                   // 고객사명
}


export const projectDetailUnit = {
    connectInquiryNo: '',
    maker: '',
    item: '',
    spec: '',
    quantity: 0,
    unitPrice: '',
    currencyUnit: '',
    deliveryDate: '',
    agencyName: '',
    agencyManagerName: '',
    agencyManagerPhone: '',
    agencyManagerEmail: '',
    relatedLink: '',
    requestDeliveryDate: '',
    remarks: ''
}

// ==============================================================================================================================================
export const reqWriteList = {
    "MODEL": 'model',
    "수량": 'quantity',
    "단위": 'unit',
    "CURR": 'currency',
    "NET/P": 'net',
    "납기": 'deliveryDate',
    "회신여부": 'content',
    "회신일": 'replyDate',
    "비고": 'remarks'
}


// ==============================================================================================================================================
export const projectWriteList = {
    "연결 Inquiry No.": 'connectInquiryNo',
    "MAKER": 'maker',
    "ITEM": 'item',
    "규격": 'spec',
    "수량": 'quantity',
    "단위 가격": 'unitPrice',
    "총액": 'total',
    "화폐단위": 'currencyUnit',
    "납기": 'deliveryDate',
    "매입처명": 'agencyName',
    "매입처 담당자명": 'agencyManagerName',
    "매입처 전화번호": 'agencyManagerPhone',
    "매입처 이메일": 'agencyManagerEmail',
    "관련링크": 'relatedLink',
    "납기요청일": 'requestDeliveryDate',
    "비고": 'remarks',
}

export const estimateWriteList = {
    MODEL: 'model',
    수량: 'quantity',
    단위: 'unit',
    단가: 'unitPrice',
    금액: 'amount',
    CURR: 'currency',
    "NET/P": 'net',
}

export const orderWriteList = {
    MODEL: 'model',
    단위: 'unit',
    CURR: 'currency',
    "NET/P": 'net',
    totalAmount: 'amount',
    수량: 'quantity',
    입고: 'receivedQuantity',
    미입고: 'unreceivedQuantity',
    단가: 'unitPrice',
    금액: 'totalPrice'
}
export const storeWriteList = {
    'Inquiry No.': 'orderDocumentNumberFull',
    '세부항목 번호': 'itemDetailNo',
    매입처명: 'agencyName',
    고객사명: 'customerName',
    환율: 'exchangeRate',
    발주일자: 'orderDate',
    송금일자: 'remittanceDate',
    금액: 'amount',
    환폐단위: 'currencyUnit',
    원화환산금액: 'returnAmount',
    수수료: 'commissionFee',
    판매금액: 'salesAmount',
    '판매금액(VAT 포함)': 'salesAmountVat',
    입고일자: 'receiptDate',
    출고일자: 'deliveryDate',
    '계산서 발행일자결제': '',
    '결제 여부': 'paymentStatus',
    선수금: 'advancePayment',
    비고: 'remarks'
}








