import moment from "moment";

export const projectInfo = {
    write: {
        columnWidth: [160, 220, 220, 200, 55, 55, 65, 45, 120, 120, 120, 120, 80, 45, 160, 130, 130, 180, 160, 120, 180],
        column: ['연결 Inquiry No.', 'Model', 'Maker', 'Item','수식', '마진율', '단위', '수량', '매출 단가', '매출 총액', '매입 단가', '매입 총액','배송비', '화폐단위', '납기(weeks)', '매입처명', '매입처 담당자명', '매입처 연락처', '매입처 이메일', '관련링크', '납품기한', '비고'],
        columnList: [
            {data: "connectInquiryNo", type: "text"},
            {data: "model", type: "text"},
            {data: "maker", type: "text"},
            {data: "item", type: "text"},
            {data: "calcCheck", type: "checkbox"},
            {data: "marginRate", type: "numeric"},
            {
                data: "unit",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "quantity", type: "numeric",},
            {data: "unitPrice", type: "numeric"},
            {data: "total", type: "numeric", readOnly: true},
            {data: "purchasePrice", type: "numeric"},
            {data: "totalPurchase", type: "numeric", readOnly: true},
            {data: "deliveryPrice", type: "numeric"},
            {data: "currencyUnit", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "deliveryDate", type: "numeric"},
            {data: "agencyName", type: "text"},
            {data: "agencyManagerName", type: "text"},
            {data: "agencyManagerPhone", type: "text"},
            {data: "agencyManagerEmail", type: "text"},
            {data: "relatedLink", type: "text"},
            {data: "requestDeliveryDate", type: "date"},
            {data: "remarks", type: "text"}
        ],
        defaultData: {
            "connectInquiryNo": "",
            "model": "",
            "maker": "",
            "item": "",
            "calcCheck": "",
            "marginRate": "",
            "unit": "",
            "quantity": '',
            "unitPrice": '',
            "total": "",
            "purchasePrice": '',
            "totalPurchase": "",
            "deliveryPrice": "",
            "currencyUnit": "",
            "deliveryDate": "",
            "agencyName": "",
            "agencyManagerName": "",
            "agencyManagerPhone": "",
            "agencyManagerEmail": "",
            "relatedLink": "",
            "requestDeliveryDate": "",
            "remarks": ""
        },
        mapping: {
            "connectInquiryNo": "연결 Inquiry No.",
            "model": "Model",
            "maker": "Maker",
            "item": "Item",
            "calcCheck": "수식",
            "marginRate": "마진율",
            "unit": "단위",
            "quantity": "수량",
            "unitPrice": "매출 단가",
            "total": "매출 총액",
            "purchasePrice": "매입 단가",
            "totalPurchase": "매입 총액",
            "deliveryPrice": "배송비",
            "currencyUnit": "화폐단위",
            "deliveryDate": "납기(weeks)",
            "agencyName": "매입처명",
            "agencyManagerName": "매입처 담당자명",
            "agencyManagerPhone": "매입처 연락처",
            "agencyManagerEmail": "매입처 이메일",
            "relatedLink": "관련링크",
            "requestDeliveryDate": "납품기한",
            "remarks": "비고"
        },
        excelExpert: (v, i) => {
            v['total'] =`=H${i + 1}*I${i + 1}`
            v['totalPurchase'] = `= (H${i + 1} * K${i + 1}) + M${i + 1}`
            v['unitPrice'] = `= (L${i + 1} / H${i + 1})`
            return v
        },
        totalList: {
            connectInquiryNo: '',
            model: '',
            maker: '',
            item: '',
            calcCheck: '',
            marginRate: '',
            unit: '',
            quantity: '=SUM(H1:H100)',
            unitPrice: '=SUM(I1:I100)',
            total: '=SUM(J1:J100)',
            purchasePrice: '=SUM(K1:K100)',
            totalPurchase: '=SUM(L1:L100)',
            deliveryPrice: '=SUM(M1:M100)',
        },
        type: 'write'
    },
    defaultInfo: {
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
    },
};


export const rfqInfo = {
    write: {
        columnWidth: [220, 45, 45, 55, 120, 120, 45, 75, 75, 150],
        column: ['Model', '수량', '단위', '화폐단위', '매입 단가', '매입 총액', '납기(weeks)', '회신여부', '회신일', '비고'],
        columnList: [
            {data: "model", type: "text"},
            {data: "quantity", type: "numeric"},
            {
                data: "unit",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "currencyUnit", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "unitPrice", type: "numeric", pattern : {pattern : 0.00}},
            {data: "total", type: "text", readOnly: true},
            {data: "deliveryDate", type: "numeric"},
            {
                data: "content",
                type: "autocomplete",
                source: ['미회신', '회신', '정보부족', '한국대리점', 'MOQ', 'OEM', '단종', '견적포기', '입찰마감', '견적불가', '기타']
            },
            {data: "replyDate", type: "date"},
            {data: "remarks", type: "text"},

        ],
        defaultData: {
            "model": '',             // Model
            "quantity": '',           // 수량
            "unit": "",            // 단위
            "currencyUnit": "",       // CURR
            "unitPrice": '',                // 매입단가
            "total": '',                // 매입단가
            "serialNumber": '',       // 항목 순서 (1부터 시작)
            "deliveryDate": '',      // 납기
            "content": "",       // 내용
            "replyDate": '',         // 회신일
            "remarks": ""            // 비고
        }, mapping: {
            "model": 'Model',             // Model
            "quantity": '수량',           // 수량
            "unit": "단위",            // 단위
            "currency": "화폐단위",       // CURR
            "net": '매입 단가',                // 매입단가
            "totalNet": '매입 총액',                // 매입단가
            "serialNumber": '',       // 항목 순서 (1부터 시작)
            "deliveryDate": '납기(weeks)',      // 납기
            "content": "회신여부",       // 내용
            "replyDate": '회신일',         // 회신일
            "remarks": "비고"            // 비고
        },
        excelExpert: (v, i) => {
            v['total'] = `=B${i + 1}*E${i + 1}`
            return v
        },
        totalList: {
            "model": '',             // Model
            "quantity": '=SUM(B1:B100)',           // 수량
            "unit": "",            // 단위
            "currency": "",       // CURR
            "unitPrice": '=SUM(E1:E100)',                // 매입단가
            "total": '=SUM(F1:F100)',                // 매입단가
            "serialNumber": '',       // 항목 순서 (1부터 시작)
            "deliveryDate": '',      // 납기
            "content": "",       // 내용
            "replyDate": '',         // 회신일
            "remarks": ""            // 비고
        },
        type: 'write'
    },
    defaultInfo: {
        createdBy: '',
        managerAdminName: '',
        agencyTel: '',
        managerAdminId: null,

        writtenDate: moment().format('YYYY-MM-DD'),

        documentNumberFull: '',   // ====== api 통해서 가져와야 함?
        rfqNo: '',
        projectTitle: '',
// ====================================
        agencyCode: '',
        agencyName: '',
        agencyManagerName: '',
        agencyManagerEmail: '',
        agencyManagerId: '',
        dueDate: '',
        agencyType: '',
        // ======================
        customerCode: '', //없어도 되는것
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

        remarks: '',
        endUser: '',


    },
};


export const estimateInfo = {
    write: {
        columnWidth: [250, 40, 40, 45, 120, 120, 120, 120, 120, 50],
        column: ['Model', '수량', '단위', '화폐단위', '매출 단가', '매출 총액', '매입 단가', '매입 총액', '마진율'],
        columnList: [
            {data: "model", type: "text"},
            {data: "quantity", type: "numeric"},
            {
                data: "unit",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "currencyUnit", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "net", type: "numeric"},
            {data: "totalNet", type: "numeric", readOnly: true},
            {data: "unitPrice", type: "numeric"},
            {data: "total", type: "numeric", readOnly: true},
            {data: "marginRate", type: "numeric"},

        ],
        defaultData: {
            "model": "",   // Model
            "quantity": '',                  // 수량
            "unit": "",                   // 단위
            "currencyUnit": '',          // CURR
            "net": '',                 // 매입단가
            "unitPrice": '',           // 단가
            "marginRate": '',           // 단가
        }, mapping: {
            "model": "Model",   // Model
            "quantity": '수량',                  // 수량
            "net": '매출 단가',
            // 단가
            "totalNet": '매출 총액',           // 단가
            "unit": "단위",                   // 단위
            "currency": '화폐단위',          // CURR
            "unitPrice": '매입 단가',
            "total": '매입 총액',                 // 매입단가
            "marginRate": '마진율',           // 단가
        },
        excelExpert: (v, i) => {
            v['totalNet'] = `=B${i + 1}*E${i + 1}`
            v['total'] = `=B${i + 1}*G${i + 1}`
            return v
        },
        totalList: {
            "model": "",   // Model
            "quantity": '=SUM(B1:B100)',                  // 수량
            "unit": "",                   // 단위
            "currencyUnit": '',          // CURR
            "net": '=SUM(E1:E100)',                 // 매입단가
            "totalNet": '=SUM(F1:F100)',                 // 매입단가
            "unitPrice": '=SUM(G1:G100)',           // 단가
            "total": '=SUM(H1:H100)',           // 단가
            "marginRate": ''                 // 매입단가

        },

        type: 'write'
    },
    defaultInfo: {
        createdBy: '',
        agencyTel: '',
        managerAdminName: '',
        managerAdminId: null,
        "writtenDate": moment().format('YYYY-MM-DD'),    // 작성일
        "documentNumberFull": "", // Inquiry No.
        "agencyCode": "",            // 대리점코드
        "agencyName": "",
        "agencyManagerName": "",
        "agencyManagerEmail": "",
        "deliveryTerms": "",
        "agencyManagerPhoneNumber": "",
        "customerCode": "",             // CUSTOMER 코드
        "customerName": "",    // 상호명
        "customerManagerEmail": "",    // 상호명
        "managerEmail": "",    // 상호명
        "managerName": "",      // 담당자
        "phoneNumber": "",  // 연락처
        "faxNumber": "",                // 팩스번호
        "validityPeriod": '견적 발행 후 10일간',    // 유효기간
        "paymentTerms": '발주시 50% / 납품시 50%',                // 결제조건
        "shippingTerms": '귀사도착도',             // 운송조건
        "exchangeRate": "",                  // 환율
        "estimateManager": "",            // 담당자
        "email": "",             // E-MAIL
        "managerPhoneNumber": "",   // 연락처
        "managerFaxNumber": "",       // 팩스번호
        "maker": "",      // Maker
        "item": "",      // Item
        "delivery": null,    // 납기
        "instructions": "",          // 지시사항
        "remarks": "",          // 비고란
        "currencyUnit": "",          // 비고란
        'count': 0,
        attnTo: '',
        uploadType: 3
    },
};


export const orderInfo = {
    write: {
        columnWidth: [220, 50, 50, 50, 45, 50, 120, 120, 120, 120, 80],
        column: [
            'Model',
            '주문',
            '입고',
            '미 입고',
            '단위',
            '화폐단위',
            '매입 단가',
            '매입 총액',
            '매출 단가',
            '매출 총액',
            'HS-CODE'],
        columnList: [
            {data: "model", type: "text"},
            {data: "quantity", type: "numeric"},
            {data: "receivedQuantity", type: "numeric"},
            {data: "unreceivedQuantity", type: "numeric", readOnly: true},
            {
                data: "unit",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "currency", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "net", type: "numeric"},
            {data: "total", type: "numeric"},
            {data: "unitPrice", type: "numeric"},
            {data: "totalNet", type: "numeric"},
            {data: "hsCode", type: "text"},

        ],
        defaultData: {
            "model": "",           // Model
            "quantity": '',              // 수량
            "receivedQuantity": '',
            "unreceivedQuantity": '',
            "unit": '',               // 단위
            "currency": '',
            "net": '',            // 매입단가
            "total": '',            // 매입단가

            "unitPrice": '',
            "totalNet": '',
            "hsCode": '',
        },mapping: {
            "model": "Model",           // Model
            "quantity": '주문',              // 수량
            "receivedQuantity": '입고',
            "unreceivedQuantity": '미 입고',
            "unit": '단위',               // 단위
            "currency": '화폐단위',
            "net": '매입 단가',            // 매입단가
            "total": '매입 총액',            // 매입단가

            "unitPrice": '매출 단가',
            "totalNet": '매출 총액',
            "hscode": 'HS-CODE',
        },
        excelExpert: (v, i) => {
            v['unreceivedQuantity'] = `=B${i + 1} -C${i + 1}`
            v['total'] = `=B${i + 1}*G${i + 1}`
            v['totalNet'] = `=B${i + 1}*I${i + 1}`
            return v
        },
        totalList: {
            "model": "",           // Model
            "quantity": '=SUM(B1:B100)',              // 수량
            "receivedQuantity": '=SUM(C1:C100)',
            "unreceivedQuantity": '=SUM(D1:D100)',
            "unit": '',               // 단위
            "currency": '',
            "net": '=SUM(G1:G100)',            // 매입단가
            "total": '=SUM(H1:H100)',            // 매입단가
            "unitPrice": '=SUM(I1:I100)',
            "totalNet": '=SUM(J1:J100)',            // 매입단가
            "hscode": '',
        },

        type: 'write'
    },
    defaultInfo: {
        attnTo: '',
        createdBy: '',
        managerAdminName: '',
        managerAdminId: null,
        "ourPoNo": "",    //  PO No
        "documentNumberFull": "",    // Our PO No
        "writtenDate": moment().format('YYYY-MM-DD'),
        "yourPoNo": "",                // Your PO No
        "agencyCode": "",  // Messrs
        "agencyName": "",  // Messrs
        "customerName": "",          // 고객사명
        agencyManagerName: '',
        "customerId": 0,          // 고객사명
        "estimateManager": "",            // 견적서담당자
        "managerID": "",                 // Responsibility
        "managerPhoneNumber": "",  // Tel
        "managerFaxNumber": "",      // E-Mail
        "managerEmail": "",   // Fax
        "paymentTerms": '발주시 50% / 납품시 50%',    // Payment Terms
        "deliveryTerms": "",              // 납기 Terms
        "maker": "",                    // Maker
        "item": "",                       // Item
        "delivery": '',               // 납기
        "remarks": "",                      // 비고란
        "currencyUnit": "",                      // 비고란
        uploadType: 4
    },
};


export const storeInfo = {
    write: {
        columnWidth: [220, 50, 50, 50, 45, 50, 120, 120, 120, 120, 80, 50, 50, 50, 50, 50, 50, 50, 50, 50],
        column: [
            "Inquiry No.",
            "세부항목 번호",
            "매입처명",
            "고객사명",
            "환율",
            "발주일자",
            "송금일자",
            "수량",
            "금액",
            "환폐단위",
            "원화환산금액",
            "수수료",
            "판매금액",
            "판매금액(VAT 포함)",
            "입고일자",
            "출고일자",
            "계산서 발행일자",
            "결제 여부",
            "선수금",
            "비고"
        ],
        columnList: [
            {data: "orderDocumentNumberFull", type: "text"},
            {data: "itemDetailNo", type: "numeric"},
            {data: "agencyName", type: "numeric"},
            {data: "customerName", type: "numeric", readOnly: true},
            {
                data: "exchangeRate",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "orderDate", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "remittanceDate", type: "numeric"},
            {data: "quantity", type: "numeric"},
            {data: "amount", type: "numeric"},
            {data: "currencyUnit", type: "numeric"},
            {data: "returnAmount", type: "numeric"},
            {data: "commissionFee", type: "text"},
            {data: "salesAmount", type: "text"},
            {data: "salesAmountVat", type: "text"},
            {data: "receiptDate", type: "text"},
            {data: "deliveryDate", type: "text"},
            {data: "", type: "text"},
            {data: "paymentStatus", type: "text"},
            {data: "advancePayment", type: "text"},
            {data: "remarks", type: "text"},
        ],
        defaultData: {
            "orderDocumentNumberFull": "",
            "itemDetailNo": "",
            "agencyName": "",
            "customerName": "",
            "exchangeRate": "",
            "orderDate": "",
            "remittanceDate": "",
            "quantity": "",
            "amount": "",
            "currencyUnit": "",
            "returnAmount": "",
            "commissionFee": "",
            "salesAmount": "",
            "salesAmountVat": "",
            "receiptDate": "",
            "deliveryDate": "",
            "": "",
            "paymentStatus": "",
            "advancePayment": "",
            "remarks": ""
        },
        excelExpert: (v, i) => {
            v['amount'] = `=H${i + 1} -C${i + 1}`
            v['total'] = `=B${i + 1}*G${i + 1}`
            v['totalNet'] = `=B${i + 1}*I${i + 1}`
            return v
        },
        totalList: {
            "model": "",           // Model
            "quantity": '=SUM(B1:B100)',              // 수량
            "receivedQuantity": '=SUM(C1:C100)',
            "unreceivedQuantity": '=SUM(D1:D100)',
            "unit": '',               // 단위
            "currency": '',
            "net": '=SUM(G1:G100)',            // 매입단가
            "total": '=SUM(H1:H100)',            // 매입단가
            "unitPrice": '=SUM(I1:I100)',
            "totalNet": '=SUM(J1:J100)',            // 매입단가
            "hscode": '',
        },

        type: 'write'
    },
    defaultInfo: {
        createdBy: '',
        managerAdminName: '',
        managerAdminId: null,
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
    },
};


export const DCWInfo = {
    write: {
        columnWidth: [220, 50, 50, 50, 45],
        column: [
            '담당자',
            '연락처',
            '팩스번호',
            '휴대폰번호',
            '이메일',
            '비고'
        ],
        columnList: [
            {data: "managerName", type: "text"},
            {data: "directTel", type: "numeric"},
            {data: "faxNumber", type: "numeric"},
            {data: "mobileNumber", type: "numeric", readOnly: true},
            {
                data: "email",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "remarks", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},


        ],
        defaultData: {
            "managerName": "",
            "directTel": "",
            "faxNumber": "",
            "mobileNumber": "",
            "email": "",
            "remarks": ""
        },
        excelExpert: (v, i) => {
            v['amount'] = `=H${i + 1} -C${i + 1}`
            v['total'] = `=B${i + 1}*G${i + 1}`
            v['totalNet'] = `=B${i + 1}*I${i + 1}`
            return v
        },
        totalList: {
            "model": "",           // Model
            "quantity": '=SUM(B1:B100)',              // 수량
            "receivedQuantity": '=SUM(C1:C100)',
            "unreceivedQuantity": '=SUM(D1:D100)',
            "unit": '',               // 단위
            "currency": '',
            "net": '=SUM(G1:G100)',            // 매입단가
            "total": '=SUM(H1:H100)',            // 매입단가
            "unitPrice": '=SUM(I1:I100)',
            "totalNet": '=SUM(J1:J100)',            // 매입단가
            "hscode": '',
        },

        type: 'write'
    },
    defaultInfo: {
        createdBy: '',
        managerAdminName: '',
        managerAdminId: null,
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
    },
};



export const OCInfo = {
    write: {
        columnWidth: [220, 50, 50, 50, 45],
        column: [
            '담당자',
            '연락처',
            '팩스번호',
            '휴대폰번호',
            '이메일',
            '비고'
        ],
        columnList: [
            {data: "managerName", type: "text"},
            {data: "directTel", type: "text"},
            {data: "faxNumber", type: "text"},
            {data: "mobileNumber", type: "text"},
            {data: "email", type: "text"},
            {data: "remarks", type: "text"},
        ],
        defaultData: {
            "managerName": "",
            "directTel": "",
            "faxNumber": "",
            "mobileNumber": "",
            "email": "",
            "remarks": ""
        },
        excelExpert: (v, i) => {
            return v
        },
        totalList: {
            "managerName": "",
            "directTel": "",
            "faxNumber": "",
            "mobileNumber": "",
            "email": "",
            "remarks": ""
        },

        type: 'write'
    },
    defaultInfo: {
        "customerCode": "",
        "customerName": "",
        "tradeStartDate": "",
        "phoneNumber": "",
        "customerRegion": "",
        "homepage": "",
        "faxNumber": "",
        "currencyUnit": "",
        "manager": "",
        "ftaNumber": "",
        "customerType": "",
        "address": "",
        "mankuTradeManager": "",
        "remarks": "",
        "companyVerification": "",
    },
};




export const DCInfo = {
    write: {
        columnWidth: [220, 50, 50, 50, 45],
        column: [
            '담당자',
            '연락처',
            '팩스번호',
            '휴대폰번호',
            '이메일',
            '비고'
        ],
        columnList: [
            {data: "managerName", type: "text"},
            {data: "directTel", type: "text"},
            {data: "faxNumber", type: "text"},
            {data: "mobileNumber", type: "text"},
            {data: "email", type: "text"},
            {data: "remarks", type: "text"},
        ],
        defaultData: {
            "managerName": "",
            "directTel": "",
            "faxNumber": "",
            "mobileNumber": "",
            "email": "",
            "remarks": ""
        },
        excelExpert: (v, i) => {
            return v
        },
        totalList: {
            "managerName": "",
            "directTel": "",
            "faxNumber": "",
            "mobileNumber": "",
            "email": "",
            "remarks": ""
        },

        type: 'write'
    },
    defaultInfo: {
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
    },
};




export const OAInfo = {
    write: {
        columnWidth: [220, 50, 50, 50, 45, 50, 50, 50],
        column: [
            "담당자",
            "연락처",
            "팩스번호",
            "이메일",
            "주소",
            "국가대리점",
            "휴대폰",
            "비고"
        ],
        columnList: [
            {data: "managerName", type: "text"},
            {data: "phoneNumber", type: "text"},
            {data: "faxNumber", type: "text"},
            {data: "email", type: "text"},
            {data: "address", type: "text"},
            {data: "countryAgency", type: "text"},
            {data: "mobilePhone", type: "text"},
            {data: "remarks", type: "text"}
        ],
        defaultData: {
            "managerName": "string",
            "phoneNumber": "string",
            "faxNumber": "string",
            "email": "string",
            "address": "string",
            "remarks": "string",
            "countryAgency": "string",
            "mobilePhone": "string",
        },
        excelExpert: (v, i) => {
            return v
        },
        totalList: {},

        type: 'write'
    },
    defaultInfo: {
        "agencyCode": "",                      // 코드(약칭)
        "agencyName": "",       // 상호
        "dealerType": "",               // 딜러/제조
        "grade": "",                             // 등급
        "margin": null,                           // 마진
        "homepage": "",   // 홈페이지
        "item": "",                        // Item
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
    },
};




export const DAInfo = {
    write: {
        columnWidth: [220, 50, 50, 50, 45, 50, 50, 50],
        column: [
            "담당자",
            "연락처",
            "팩스번호",
            "이메일",
            "주소",
            "국가대리점",
            "휴대폰",
            "비고"
        ],
        columnList: [
            {data: "managerName", type: "text"},
            {data: "phoneNumber", type: "text"},
            {data: "faxNumber", type: "text"},
            {data: "email", type: "text"},
            {data: "address", type: "text"},
            {data: "countryAgency", type: "text"},
            {data: "mobilePhone", type: "text"},
            {data: "remarks", type: "text"}
        ],
        defaultData: {
            "managerName": "",
            "phoneNumber": "",
            "faxNumber": "",
            "email": "",
            "address": "",
            "remarks": "",
            "countryAgency": "",
            "mobilePhone": "",
        },
        excelExpert: (v, i) => {
            return v
        },
        totalList: {},

        type: 'write'
    },
    defaultInfo: {
        "agencyCode": "",                      // 코드(약칭)
        "agencyName": "",       // 상호
        "dealerType": "",               // 딜러/제조
        "grade": "",                             // 등급
        "margin": null,                           // 마진
        "homepage": "",   // 홈페이지
        "item": "",                        // Item
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
    },
};

