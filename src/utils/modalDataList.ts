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

export const tableEstimateReadInfo = {
    "writtenDate" : {title : '작성일자'},
    "documentNumber":{title : '문서번호'},
    "agencyCode": {title : '코드'},                   // 검색조건 1: 회신, 2: 미회신
    "customerName": {title : '거래처명'},               // 작성일자 시작일
    "maker": {title : 'MAKER'},                // 작성일자 종료일
    "item": {title : 'ITEM'},        // 문서번호
    "model": {title : 'MODEL'},            // 거래처명
    "quantity": {title : '수량'},                   // MAKER
    "unit": {title : '단위'},                 // MODEL
    "deliveryDate": {title : '납기'},                     // ITEM
    "order": {title : '주문'},                // 등록직원명
    "unitPrice": {title : '단가'},             // 담당자명
    "total": {title : '합계'},            // 담당자 연락처
    "register": {title : '등록자'},            // 입찰번호(미완성)
    "remarks": {title : '비고란'},           // 입찰번호(미완성)
}

export const tableEstimateWriteInfo = {
    "model": {title : 'MODEL'},            // 거래처명
    "quantity": {title : '수량'},                   // MAKER
    "unit": {title : '단위'},                 // MODEL
    "currency" : {title : 'CURR'},
    "net": {title : 'NET/P'},
    "unitPrice": {title : '단가'},             // 담당자명
    "amount": {title : '금액'},
}



export const subOrderWriteInfo = {
    "model": {title : 'MODEL'},           // MODEL     // 수량
    "unit": {title : '단위'},               // 단위
    "currency": {title : 'CURR'},          // CURR
    "net": {title : 'NET/P'},            // NET/P
    "amount": {title : 'Amount'},
    "quantity": {title : '주문수량'},
    "receivedQuantity": {title : '입고'},
    "unreceivedQuantity": {title : '미입고'},
    "unitPrice": {title : '단가'},
    "price": {title : '금액'},
}

export const tableOrderReadInfo = {
    "orderId": {title : 'No'},                   // 검색조건 1: 회신, 2: 미회신
    "writtenDate": {title : '작성일자'},              // 작성일자 시작일
    "documentNumberFull": {title : '문서번호'},              // 작성일자 종료일
    "customerName": {title : '거래처명'},         // 문서번호
    "item": {title : 'ITEM'},           // 거래처명
    "maker": {title : 'MAKER'},                  // MAKER
    "model": {title : 'MODEL'},                  // MODEL
    "unit": {title : '단위'},                   // ITEM
    "currency": {title : 'CURR'},                   // ITEM
    "net": {title : 'NET'},                   // ITEM
    "amount": {title : 'Amount'},                   // ITEM
    "quantity": {title : '주문수량'},                   // ITEM
    "receivedQuantity": {title : '입고수량'},              // 등록직원명
    "unreceivedQuantity": {title : '미입고수량'},              // 등록직원명
    "unitPrice": {title : '단가'},              // 등록직원명
    "price": {title : '금액'},              // 등록직원명
    "inspection": {title : '예상납기'},              // 등록직원명
    "estimateManager": {title : '(견적서)담당자'},              // 등록직원명
    "remarks": {title : '비고란'},              // 등록직원명
}

export const subInvenReadInfo = {
    "searchText": {title : '재고등록검색(문서번호, MAKER, Model)'},                  // MAKER
    "searchMaker": {title : 'MAKER'},                  // MAKER
    "searchModel": {title : 'MODEL'},                  // MODEL
    "searchItem": {title : 'ITEM'},                   // ITEM
}

export const tableOrderInventoryInfo = {
    "receiptDate": {title : '입고일자'},           // MODEL
    "documentNumber": {title : '문서번호'},               // 단위
    "maker": {title : 'Maker'},            // NET/P
    "model": {title : 'Model'},
    "importUnitPrice": {title : '수입단가'},
    "currencyUnit": {title : '화폐단위'},
    "receivedQuantity": {title : '입고량'},
    "usageQuantity": {title : '출고량'},
    "unit": {title : '단위'},
    "location": {title : '위치'},
    "remarks": {title : '비고'},
}

export const subCustomerReadInfo = {
    "agencyId": {title : 'No'},                  // MAKER
    "customerName": {title : '거래처명'},                  // MAKER
    "unpaidAmount": {title : '미입고금액'},                  // MAKER
    "paidAmount": {title : '입고금액'},                  // MODEL
    "totalAmount": {title : '합계'},                   // ITEM
}

export const subAgencyReadInfo = {
    "agencyId": {title : 'No'},                  // MAKER
    "agencyCode": {title : '코드'},                  // MAKER
    "agencyName": {title : '대리점명'},                  // MAKER
    "unpaidAmount": {title : '미입고외화'},                  // MAKER
    "paidAmount": {title : '입고외화'},                  // MODEL
    "totalAmount": {title : '외화합계'},                   // ITEM
    "krwTotalAmount": {title : '원화합계'},                   // ITEM
}

export const tableCodeDiplomaInfo = {
    "documentNumber": {title : '문서번호'},           // MODEL
    "title": {title : '문서제목'},              // 수량
    "to": {title : '수신'},               // 단위
    "reference": {title : '참조'},          // CURR
    "subTitle": {title : '소제목'},            // NET/P
    "content": {title : '내용'},
    "registerer": {title : '등록자'},
    "registerDate": {title : '등록일자'},
    "modifier": {title : '수정자'},
    "modifyDate": {title : '수정일자'},
}

export const tableCodeExchangeInfo = {
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

export const tableCodeReadInfo = {
    "item": {title : 'ITEM'},           // MODEL
    "hsCode": {title : 'HS-CODE'},              // 수량
}

export const tableCodeUserInfo = {
    "customerName": {title : '업체명'},           // MODEL
    "id": {title : 'ID'},              // 수량
    "pw": {title : 'Password'},              
    "homepage": {title : '홈페이지'},              
    "remarks": {title : '비고'},              
}

export const tableCodeErpInfo = {
    "id": {title : 'ID'},              // 수량
    "pw": {title : 'Password'},
    "name": {title : '이름'},
    "position": {title : '직급'},
    "right": {title : '권한'},
    "email": {title : '이메일'},
    "phoneNumber": {title : '연락처'},
    "faxNumber": {title : '팩스번호'},
    "rightInfo": {title : '권한정보'},
}

export const modalCodeDiplomaInfo = {
    "documentNumber": {title : '문서번호'},              // 수량
    "title": {title : '제목'},
    "to": {title : '수신'},
    "reference": {title : '참조'},
    "subTitle": {title : '소제목'},
    "content": {title : '내용'},
}

export const tableCodeDomesticPurchaseInfo = {
    "agencyCode": {title : '코드(약칭)'},              // 수량
    "agencyName": {title : '상호'},
    "dealerType": {title : '딜러'},
    "grade": {title : '등급'},
    "margin": {title : '마진'},
    "maker": {title : 'MAKER'},
    "homepage": {title : '홈페이지'},
    "businessRegistrationNumber": {title : '사업자번호'},
    "bankAccountNumber": {title : '계좌번호'},
    "item": {title : 'ITEM'},
    "tradeStartDate": {title : '거래시작일'},
    "customerManager": {title : '담당자'},
    "phoneNumber": {title : '전화번호'},
    "faxNumber": {title : '팩스번호'},
    "email": {title : '이메일'},
    "address": {title : '주소'},
    "countryAgency": {title : '국가대리점'},
    "cellPhoneNumber": {title : '휴대폰'},
    "remarks": {title : '비고'},
}

export const tableCodeDomesticSalesInfo = {
    "agencyCode": {title : '코드'},              // 수량
    "agencyName": {title : '상호'},
    "region": {title : '지역'},
    "tradeStartDate": {title : '거래시작일'},
    "phoneNumber": {title : '전화번호'},
    "faxNumber": {title : '팩스번호'},
    "homepage": {title : '홈페이지'},
    "postalCode": {title : '우편번호'},
    "address": {title : '주소'},
    "businessRegistrationNumber": {title : '사업자번호'},
    "customerName": {title : '거래처'},
    "remarks": {title : '비고'},
    "managerName": {title : '만쿠담당자'},
    "checkList": {title : '업체확인사항'},
    "cargoCharge": {title : '화물운송료'},
    "cargoPoint": {title : '화물지점'},
    "paymentMethod": {title : '결제방법'},
    "dealerType": {title : '딜러구분'},
}

export const tableCodeOverseasSalesInfo = {
    "agencyCode": {title : '코드'},              // 수량
    "agencyName": {title : '상호'},
    "region": {title : '지역'},
    "tradeStartDate": {title : '거래시작일'},
    "phoneNumber": {title : '전화번호'},
    "faxNumber": {title : '팩스번호'},
    "currencyUnit": {title : '화폐단위'},
    "managerName": {title : '만쿠담당자'},
    "checkList": {title : '업체확인사항'},
    "ftaNo": {title : 'FTANo'},
    "homepage": {title : '홈페이지'},
    "postalCode": {title : '우편번호'},
    "address": {title : '주소'},
    "customerName": {title : '거래처'},
    "remarks": {title : '비고'},
    "customerManager": {title : '담당자'},
    "email": {title : '이메일'},
}


export const tableCodeOverseasPurchaseInfo = {
    "agencyCode": {title : '코드(약칭)'},              // 수량
    "agencyName": {title : '상호'},
    "dealerType": {title : '딜러'},
    "grade": {title : '등급'},
    "margin": {title : '마진'},
    "homepage": {title : '홈페이지'},
    "item": {title : 'ITEM'},
    "tradeStartDate": {title : '거래시작일'},
    "currencyUnit":{title : '화폐단위'},
    "manager":{title : '거래시작일'},
    "bankAccountNumber": {title : '계좌번호'},
    "country":{title : '국가'},
    "ftaNo":{title : 'FTANo'},
    "bankName":{title : '송금중개은행'},
    "agencyAddress":{title : '주소'},
    "ibanCode":{title : 'IBanCode'},
    "swiftCode":{title : 'SwiftCode'},
    "createdBy": {title : '등록자'},
    "createdDate": {title : '등록일자'},
    "modifiedBy": {title : '수정자'},
    "modifiedDate": {title : '수정일자'},
    "customerManager": {title : '담당자'},
    "phoneNumber": {title : '전화번호'},
    "faxNumber": {title : '팩스번호'},
    "email": {title : '이메일'},
    "address": {title : '주소'},
    "countryAgency": {title : '국가대리점'},
    "cellPhoneNumber": {title : '휴대폰'},
    "remarks": {title : '비고'},
}


