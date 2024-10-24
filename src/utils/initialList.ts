
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
    "estimateDetailList": []
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
    "model": '',           // MODEL
    "quantity": 0,              // 수량
    "unit": 'EA',               // 단위
    "currency":'USD',          // CURR
    "net": 0 ,            // NET/P
    "deliveryDate": '',   // 납기
    "content": '',         // 내용
    "replyDate": '',  // 회신일
    "remarks": ''      // 비고
}

export const subRfqReadInitial = {
    "searchEstimateRequestId": "",      // 견적의뢰 Id
    "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
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

