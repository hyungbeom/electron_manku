import {subOrderReadColumns} from "@/utils/columnList";
import codeDomesticPurchase from "@/pages/code_domestic_purchase";




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
export const estimateWriteInitial = {
    "documentNumberFull": "AWM-24-0093-1", // INQUIRY No.
    "writtenDate": "2024-09-04",    // 작성일
    "agencyCode": "AWM",            // 대리점코드
    "customerCode": "",             // CUSTOMER 코드
    "customerName": "(주)엔투비",    // 상호명
    "managerName": "김연후 님",      // 담당자
    "phoneNumber": "02-2007-0760",  // 전화번호
    "faxNumber": "",                // 팩스번호
    "validityPeriod": "견적 발행 후 10일간",    // 유효기간
    "paymentTerms": "정기결제",                // 결제조건
    "shippingTerms": "귀사도착도",             // 운송조건
    "exchangeRate": "1400",                  // 환율
    "estimateManager": "sample1",            // 담당자
    "email": "info@manku.co.kr",             // E-MAIL
    "managerPhoneNumber": "010-8667-8252",   // 전화번호
    "managerFaxNumber": "02-465-7839",       // 팩스번호
    "maker": "Avtron",      // MAKER
    "item": "Encoder",      // ITEM
    "delivery": "6~8주",    // Delivery
    "remarks": "",          // 비고란
    "estimateDetailList": [
        {
            "model": "AV56-A1CBF8YXQ000",   // MODEL
            "quantity": 2,                  // 수량
            "unit": "EA",                   // 단위
            "currency": "USD",              // CURR
            "net": 1765.00,                 // NET/P
            "unitPrice": 2700000,           // 단가
            "amount": 5400000               // 금액
        }
    ]
}
export const rfqWriteInitial = {
    "writtenDate": "",        // 작성일
    "agencyCode": "",                // 대리점코드
    "agencyName": "",       // 대리점명
    "customerCode": "",                // 거래처코드(거래처 관리 > 거래처 조회(견적용) API 조회)

    // '거래처 조회(견적용)' API 에서 '상호명' 을 넣고 조회한 목록에서 정보 가져옴.
    "customerName": "",   // 거래처명(상호명)
    "phoneNumber": "",              // 전화번호
    "faxNumber": "",       // 팩스/이메일
    "customerManagerId": 0,             // 담당자아이디
    "managerName": "",       // 담당자명
    // END //


    "maker": "",                   // MAKER
    "item": "",                     // ITEM
    "remarks": "",                  // 비고란
    "footerTag": "",                    // 하단 태그란
    "attachment": "",                   // 첨부파일 여부 (있으면 "V", 없으면 "")
    "instructions": "",                 // 지시사항
    "estimateRequestDetailList": []
}

export const subRfqWriteInitial = {
    "model": "model",           // MODEL
    "quantity": 1,              // 수량
    "unit": "ea",               // 단위
    "currency": "krw",          // CURR
    "net": 60000.00,            // NET/P
    "deliveryDate": "3weeks",   // 납기
    "content": "미회신",         // 내용
    "replyDate": "2024-10-24",  // 회신일
    "remarks": "비고",           // 비고
    "serialNumber": 0           // 견적의뢰 내역 순서 (1부터 시작)

}

export const subRfqReadInitial = {
    "searchDate" : "",   // front 사용
    "searchEstimateRequestId": "",      // 견적의뢰 Id
    "searchType": "0",                   // 검색조건 1: 회신, 2: 미회신
    "searchStartDate": "",              // 작성일자 시작일
    "searchEndDate": "",                // 작성일자 종료일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 거래처명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchCreatedBy": "",              // 등록직원명
    "searchManagerName": "",            // 담당자명
    "searchMobileNumber": "",           // 담당자 연락처
    "searchBiddingNumber": "",          // 입찰번호(미완성)
    "page": 1,
    "limit": 10
}

export const orderWriteInitial = {
    "documentNumberFull": "",    // Our PO No
    "writtenDate": "",            // 작성일
    "yourPoNo": "",                // Your PO No
    "agencyCode": "",  // Messrs
    "customerName": "",          // 거래처명
    "estimateManager": "",            // 견적서담당자
    "managerID": "",                 // Responsibility
    "managerPhoneNumber": "",  // Tel
    "managerFaxNumber": "",      // E-Mail
    "managerEmail": "",   // Fax
    "paymentTerms": "",    // Payment Terms
    "deliveryTerms": "",              // Delivery Terms
    "maker": "",                    // MAKER
    "item": "",                       // ITEM
    "delivery": "",               // Delivery
    "remarks": "",                      // 비고란
    "orderDetailList": [],
    // "estimateRequestDetailList": [],
}

export const orderStockInitial = {
    "receiptDate":  null,        // 입고일자
    "documentNumber": "",     // 문서번호
    "maker": "",                 // MAKER
    "model": "",                 // Model
    "importUnitPrice": 0,          // 수입단가
    "currencyUnit": "KRW",              // 화폐단위
    "receivedQuantity": 0,           // 입고수량
    "unit": "EA",                       // 단위
    "location": "",            // 위치
    "remarks": ""          // 비고
}


export const subOrderWriteInitial = {
    "model": '',           // MODEL
    "quantity": 0,              // 수량
    "unit": 'EA',               // 단위
    "currency":'USD',          // CURR
    "net": 0 ,            // NET/P
    "amount": 0 ,            // NET/P
    "orderQuantity": 0,   // 납기
    "receivedQuantity": 0,   // 납기
    "unreceivedQuantity": 0,   // 납기
    "unitPrice": 0,         // 내용
    "price": 0,  // 회신일
}

export const orderReadInitial = {
    "searchDate": "",              // 작성일자 시작일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 거래처명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchEstimateManager": "",              // 등록직원명
    "page": 1,
    "limit": 10
}

export const invenReadInitial = {
    "searchText": "",              // 재고 등록 검색 (문서번호, MAKER, Model)
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchLocation": "",                   // ITEM
    "page": 1,
    "limit": 10
}


export const subInvenWriteInitial = {
    "receiptDate": "",        // 입고일자
    "documentNumber": "",     // 문서번호
    "maker": "",                 // MAKER
    "model": "",                 // Model
    "importUnitPrice": 0,          // 수입단가
    "currencyUnit": "KRW",              // 화폐단위
    "receivedQuantity": 0,           // 입고수량
    "unit": "EA",                       // 단위
    "location": "",            // 위치
    "remarks": ""          // 비고
}


export const customerReadInitial = {
    "searchText": "",              // 재고 등록 검색 (문서번호, MAKER, Model)
    "searchDate": "",                  // MAKER
    "page": 1,
    "limit": 10
}

export const agencyReadInitial = {
    "searchText": "",              // 재고 등록 검색 (문서번호, MAKER, Model)
    "searchDate": "",                  // MAKER
    "page": 1,
    "limit": 10
}


export const tableOrderCustomerInitial = {
    "agencyId": 0,
    "agencyCode": "",
    "agencyName": "",
    "dealerType": "",
    "grade": "",
    "margin": 0,
    "homepage": "",
    "item": "",
    "tradeStartDate": "",
    "businessRegistrationNumber": "",
    "bankAccountNumber": "",
    "createdBy": "",
    "createdDate": null,
    "modifiedBy": "",
    "modifiedDate": null,
    "maker": "",
    "key": 1
}

export const subCodeExchangeInitial = {
    "searchDate": "",              // 작성일자 시작일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 거래처명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchEstimateManager": "",              // 등록직원명
    "page": 1,
    "limit": 10
}

// ---------

export const codeSaveInitial = {
    "item": "",                  // MAKER
    "hsCode": "",         // 문서번호
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
    "searchCustomerName":"",
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
export const codeDiplomaInitial = {
    "searchDate": null,
    "searchDocumentNumber": "",
    "page": 1,
    "limit": 10
}

export const tableCodeDiplomaInitial = {
    "documentNumber":"",
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
    "documentNumber":"",
    "title": "",
    "to": "",
    "reference": "",
    "subTitle": "",
    "content": "",
}

export const codeDomesticPurchaseInitial = {
    "searchType": 2,
    "searchText": "",
    "page": 1,
    "limit": 10
}

export const tableCodeDomesticPurchaseInitial = {
    "agencyId": 1,
    "agencyCode": "",
    "agencyName": "",
    "dealerType": "딜러",
    "grade": "",
    "margin": 0,
    "homepage": "",
    "item": "",
    "tradeStartDate": null,
    "businessRegistrationNumber": "",
    "bankAccountNumber": "",
    // "createdBy": "",
    // "createdDate": null,
    // "modifiedBy": "",
    // "modifiedDate": null,
    "maker": "",
    "key": 1
}

export const tableCodeDomesticSalesInitial = {
    "agencyId": 1,
    "agencyCode": "",
    "agencyName": "",
    "region": "",
    "tradeStartDate": null,
    "phoneNumber": "",
    "faxNumber": "",
    "homepage": "",
    "postalCode": "",
    "address": "",
    "businessRegistrationNumber": "",
    "customerName": "",
    "remarks": "",
    "managerName": "",
    "checkList": "",
    "cargoCharge": "화물후불",
    "cargoPoint": "",
    "paymentMethod": "현금결제",
    "dealerType": "딜러",
    // "createdBy": "",
    // "createdDate": null,
    // "modifiedBy": "",
    // "modifiedDate": null,
    "key": 1,
}

export const tableCodeOverseasSalesInitial = {
    "agencyId": 1,
    "agencyCode": "",
    "agencyName": "",
    "region": "",
    "tradeStartDate": null,
    "phoneNumber": "",
    "faxNumber": "",
    "homepage": "",
    "postalCode": "",
    "address": "",
    "customerName": "",
    "remarks": "",
    "managerName": "",
    "customerManager": "",
    "checkList": "",
    "currencyUnit": {title : '화폐단위'},
    "ftaNo": "",
    // "createdBy": "",
    // "createdDate": "",
    // "modifiedBy": "",
    // "modifiedDate": null,
    "key": 1,
}


export const tableCodeOverseasPurchaseInitial = {
    "agencyId": 1,
    "agencyCode": "",
    "agencyName": "",
    "dealerType": "딜러",
    "grade": "",
    "margin": 0,
    "homepage": "",
    "item": "",
    "tradeStartDate": null,
    "currencyUnit":"USD",
    "manager":"",
    "bankAccountNumber": "",
    "country":"",
    "ftaNo":"",
    "bankName":"",
    "agencyAddress":"",
    "ibanCode":"",
    "swiftCode":"",
    // "createdBy": "",
    // "createdDate": null,
    // "modifiedBy": "",
    // "modifiedDate": null,
    "key": 1
}
