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
}
export const rfqWriteInitial = {
    "documentNumberFull": "",
    "writtenDate": "",
    "agencyCode": "",
    "agencyName": "",
    "customerCode": "",
    "managerName": '', // 담당자
    "customerName": "", // 상호명
    "customerManager" : '', // customer 담당자
    "phoneNumber": "", // 전화번호
    "faxNumber": "", // 팩스번호
    "maker": "",
    "item": "",
    "remarks": "",
    "instructions": "", //지시사항
}

export const subRfqWriteInitial = {
    // "model": "",
    // "quantity": 0,
    // "unit":'ea',
    // "currency": "krw",
    // "net": 0,
    // "unitPrice": 0,
    // "deliveryDate": "",
    // "content": "",
    // "replyDate": "",
    // "remarks": ""
}

export const rfqReadInitial = {
    "searchStartDate": "",
    "searchEndDate": "",
    "searchDocumentNumber": "",
    "searchType": "",
    "searchCreatedBy": "",
    "searchCustomerName": "",
    "searchMaker": "",
    "searchModel": 0,
    "searchItem":'ea',
}

export const subRfqReadInitial = {
    "startDate": "",
    "endDate": "",
    "documentNumberFull":"",
    "agencyCode": "",
    "agencyName": "",
    "searchTypeSend": 0,
    "searchTypeReply": 0,
    "customerName": "",
    "managerName": "",
}

export const rfqMailSendInitial = {
    "startDate": "",
    "endDate": "",
    "documentNumberFull":"",
    "agencyCode": "",
    "agencyName": "",
    "searchTypeSend": 0,
    "searchTypeReply": 0,
    "customerName": "",
}

export const subRfqMailSendInitial = {
    "writtenDate": "",
    "documentNumberFull":"",
    "agencyCode": "",
    "agencyName": "",
    "maker": "",
    "item": "",
    "model": "",
    "quantity": "",
    "unit": "ea",
    "isSent": false,
    "attachment": null,
    "writer": "",
    "remarks": "",
}

