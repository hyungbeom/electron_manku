

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
    "writtenDate": null,        // 작성일
    "documentNumberFull": "", // INQUIRY No.
    // 대리점 > 대리점 조회 API 에서 조회한 데이터
    "agencyCode": "",                // 대리점코드
    "agencyName": "",       // 대리점명

    // 거래처 관리 > 거래처 조회(견적용) API 에서 '상호명' 을 넣고 조회한 목록에서 정보 가져옴.
    "customerInfoList": [],

    "maker": "",                   // MAKER
    "item": "",                     // ITEM
    "remarks": "",                  // 비고란
    "footerTag": "",                    // 하단 태그란
    "attachment": "",                   // 첨부파일 여부 (있으면 "V", 없으면 "")
    "instructions": "",                 // 지시사항

    "rfqNo": "",                        // RFQ NO.
    "projectTitle": "",                 // 프로젝트 제목
    "endUser": "",                      // End User
    "dueDate": null,                      // 마감일자

    "agencyManagerId": 1,               // 대리점 담당자 Id (메일 전송용)
    "agencyType": "국내",                // 대리점 타입

    "adminId": 1,                       // 만쿠 관리자 Id

    "estimateRequestDetailList": []
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
                "order": '미주문',
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
    "limit": -1
}

export const remittanceDomesticInitial = {
    "searchText": "",
    "searchRequestDate": "",// 검색어: 담당자, 인쿼리, 판매처 업체명, 구매처 업체명
    "searchStartRequestDate": "",       // 송금 요청일자 시작일
    "searchEndRequestDate": "",
    "searchScheduledDate": "",// 송금 요청일자 종료일
    "searchStartScheduledDate": "",     // 송금 지정일자 시작일
    "searchEndScheduledDate": "",       // 송금 지정일자 종료일
    "searchStartDate": "",              // 등록일자 시작일
    "searchEndDate": "",                // 등록일자 종료일
    "searchIsTransferred": null,        // 송금여부(true, false)
    "searchIsRead": null,               // 읽음 여부
    "searchAdminId": null,              // 담당자 Id
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
export const codeDiplomaReadInitial = {
    "searchStartDate": "",      // 작성일자 검색 시작일
    "searchEndDate": "",        // 작성일자 검색 종료일
    "searchDocumentNumber": "",           // 문서번호 검색
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
    "limit": -1
}


export const codeDomesticAgencyWriteInitial = {
    "agencyCode": "",        // 코드(약칭)
    "dealerType": "딜러",        // "딜러", "제조"
    "grade": "A",               // 등급
    "margin": null,                // 마진
    "agencyName": "",   // 상호
    "maker": "",            // MAKER
    "homepage": "",   // 홈페이지
    "tradeStartDate": "",         // 거래시작일
    "businessRegistrationNumber": "",       // 사업자 번호
    "bankAccountNumber": "",                // 계좌번호
    "item": "",                             // 아이템
    "agencyManagerList": []
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

    "customerCategory": ""
}