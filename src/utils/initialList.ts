

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
    "writtenDate": null,    // 작성일
    "documentNumberFull": "", // INQUIRY No.
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
    "delivery": null,    // Delivery
    "remarks": "",          // 비고란
    "estimateDetailList": []
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
    "model": "",           // MODEL
    "quantity": 1,              // 수량
    "unit": "ea",               // 단위
    "currency": "krw",          // CURR
    "net": 0,            // NET/P
    "deliveryDate": "",   // 납기
    "content": "",         // 내용
    "replyDate": "",  // 회신일
    "remarks": "",           // 비고
    "serialNumber": 0           // 견적의뢰 내역 순서 (1부터 시작)
}

export const tableOrderWriteInitial = {
    "model": "",           // MODEL
    "quantity": 1,              // 수량
    "unit": "ea",               // 단위
    "currency": "krw",          // CURR
    "net": 0,            // NET/P
    "amount": 0,
    "receivedQuantity": 0,
    "unreceivedQuantity": 0,
    "unitPrice": 0,
    "price": 0
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

export const estimateReadInitial = {
    "searchDate" : "",   // front 사용
    "searchType": 0,                   // 검색조건 1: 회신, 2: 미회신
    "searchStartDate": "",              // 작성일자 시작일
    "searchEndDate": "",                // 작성일자 종료일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 거래처명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "page": 1,
    "limit": 10
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
                "order": null,
                "serialNumber": null
            }
        ]
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
}

export const orderStockInitial = {
    "receiptDate": "",          // MAKER 검색
    "documentNumber": "",          // MODEL 검색
    "maker": "",       // 위치 검색
    "page": 1,
    "limit": 20
}

export const tableOrderInventoryInitial = {
    "receiptDate":  "",        // 입고일자
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
    "searchDate": "",              // 작성일자 시작일
    "searchStartDate": "",              // 작성일자 시작일
    "searchEndDate": "",              // 작성일자 시작일
    "searchDocumentNumber": "",         // 문서번호
    "searchCustomerName": "",           // 거래처명
    "searchMaker": "",                  // MAKER
    "searchModel": "",                  // MODEL
    "searchItem": "",                   // ITEM
    "searchEstimateManager": "",              // 등록직원명
    "page": 1,
    "limit": 10
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
    "searchDate" :"",
    "searchStartDate": "",      // 조회일자 시작일
    "searchEndDate": "",        // 조회일자 종료일
    "searchCustomerName": "",   // 거래처명
    "page": 1,
    "limit": 20
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
