import {subCodeDiplomaColumns} from "@/utils/columnList";

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

export const subCodeDiplomaInfo = {
    "model": {title : '문서번호'},           // MODEL
    "quantity": {title : '문서제목'},              // 수량
    "unit": {title : '수신'},               // 단위
    "currency": {title : '참조'},          // CURR
    "net": {title : '소제목'},            // NET/P
    "amount": {title : '내용'},
    "orderQuantity": {title : '등록자'},
    "receivedQuantity": {title : '등록일자'},
    "unreceivedQuantity": {title : '수정자'},
    "unitPrice": {title : '수정일자'},
}

export const subCodeExchangeInfo = {
    "model": {title : '통화'},           // MODEL
    "quantity": {title : '통화명'},              // 수량
    "unit": {title : '매매기준율'},               // 단위
    "currency": {title : '송금보낼때'},          // CURR
    "net": {title : '송금받을때'},            // NET/P
    "amount": {title : '현찰살때(스프레드)'},
    "orderQuantity": {title : '현찰팔때(스프레드)'},
    "receivedQuantity": {title : 'T/C살때'},
    "unitPrice": {title : '미화환산율'},
}

export const subCodeReadInfo = {
    "item": {title : 'ITEM'},           // MODEL
    "hsCode": {title : 'HS-CODE'},              // 수량
}

export const subCodeUserInfo = {
    "customerName": {title : '업체명'},           // MODEL
    "id": {title : 'ID'},              // 수량
    "pw": {title : 'Password'},              
    "homepage": {title : '홈페이지'},              
    "remarks": {title : '비고'},              
}

