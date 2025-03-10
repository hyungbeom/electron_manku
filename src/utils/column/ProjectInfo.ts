import moment from "moment";

export const projectInfo = {
    write: {
        columnWidth: [160, 220, 220, 200, 55, 65, 45, 120, 120, 120, 120, 70, 45, 160, 130, 130, 180, 160, 120, 180],
        column: ['연결 Inquiry No.', 'Model', 'Maker', 'Item', '마진율', '단위', '수량', '매출 단가', '매출 총액', '매입 단가', '매입 총액', '화폐단위', '납기', '매입처명', '매입처 당담자명', '매입처 연락처', '매입처 이메일', '관련링크', '납품기한', '비고'],
        columnList: [
            {data: "connectInquiryNo", type: "text"},
            {data: "model", type: "text"},
            {data: "maker", type: "text"},
            {data: "item", type: "text"},
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
            "marginRate": "",
            "unit": "",
            "quantity": '',
            "unitPrice": '',
            "total": "",
            "purchasePrice": '',
            "totalPurchase": "",
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
        excelExpert: (v, i) => {
            v['total'] = `=G${i + 1}*H${i + 1}`
            v['totalPurchase'] = `=G${i + 1}*J${i + 1}`
            return v
        },
        totalList: {
            connectInquiryNo: '',
            model: '',
            maker: '',
            item: '',
            marginRate: '',
            unit: '',
            quantity: '=SUM(G1:G100)',
            unitPrice: '=SUM(H1:H100)',
            total: '=SUM(I1:I100)',
            purchasePrice: '=SUM(J1:J100)',
            totalPurchase: '=SUM(K1:K100)',
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
        column: ['Model', '수량', '단위', 'CURR', '매입 단가', '매입 총액', '납기', '회신여부', '회신일', '비고'],
        columnList: [
            {data: "model", type: "text"},
            {data: "quantity", type: "numeric"},
            {
                data: "unit",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "currency", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "net", type: "numeric"},
            {data: "totalNet", type: "numeric", readOnly: true},
            {data: "deliveryDate", type: "numeric"},
            {
                data: "content",
                type: "autocomplete",
                source: ['미회신', '회신', '정보부족', '한국대리점', 'MOQ', 'OEM', '단종', '견적포기', '입찰마감', '견적불가', '기타']
            },
            {data: "replyDate", type: "date"},
            {data: "remarks", type: "numeric"},

        ],
        defaultData: {
            "model": '',             // Model
            "quantity": '',           // 수량
            "unit": "",            // 단위
            "currency": "",       // CURR
            "net": '',                // 매입단가
            "totalNet": '',                // 매입단가
            "serialNumber": '',       // 항목 순서 (1부터 시작)
            "deliveryDate": '',      // 납기
            "content": "",       // 내용
            "replyDate": '',         // 회신일
            "remarks": ""            // 비고
        },
        excelExpert: (v, i) => {
            v['totalNet'] = `=B${i + 1}*E${i + 1}`
            return v
        },
        totalList: {
            "model": '',             // Model
            "quantity": '=SUM(B1:B100)',           // 수량
            "unit": "ea",            // 단위
            "currency": "",       // CURR
            "net": '=SUM(E1:E100)',                // 매입단가
            "totalNet": '=SUM(F1:F100)',                // 매입단가
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
        column: ['Model', '수량', '단위', 'CURR', '매출 단가', '매출 총액', '매입 단가', '매입 총액', '마진율'],
        columnList: [
            {data: "model", type: "text"},
            {data: "quantity", type: "numeric"},
            {
                data: "unit",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "currency", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "unitPrice", type: "numeric"},
            {data: "total", type: "numeric", readOnly: true},
            {data: "net", type: "numeric"},
            {data: "totalNet", type: "numeric", readOnly: true},
            {data: "marginRate", type: "text"},

        ],
        defaultData: {
            "model": "",   // Model
            "quantity": '',                  // 수량
            "unit": "",                   // 단위
            "currency": '',          // CURR
            "net": '',                 // 매입단가
            "unitPrice": '',           // 단가
        },
        excelExpert: (v, i) => {
            v['total'] = `=B${i + 1}*E${i + 1}`
            v['totalNet'] = `=B${i + 1}*G${i + 1}`
            return v
        },
        totalList: {
            "model": "",   // Model
            "quantity": '=SUM(B1:B100)',                  // 수량
            "unit": "",                   // 단위
            "currency": '',          // CURR
            "unitPrice": '=SUM(E1:E100)',           // 단가
            "total": '=SUM(F1:F100)',           // 단가
            "net": '=SUM(G1:G100)',                 // 매입단가
            "totalNet": '=SUM(H1:H100)',                 // 매입단가
            "marginRate": ''                 // 매입단가

        }
        ,
        // totalList: {
        //     "model": '',             // Model
        //     "quantity": '=SUM(B1:B100)',           // 수량
        //     "unit": "ea",            // 단위
        //     "currency": "",       // CURR
        //     "net": '=SUM(E1:E100)',                // 매입단가
        //     "totalNet": '=SUM(F1:F100)',                // 매입단가
        //     "serialNumber": '',       // 항목 순서 (1부터 시작)
        //     "deliveryDate": '',      // 납기
        //     "content": "",       // 내용
        //     "replyDate": '',         // 회신일
        //     "remarks": ""            // 비고
        // },
        type: 'write'
    },
    defaultInfo: {
        createdBy: '',
        managerAdminName: '',
        managerAdminId: null,
        "writtenDate": moment().format('YYYY-MM-DD'),    // 작성일
        "documentNumberFull": "", // Inquiry No.
        "agencyCode": "",            // 대리점코드
        "agencyManagerName": "",
        "agencyManagerEmail": "",
        "agencyManagerPhoneNumber": "",
        "customerCode": "",             // CUSTOMER 코드
        "customerName": "",    // 상호명
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
        "remarks": "",          // 비고란
        "currencyUnit": "",          // 비고란
        'count': 0,
        uploadType: 3
    },
};




export const orderInfo = {
    write: {
        columnWidth: [220,50, 50, 50,45, 50, 120, 120, 120,120,80],
        column: ['Model',
            '주문',
            '입고',
            '미 입고',
            '단위',
            'CURR',
            '매입 단가',
            '매입 총액',
            '매출 단가',
            '매출 총액',
            'HS-CODE'],
        columnList: [
            {data: "model", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "quantity", type: "numeric"},
            {data: "receivedQuantity", type: "text"},
            {data: "unreceivedQuantity", type: "text"},
            {data: "unit", type: "text"},
            {data: "currency", type: "numeric"},
            {data: "net", type: "numeric"},
            {data: "total", type: "numeric"},
            {data: "unitPrice", type: "text"},
            {data: "totalNet", type: "numeric"},
            {data: "hscode", type: "text"},

        ],
        defaultData:  {
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
            "hscode": '',
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
    defaultInfo:  {
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
        "customerId": 0,          // 고객사명
        "estimateManager": "",            // 견적서담당자
        "managerID": "",                 // Responsibility
        "managerPhoneNumber": "",  // Tel
        "managerFaxNumber": "",      // E-Mail
        "managerEmail": "",   // Fax
        "paymentTerms": 'By in advance T/T',    // Payment Terms
        "deliveryTerms": "",              // 납기 Terms
        "maker": "",                    // Maker
        "item": "",                       // Item
        "delivery": '',               // 납기
        "remarks": "",                      // 비고란
        "currencyUnit": "",                      // 비고란
        uploadType: 4
    },
};
