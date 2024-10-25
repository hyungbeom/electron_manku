export const subRfqWriteInfo = {
    "model": {title : 'MODEL'},           // MODEL
    "quantity": {title : '수량'},              // 수량
    "unit": {title : '단위'},               // 단위
    "currency": {title : 'CURR'},          // CURR
    "net": {title : 'NET/P'},            // NET/P
    "serialNumber": 1,          // 항목 순서 (1부터 시작)
    "deliveryDate": {title : '납기'},   // 납기
    "content": {title : '내용'},         // 내용
    "replyDate": {title : '회신일'},  // 회신일
    "remarks": {title : '비고'}      // 비고

}

export const subRfqReadInfo = {
    "searchType": {title : '검색조건'},                   // 검색조건 1: 회신, 2: 미회신
    "searchStartDate": {title : '시작일'},              // 작성일자 시작일
    "searchEndDate": {title : '종료일'},              // 작성일자 종료일
    "searchDocumentNumber": {title : '문서번호'},         // 문서번호
    "searchCustomerName": {title : '거래처명'},           // 거래처명
    "searchMaker": {title : 'MAKER'},                  // MAKER
    "searchModel": {title : 'MODEL'},                  // MODEL
    "searchItem": {title : 'ITEM'},                   // ITEM
    "searchCreatedBy": {title : '등록직원명'},              // 등록직원명
}

export const subOrderWriteInfo = {
    "model": {title : 'MODEL'},           // MODEL
    "quantity": {title : '수량'},              // 수량
    "unit": {title : '단위'},               // 단위
    "currency": {title : 'CURR'},          // CURR
    "net": {title : 'NET/P'},            // NET/P
    "amount": {title : 'Amount'},
    "orderQuantity": {title : '주문'},
    "receivedQuantity": {title : '입고'},
    "unreceivedQuantity": {title : '미입고'},
    "unitPrice": {title : '단가'},
    "price": {title : '금액'},
}

export const subOrderReadInfo = {
    "searchType": {title : '검색조건'},                   // 검색조건 1: 회신, 2: 미회신
    "searchStartDate": {title : '시작일'},              // 작성일자 시작일
    "searchEndDate": {title : '종료일'},              // 작성일자 종료일
    "searchDocumentNumber": {title : '문서번호'},         // 문서번호
    "searchCustomerName": {title : '거래처명'},           // 거래처명
    "searchMaker": {title : 'MAKER'},                  // MAKER
    "searchModel": {title : 'MODEL'},                  // MODEL
    "searchItem": {title : 'ITEM'},                   // ITEM
    "searchCreatedBy": {title : '등록직원명'},              // 등록직원명
}

export const subInvenReadInfo = {
    "searchText": {title : '재고등록검색(문서번호, MAKER, Model)'},                  // MAKER
    "searchMaker": {title : 'MAKER'},                  // MAKER
    "searchModel": {title : 'MODEL'},                  // MODEL
    "searchItem": {title : 'ITEM'},                   // ITEM
}

export const subInvenWriteInfo = {
    "receiptDate": {title : '입고일자'},           // MODEL
    "documentNumber": {title : '문서번호'},               // 단위
    "maker": {title : 'Maker'},            // NET/P
    "model": {title : 'Model'},
    "importUnitPrice": {title : '수입단가'},
    "currencyUnit": {title : '화폐단위'},
    "receivedQuantity": {title : '입고수량'},
    "unit": {title : '단위'},
    "location": {title : '위치'},
    "remarks": {title : '비고'},
}

export const subCustomerReadInfo = {
    "customerName": {title : '거래처명'},                  // MAKER
    "unpaidAmount": {title : '미입고금액'},                  // MAKER
    "paidAmount": {title : '입고금액'},                  // MODEL
    "totalAmount": {title : '합계'},                   // ITEM
}

export const subAgencyReadInfo = {
    "agencyCode": {title : '코드'},                  // MAKER
    "agencyName": {title : '대리점명'},                  // MAKER
    "unpaidAmount": {title : '미입고외화'},                  // MAKER
    "paidAmount": {title : '입고외화'},                  // MODEL
    "totalAmount": {title : '외화합계'},                   // ITEM
    "krwTotalAmount": {title : '원화합계'},                   // ITEM
}