import moment from "moment";

export const projectInfo = {
    write: {
        columnWidth: [40, 120, 180, 180, 180, 180, 65, 70, 80, 120, 120],
        column: ['선택', '연결 Inquiry No.', '자재번호', 'Model', 'Item', 'Maker', '단위', '수량', '화폐단위', '납품기한', '비고'],
        columnList: [
            {data: "check", type: "checkbox"},
            {data: "connectInquiryNo", type: "text"},
            {data: "test", type: "text"},
            {data: "model", type: "text"},
            {data: "item", type: "text"},
            {data: "maker", type: "text"},
            {
                data: "unit",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "quantity", type: "numeric",},
            {data: "currencyUnit", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "requestDeliveryDate", type: "date"},
            {data: "remarks", type: "text"}
        ],
        defaultData: {
            "check": false,
            "connectInquiryNo": '',
            "test": '',
            "model": '',
            "item": '',
            "maker": '',
            "unit": 'ea',
            "quantity": '',
            "currencyUnit": 'KRW',
            "requestDeliveryDate": '',
            "remarks": ''
        },
        mapping: {
            "check": "선택",
            "connectInquiryNo": "연결 Inquiry No.",
            "test": "자재번호",
            "model": "Model",
            "item": "Item",
            "maker": "Maker",
            "unit": "단위",
            "quantity": "수량",
            "currencyUnit": "화폐단위",
            "requestDeliveryDate": "납품기한",
            "remarks": "비고"
        },
        excelExpert: (v, i) => {
            // v['total'] = `= (H${i + 1} * J${i + 1}) + M${i + 1}`
            // v['totalPurchase'] = `=H${i + 1}*I${i + 1}`
            // v['unitPrice'] = `= (L${i + 1} / H${i + 1})`
            v['total'] = (v['H'] && v['J'] && v['M']) ? `=(H${i + 1} * J${i + 1}) + M${i + 1}` : null;
            v['totalPurchase'] = (v['H'] && v['I']) ? `=H${i + 1}*I${i + 1}` : null;
            v['unitPrice'] = (v['L'] && v['H']) ? `=(L${i + 1} / H${i + 1})` : null;
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
            quantity: '=SUM(H1:H1000)',
            net: '=SUM(I1:I1000)',
            totalPurchase: '=SUM(J1:J1000)',
            unitPrice: '=SUM(K1:K1000)',
            total: '=SUM(L1:L1000)',
            deliveryPrice: '=SUM(M1:M1000)',
        },
        type: 'write',
        validate: {
            documentNumberFull: true,
            projectTitle: true
        },
        validationList: [
            {key: 'documentNumberFull', message: 'Project No. 가 누락되었습니다.'},
            {key: 'projectTitle', message: '프로젝트 제목이 누락되었습니다.'},
        ]
    },
    defaultInfo: {
        managerAdminId: null,
        managerAdminName: '',
        createdBy: '',
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
        uploadType: 7,
        folderId: '',
        projectDetailList: []
    },
};


export const rfqInfo = {
    write: {
        columnWidth: [220, 45, 45, 55, 120, 120, 45, 75, 120, 150],
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
            {data: "unitPrice", type: "numeric", pattern: {pattern: 0.00}},
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
            "message": '',         // 회신일
            "receiverId": '',         // 회신일
            "remarks": "",     // 비고
            "estimateRequestDetailId": ""            // 비고
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
            let bowl = {}
            Object.keys(v).forEach(src => {
                bowl[src] = (!v[src] || v[src] === 'null') ? '' : v[src]
            });

            bowl['total'] = `=B${i + 1}*E${i + 1}`
            return bowl
        },
        totalList: {
            "model": '',             // Model
            "quantity": '=SUM(B1:B1000)',           // 수량
            "unit": "",            // 단위
            "currency": "",       // CURR
            "unitPrice": '=SUM(E1:E1000)',                // 매입단가
            "total": '=SUM(F1:F1000)',                // 매입단가
            "serialNumber": '',       // 항목 순서 (1부터 시작)
            "deliveryDate": '',      // 납기
            "content": "",       // 내용
            "replyDate": '',         // 회신일
            "remarks": ""            // 비고
        },
        type: 'write',
        validate: {
            managerAdminId: true,
            agencyCode: true
        },
        validationList: [
            {key: 'managerAdminId', message: '담당자가 누락되었습니다.'},
            {key: 'agencyCode', message: '매입처 코드가 누락되었습니다.'},
        ]
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

        remarks: '',
        endUser: '',

        uploadType: 0,
        folderId: ''
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
            "estimateDetailId": "",            // 비고
            "receiverId": "",            // 비고
            "message": ""            // 비고
        }, mapping: {
            "model": "Model",   // Model
            "quantity": '수량',                  // 수량
            "net": '매출 단가',                  // 단가
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
            "quantity": '=SUM(B1:B1000)',                  // 수량
            "unit": "",                   // 단위
            "currencyUnit": '',          // CURR
            "net": '=SUM(E1:E1000)',                 // 매입단가
            "totalNet": '=SUM(F1:F1000)',                 // 매입단가
            "unitPrice": '=SUM(G1:G1000)',           // 단가
            "total": '=SUM(H1:H1000)',           // 단가
            "marginRate": ''                 // 매입단가
        },
        type: 'write',
        validate: {
            managerAdminId: true,
            documentNumberFull: true,
            agencyCode: true
        },
        validationList: [
            {key: 'managerAdminId', message: '담당자가 누락되었습니다.'},
            {key: 'documentNumberFull', message: 'Inquiry No. 가 누락되었습니다.'},
            {key: 'agencyCode', message: '매입처 코드가 누락되었습니다.'},
        ]
    },
    defaultInfo: {
        createdBy: '',
        agencyTel: '',
        managerAdminName: '',
        managerAdminId: null,
        "writtenDate": moment().format('YYYY-MM-DD'),    // 작성일
        "connectDocumentNumberFull": "", // Inquiry No.
        "documentNumberFull": "", // Inquiry No.
        "rfqNo": "", // Inquiry No.
        "projectTitle": "", // Inquiry No.
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
        "delivery": "",    // 납기
        "instructions": "",          // 지시사항
        "remarks": "",          // 비고란
        "currencyUnit": "",          // 비고란
        'count': 0,
        attnTo: '',
        uploadType: 3,
        folderId: ''
    },
};


export const orderInfo = {
    write: {
        columnWidth: [220, 50, 50, 50, 120, 120, 120, 120, 50, 50, 50, 80],
        column: [
            'Model',
            '수량',
            '단위',
            '화폐단위',
            '매입 단가',
            '매입 총액',
            '매출 단가',
            '매출 총액',
            '주문',
            '입고',
            '미 입고',
            'HS-CODE'],
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
            {data: "total", type: "numeric"},
            {data: "net", type: "numeric"},
            {data: "totalNet", type: "numeric"},
            {data: "order", type: "numeric"},
            {data: "receivedQuantity", type: "numeric"},
            {data: "unreceivedQuantity", type: "numeric", readOnly: true},
            {data: "hsCode", type: "text"},
        ],
        defaultData: {
            "model": "",           // Model
            "quantity": '',              // 수량
            "unit": '',               // 단위
            "currency": '',
            "unitPrice": '',
            "total": '',            // 매입단가
            "net": '',            // 매입단가
            "totalNet": '',
            "order": '',
            "receivedQuantity": '',
            "unreceivedQuantity": '',
            "hsCode": '',
            "managerId": '',
            "rfqNo": '',
            "sendTerms": '',
            "deliveryTerms": '',
            managerAdminName: '',
            orderDetailId: '',
            estimateDetailId: '',
            customerManagerName: '',
            customerManagerEmail: '',
            customerManagerFaxNumber: ''
        }, mapping: {
            "model": "Model",           // Model
            "quantity": '주문',              // 수량
            "receivedQuantity": '입고',
            "unreceivedQuantity": '미 입고',
            "unit": '단위',               // 단위
            "currency": '화폐단위',
            "unitPrice": '매입 단가',
            "total": '매입 총액',            // 매입단가
            "net": '매출 단가',            // 매입단가
            "totalNet": '매출 총액',
            "hscode": 'HS-CODE',
        },
        excelExpert: (v, i) => {
            v['unreceivedQuantity'] = `=B${i + 1} -J${i + 1}`
            v['total'] = `=B${i + 1}*E${i + 1}`
            v['totalNet'] = `=B${i + 1}*G${i + 1}`
            return v
        },
        totalList: {
            "model": "",           // Model
            "quantity": '=SUM(B1:B1000)',              // 수량
            "unit": '',               // 단위
            "currency": '',
            "unitPrice": '=SUM(E1:E1000)',
            "total": '=SUM(F1:F1000)',            // 매입단가
            "net": '=SUM(G1:G1000)',            // 매입단가
            "totalNet": '=SUM(H1:H1000)',            // 매입단가
            "order": '=SUM(I1:I1000)',            // 매입단가
            "receivedQuantity": '=SUM(J1:J1000)',
            "unreceivedQuantity": '=SUM(K1:K1000)',
            "hscode": '',
        },
        type: 'write',
        validate: {
            managerAdminId: true,
            documentNumberFull: true,
            agencyCode: true
        },
        validationList: [
            {key: 'managerAdminId', message: '담당자가 누락되었습니다.'},
            {key: 'documentNumberFull', message: 'Inquiry No. 가 누락되었습니다.'},
            {key: 'agencyCode', message: '매입처 코드가 누락되었습니다.'},
        ]
    },
    defaultInfo: {
        attnTo: '',
        createdBy: '',
        managerAdminName: '',
        managerAdminId: null,
        customerManagerName: '',
        customerManagerPhoneNumber: '',
        customerManagerEmail: '',
        customerManagerFaxNumber: '',
        "ourPoNo": "",    //  PO No
        "documentNumberFull": "",    // Our PO No
        "writtenDate": moment().format('YYYY-MM-DD'),
        "yourPoNo": "",                // Your PO No
        "agencyCode": "",  // Messrs
        "agencyName": "",  // Messrs
        "customerName": "",          // 고객사명
        "managerName": "",          // 고객사명
        agencyManagerName: '',
        "customerId": '',          // 고객사명
        "estimateManager": "",            // 견적서담당자
        "managerId": "",                 // Responsibility
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
        "projectTitle": "",                      // 비고란
        uploadType: 4,
        folderId: ''
    },
};


export const storeInfo = {
    write: {
        columnWidth: [50, 50, 50, 50, 45, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
        column: [
            "Inquiry No.",
            "매입처명",
            "고객사명",
            "결제조건",
            "환율",
            "발주일자",
            "송금일자",
            "부분입고여부",
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
            "세부항목 번호"
        ],
        columnList: [
            {data: "documentNumberFull", type: "text"},      // 문서번호
            {data: "agencyName", type: "text"},              // 매입처
            {data: "customerName", type: "text"},            // 고객사
            {data: "paymentTerms", type: "text"},            // 결제조건
            {data: "exchange", type: "numeric", numericFormat: {pattern: '0.0000'}}, // 환율
            {data: "writtenDate", type: "date", dateFormat: 'YYYY-MM-DD', correctFormat: true}, // 발주일자
            {data: "requestStartDate", type: "date", dateFormat: 'YYYY-MM-DD', correctFormat: true}, // 송금일자
            {data: "PartialInbound", type: "text"},          // 부분입고
            {data: "amount", type: "numeric", numericFormat: {pattern: '0,0.00'}},    // 금액
            {data: "currency", type: "text"},                // 화폐단위
            {data: "krw", type: "numeric", numericFormat: {pattern: '0,0.00'}},       // 원화환산금액
            {data: "krwVat", type: "numeric", numericFormat: {pattern: '0,0.00'}},    // 원화환산금액(vat)
            {data: "inboundDate", type: "date", dateFormat: 'YYYY-MM-DD', correctFormat: true}, // 입고일자
            {data: "outboundDate", type: "date", dateFormat: 'YYYY-MM-DD', correctFormat: true}, // 출고일자
            {data: "invoiceDate", type: "date", dateFormat: 'YYYY-MM-DD', correctFormat: true},  // 계산서 발행일자
            {data: "paymentStatus", type: "text"},           // 결제여부
            {data: "paymentMethod", type: "text"},           // 선수금
            {data: "orderDetailId", type: "numeric"}         // 세부항목 번호
        ],
        defaultData: {
            "documentNumberFull": "",       //문서번호
            "agencyName": "",            //매입처
            "customerName": "",          //고객사
            "paymentTerms": "",        //결제조건
            "exchange": "",         //환율
            "writtenDate": "",       //발주일자
            "requestStartDate": "",   //송금일자
            "PartialInbound": "",   //부분입고
            "amount": "",      //금액
            "currency": "",   //화폐단위
            "krw": "",    //원화환산금액
            "tax": "",    // 수수료
            "saleAmount": "",    // 판매금액
            "saleVatAmount": "",    // 판매금액(vat)
            "inboundDate": "",  // 입고일자
            "outboundDate": "",  // 출고일자
            "invoiceDate": "",  //계산서 발행일자
            "paymentStatus": "",  //결제여부
            "paymentMethod": "",  //선수금
            "orderDetailId": "",  //세부항목 번호
        },
        excelExpert: (v, i) => {
            // v['amount'] = `=H${i + 1} -C${i + 1}`
            // v['total'] = `=B${i + 1}*G${i + 1}`
            // v['totalNet'] = `=B${i + 1}*I${i + 1}`
            return v
        },
        totalList: {
            // "model": "",           // Model
            // "quantity": '=SUM(B1:B1000)',              // 수량
            // "receivedQuantity": '=SUM(C1:C1000)',
            // "unreceivedQuantity": '=SUM(D1:D1000)',
            // "unit": '',               // 단위
            // "currency": '',
            // "net": '=SUM(G1:G1000)',            // 매입단가
            // "total": '=SUM(H1:H1000)',            // 매입단가
            // "unitPrice": '=SUM(I1:I1000)',
            // "totalNet": '=SUM(J1:J1000)',            // 매입단가
        },

        type: 'write'
    },
    defaultInfo: {
        createdDate: moment().format('YYYY-MM-DD'),
        createdBy: '',
        managerAdminName: '',
        managerAdminId: null,
        inboundDate: moment().format('YYYY-MM-DD'),  //입고일자
        carrierName: "",        // 운수사명
        blNo: "",              // BL No.
        arrivalDate: moment().format('YYYY-MM-DD'),    // 도착일
        vatAmount: 0,              // 부가세
        tariff: 0,          // 관세
        shippingFee: 0,            // 운임비
        transport: '항공',            //운송수단
        inboundStatus: '진행중',    //매입상태
        remarks: '',          //비고
        etcPrice: 0, // 기타비용
        totalKrw: 0,
        totalTax: 0,
        deleteList: [],


        total: null,   // 합계
        totalVat: null,  //합계(vat 포함)
        saleTotal: null,   // 판매금액 합계
        saleVatTotal: null,  // 판매금액 합계(vat 포함)
        operationIncome: null,
    },
};


// =================================================================================================================
/**
 * 배송 등록/수정
 */
export const deliveryInfo = {
    write: {
        type: 'write'
    },
    defaultInfo: {
        createdId: null,
        createdBy: null,
        managerAdminName: null,
        managerAdminId: null,
        deliveryId: '',            // 배송 ID (기본키, 자동 증가)
        deliveryType: '',          // 배송 유형 (예: QUICK, DAESIN, CJ)
        deliveryDate: moment().format('YYYY-MM-DD'),          // 배송 예정일
        connectInquiryNo: '',      // 발주서 no 여러개
        orderDetailIds: '',        // 발주서 항목번호 여러개 (orderDetailId)
        customerName: '',          // 고객 이름
        recipientName: '',         // 수령자 이름
        recipientPhone: '',        // 수령자 전화번호
        recipientAltPhone: '',     // 수령자 보조 전화번호
        recipientPostalCode: '',   // 수령자 우편번호
        recipientAddress: '',      // 수령자 주소
        destination: '',           // 배송지
        customerOrderNo: '',       // 고객 주문 번호
        trackingNumber: '',        // 운송장 번호
        productName: '부품',        // 상품명
        quantity: '',              // 수량
        packagingType: 'B',        // 포장 유형 (예: B or P)
        shippingType: '화물',          // 배송 방식 (예: 택배, 화물)
        paymentMethod: '착불',         // 결제 수단
        classification: '',        // 상품 분류
        isConfirm: 'X',            // 배송 확인 여부 (예: O, X)
        isOutBound: 'X',           // 출고 완료 여부 (예: O, X)
        rfqNo: '',           // 출고 완료 여부 (예: O, X)
    },
};
//


// =================================================================================================================
/**
 * 국내 송금 등록/수정
 */
export const DRInfo = {
    write: {
        columnWidth: [80, 80, 100, 100, 100, 100, 100],
        column: ['송금 지정 일자', '송금 요청 일자', '공급가액', '부가세', '합계', '송금 상태', '계산서 발행 여부'],
        columnList: [
            {data: "remittanceDueDate", type: "date"},
            {data: "remittanceRequestDate", type: "date"},
            {data: "supplyAmount", type: "numeric"},
            {data: "tax", type: "numeric", readOnly: true},
            {data: "total", type: "numeric", readOnly: true},
            {
                data: "sendStatus",
                type: "autocomplete",
                source: ['요청', '부분완료', '완료', '취소', '반려']
            },
            {
                data: "invoiceStatus",
                type: "autocomplete",
                source: ['X', 'O']
            },
        ],
        defaultData: {
            "remittanceDetailId": '',
            "remittanceDueDate": "",       // 송금 지정 일자
            "remittanceRequestDate": '',   // 송금 요청 일자
            "supplyAmount": '',            // 공급가액
            "tax": "",                     // 부가세
            "total": "",                   // 합계
            "sendStatus": '',              // 송금 상태
            "sendStatusCount": 0,              // 송금 상태
            "invoiceStatus": '',           // 계산서 발행 여부
            "rfqNo": '',           // 계산서 발행 여부
        }, mapping: {
            "remittanceDueDate": '송금 지정 일자',
            "remittanceRequestDate": '송금 요청 일자',
            "supplyAmount": '공급가액',
            "tax": "부가세",
            "total": '합계',
            "sendStatus": '송금 상태',
            "invoiceStatus": '계산서 발행 여부',
        },
        excelExpert: (v, i) => {
            v['tax'] = `=C${i + 1}*0.1*10/10`
            v['total'] = `=C${i + 1}+D${i + 1}`
            return v
        },
        totalList: {
            "remittanceRequestDate": '',
            "remittanceDueDate": '',
            "supplyAmount": '=SUM(C1:C100)',
            "tax": '=SUM(D1:D100)',
            "total": '=SUM(E1:E100)',
            "sendStatus": '',
            "invoiceStatus": ''
        },
        type: 'write'
    },
    defaultInfo: {
        writtenDate: moment().format('YYYY-MM-DD'),   // 작성일
        createdId: null,                              // 작성자 id
        createdBy: null,                              // 작성자 이름
        managerAdminId: null,                         // 담당자 id
        managerAdminName: null,                       // 담당자 이름
        remittanceId: '',                             // 송금 pk
        bankAccountNumber: '',                             // 고객사
        customerName: '',                             // 고객사
        sendStatusCount: 0,              // 송금 상태
        agencyName: '',                               // 매입처
        connectInquiryNo: '',                         // 발주서 no 여러개
        orderDetailIds: '',                           // 발주서 항목번호 여러개 (orderDetailId)
        totalAmount: '',                              // 총액
        partialRemittance: '',                        // 부분송금액
        balance: '',                                  // 합계
        partialRemittanceStatus: '',                  // 부분 송금 진행 여부
        remarks: '',                                  // 비고
    },
};

/**
 * 해외 송금 등록/수정
 */
export const ORInfo = {
    write: {
        columnWidth: [80, 80, 100, 100, 100, 100, 100, 100],
        column: ['송금 지정 일자', '송금 요청 일자', '공급가액', '수수료', '합계', '송금 상태', '증빙서류 여부', '환율'],
        columnList: [
            {data: "remittanceDueDate", type: "date"},
            {data: "remittanceRequestDate", type: "date"},
            {data: "supplyAmount", type: "numeric"},
            {data: "fee", type: "numeric"},
            {data: "total", type: "numeric", readOnly: true},
            {
                data: "sendStatus",
                type: "autocomplete",
                source: ['요청', '부분완료', '완료', '취소', '반려']
            },
            {
                data: "invoiceStatus",
                type: "autocomplete",
                source: ['X', 'O']
            },
            {data: "exchange", type: "numeric"}
        ],
        defaultData: {
            "remittanceDetailId": '',
            "remittanceDueDate": "",       // 송금 지정 일자
            "remittanceRequestDate": '',   // 송금 요청 일자
            "supplyAmount": '',            // 공급가액
            "fee": '',                     // 수수료
            "total": "",                   // 합계
            "sendStatus": '',              // 송금 상태
            "invoiceStatus": '',           // 증빙서류 여부
            "exchange": '',                // 환율
            "rfqNo": '',                // 환율
        }, mapping: {
            "remittanceDueDate": '송금 지정 일자',
            "remittanceRequestDate": '송금 요청 일자',
            "supplyAmount": '공급가액',
            "fee": '수수료',
            "total": '합계',
            "sendStatus": '송금 상태',
            "invoiceStatus": '증빙서류 여부',
            "exchange": '환율',
        },
        excelExpert: (v, i) => {
            v['total'] = `=C${i + 1}+D${i + 1}`
            return v
        },
        totalList: {
            "remittanceDueDate": '',
            "remittanceRequestDate": '',
            "supplyAmount": '=SUM(C1:C100)',
            "commissionFee": '=SUM(D1:D100)',
            "total": '=SUM(E1:E100)',
            "sendStatus": '',
            "invoiceStatus": '',
            "exchange": '',
        },
        type: 'write'
    },
    defaultInfo: {
        region: 'foreign',                            // 해외송금 여부
        writtenDate: moment().format('YYYY-MM-DD'),   // 작성일
        createdId: null,                              // 작성자 id
        createdBy: null,                              // 작성자 이름
        managerAdminId: null,                         // 담당자 id
        managerAdminName: null,                       // 담당자 이름
        remittanceId: '',                             // 송금 pk
        customerName: '',                             // 고객사
        agencyName: '',                               // 매입처
        connectInquiryNo: '',                         // 발주서 no 여러개
        orderDetailIds: '',                           // 발주서 항목번호 여러개 (orderDetailId)
        totalAmount: '',                              // 총액
        partialRemittance: '',                        // 부분송금액
        balance: '',                                  // 합계
        partialRemittanceStatus: '',                  // 부분 송금 진행 여부
        remarks: '',                                  // 비고
    },
};
//

/**
 * 세금계산서 발행 등록/수정
 */
export const TIInfo = {
    write: {
        type: 'write'
    },
    defaultInfo: {
        writtenDate: moment().format('YYYY-MM-DD'),          // 작성일
        createdId: null,                                     // 작성자 id
        createdBy: null,                                     // 작성자 이름
        managerAdminId: null,                                // 담당자 id
        managerAdminName: null,                              // 담당자 이름
        invoiceId: '',                                       // 해외송금 여부
        invoiceDueDate: moment().format('YYYY-MM-DD'),                                  // 발행지정일자
        invoiceRequestDate: moment().format('YYYY-MM-DD'),   // 발행요청일자
        rfqNo: '',                                           // 프로젝트 No.
        deleteList: [],                                           // 프로젝트 No.
        yourPoNo: '',                                        // 고객사 발주서 No.
        customerName: '',                                    // 고객사명
        sendEmail: '',                                       // 발행 이메일 주소
        customerManagerName: '',                             // 고객사 담당자명
        supplyAmount: '',                                    // 공급가액
        company: '',                                         // 사업소
        invoiceStatus: 'X',                                  // 계산서 발행 여부
        remarks: '',                                         // 비고
    },
};
//


// ===================================================== 데이터 관리 =====================================================

/**
 * 국내 매입처 등록/수정
 */
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
            "countryAgency": "",
            "mobilePhone": "",
            "remarks": ""
        },
        mapping: {
            "managerName": "담당자",
            "phoneNumber": '연락처',
            "faxNumber": '팩스번호',
            "email": '이메일',
            "address": "주소",
            "countryAgency": '국가대리점',
            "mobilePhone": '휴대폰',
            "remarks": '비고'
        },
        excelExpert: (v, i) => {
            return v
        },
        totalList: {},
        type: 'write',
        validate: {
            agencyCode: true,
            agencyName: true
        },
        validationList: [
            {key: 'agencyCode', message: '코드(약칭)을 입력해주세요.'},
            {key: 'agencyName', message: '상호를 입력해주세요.'},
        ]
    },
    defaultInfo: {
        "agencyCode": "",                  // 코드(약칭)
        "agencyName": "",                  // 상호
        "businessRegistrationNumber": "",  // 사업자 번호
        "bankAccountNumber": "",           // 계좌번호
        "maker": "",                       // Maker
        "item": "",                        // 아이템
        "homepage": "",                    // 홈페이지
        "tradeStartDate": "",              // 거래시작일
        "dealerType": "딜러",               // "딜러", "제조"
        "grade": "A",                      // 등급
        "margin": 0,                       // 마진
        "instructions": "",                // 지시사항
        "agencyManagerList": [],           // 담당자 리스트
        "folderId": "",
        "uploadType": 9
    }
};

/**
 * 해외 매입처 등록/수정
 */
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
            "managerName": "",
            "phoneNumber": "",
            "faxNumber": "",
            "email": "",
            "address": "",
            "remarks": "",
            "countryAgency": "",
            "mobilePhone": "",
        },
        mapping: {
            "managerName": "담당자",
            "phoneNumber": '연락처',
            "faxNumber": '팩스번호',
            "email": '이메일',
            "address": "주소",
            "countryAgency": '국가대리점',
            "mobilePhone": '휴대폰',
            "remarks": '비고'
        },
        excelExpert: (v, i) => {
            return v
        },
        totalList: {},
        type: 'write',
        validate: {
            agencyCode: true,
            agencyName: true
        },
        validationList: [
            {key: 'agencyCode', message: '코드(약칭)을 입력해주세요.'},
            {key: 'agencyName', message: '상호를 입력해주세요.'},
        ]
    },
    defaultInfo: {
        "agencyCode": "",                 // 코드(약칭)
        "agencyName": "",                 // 상호
        "dealerType": "딜러",              // 딜러/제조
        "grade": "A",                     // 등급
        "margin": 0,                      // 마진
        "homepage": "",                   // 홈페이지
        "item": "",                       // Item
        "tradeStartDate": "",             // 거래 시작일
        "currencyUnit": "",               // 화폐단위
        "manager": "",                    // 담당자
        "bankAccountNumber": "",          // Account No
        "country": "",                    // 국가
        "ftaNumber": "",                  // FTA No
        "intermediaryBank": "",           // 송금중개은행
        "address": "",                    // 주소
        "ibanCode": "",                   // IBan Code
        "swiftCode": "",                  // Swift Code
        "overseasAgencyManagerList": [],  // 담당자 리스트
        "folderId": "",
        "uploadType": 9
    },
};

/**
 * 국내 고객사 코드
 */
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
            v['amount'] = `=H${i + 1} -C${i + 1}`
            v['total'] = `=B${i + 1}*G${i + 1}`
            v['totalNet'] = `=B${i + 1}*I${i + 1}`
            return v
        },
        totalList: {
            "model": "",           // Model
            "quantity": '=SUM(B1:B1000)',              // 수량
            "receivedQuantity": '=SUM(C1:C1000)',
            "unreceivedQuantity": '=SUM(D1:D1000)',
            "unit": '',               // 단위
            "currency": '',
            "net": '=SUM(G1:G1000)',            // 매입단가
            "total": '=SUM(H1:H1000)',            // 매입단가
            "unitPrice": '=SUM(I1:I1000)',
            "totalNet": '=SUM(J1:J1000)',            // 매입단가
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

/**
 * 국내 고객사 등록/수정
 */
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
        mapping: {
            "managerName": "담당자",
            "directTel": '연락처',
            "faxNumber": '팩스번호',
            "mobileNumber": '휴대폰번호',
            "email": '이메일',
            "remarks": '비고'
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
        type: 'write',
        validate: {
            customerName: true
        },
        validationList: [
            {key: 'customerName', message: '상호를 입력해주세요.'},
        ]
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
        "freightCharge": "화물 선불",
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
        "customerManagerList": [],
        "folderId": '',
        "uploadType": 9
    },
};

/**
 * 해외 고객사 등록/수정
 */
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
        mapping: {
            "managerName": "담당자",
            "directTel": '연락처',
            "faxNumber": '팩스번호',
            "mobileNumber": '휴대폰번호',
            "email": '이메일',
            "remarks": '비고'
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
        type: 'write',
        validate: {
            customerName: true
        },
        validationList: [
            {key: 'customerName', message: '상호를 입력해주세요.'},
        ]
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
        "overseasCustomerManagerList": [],
        "folderId": "",
        "uploadType": 9
    },
};

/**
 * 메이커 등록/수정
 */
export const makerInfo = {
    write: {
        validate: {
            makerName: true,
            item: true
        },
        validationList: [
            {key: 'makerName', message: 'Maker를 입력해주세요.'},
            {key: 'item', message: 'Item을 입력해주세요.'},
        ]
    },
    defaultInfo: {
        "makerName": "",        // Maker
        "item": "",             // Item
        "homepage": "",         // 홈페이지
        "area": "",             // AREA
        "origin": "",           // 원산지
        "managerConfirm": "",   // 담당자확인
        "koreanAgency": "",     // 한국대리점
        "directConfirm": "",    // 직접확인
        "ftaNumber": "",        // FTA-No
        "instructions": ""      // 지시사항
    }
}

/**
 * 회사계정관리 등록/수정
 */
export const companyAccountInfo = {
    write: {
        validate: {
            companyName: true,
            userName: true,
            password: true
        },
        validationList: [
            {key: 'companyName', message: '회사 이름을 입력해주세요.'},
            {key: 'userName', message: '아이디를 입력해주세요.'},
            {key: 'password', message: '비밀번호를 입력해주세요.'}
        ]
    },
    defaultInfo: {
        "companyName": "",   // 회사이름
        "homepage": "",      // 홈페이지
        "userName": "",      // 계정 ID
        "password": "",      // 계정 비밀번호
        "remarks": ""        // 비고
    }
}

/**
 * 재고관리 등록/수정
 */
export const sourceInfo = {
    write: {
        validate: {
            maker: true,
            model: true,
            receivedQuantity: true,
            unit: true
        },
        validationList: [
            {key: 'maker', message: 'Maker를 입력해주세요.'},
            {key: 'model', message: 'Model을 입력해주세요.'},
            {key: 'receivedQuantity', message: '입고수량을 입력해주세요.'},
            {key: 'unit', message: '단위를 입력해주세요.'}
        ]
    },
    defaultInfo: {
        "inventoryId": '',                             // 재고
        "inventoryDetailId": '',                        // 재고 내역
        "receiptDate": moment().format('YYYY-MM-DD'),   // 입고 날짜
        "documentNumber": "",                           // 문서 번호
        "maker": "",                                    // Maker
        "model": "",                                    // Model
        "item": "",                                     // item
        "importUnitPrice": '',                          // 매입 단가
        "total": "",                                    // 매입 총액
        "currencyUnit": "",                             // 화폐 단위
        "receivedQuantity": "",                         // 입고 수량
        "unit": "",                                     // 단위
        "location": "",                                 // 위치
        "remarks": "",                                  // 비고
    }
}

/**
 * HS-CODE 등록/수정
 */
export const hsCodeInfo = {
    write: {
        validate: {
            item: true,
            hsCode: true
        },
        validationList: [
            {key: 'item', message: 'Item을 입력해주세요.'},
            {key: 'hsCode', message: 'HS-CODE를 입력해주세요.'},
        ]
    },
    defaultInfo: {
        item: "",   // item
        hsCode: ""  // hs-code
    }
}


export const TaxInfo = {
    write: {
        columnWidth: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
        column: ['작성일자', 'Inquiry No.', 'Project No.', '고객사명', 'Maker', 'Item', 'Model', '단위', '화폐', '매입 단가', '매입총액', '수량', '매출 단가', '매출 총액', '예상납기', '견적서담당자', '비고란'],
        columnList: [
            {data: "writtenDate", type: "date"},
            {data: "documentNumberFull", type: "text"},
            {data: "rfqNo", type: "text"},
            {data: "customerName", type: "text"},
            {data: "maker", type: "text"},
            {data: "item", type: "text"},
            {data: "model", type: "text"},
            {
                data: "unit",
                type: "autocomplete",
                source: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']
            },
            {data: "currency", type: "autocomplete", source: ['KRW', 'USD', 'EUR', 'JPY', 'GBP']},
            {data: "unitPrice", type: "numeric", pattern: {pattern: 0.00}},
            {data: "totalPrice", type: "numeric", pattern: {pattern: 0.00}},
            {data: "quantity", type: "numeric"},
            {data: "net", type: "numeric", pattern: {pattern: 0.00}},
            {data: "totalNet", type: "numeric", pattern: {pattern: 0.00}},
            {data: "delivery", type: "date"},
            {data: "estimateManager", type: "text"},
            {data: "remarks", type: "text"},


        ],
        defaultData: {
            writtenDate: "",
            documentNumberFull: "",
            rfqNo: "",
            customerName: "",
            maker: "",
            item: "",
            model: "",
            unit: "",
            currency: "",
            unitPrice: "",
            totalPrice: "",
            quantity: 0,
            net: "",
            totalNet: "",
            delivery: "",
            estimateManager: "",
            remarks: ""
        }, mapping: {
            // "remittanceDueDate": '송금 지정 일자',
            // "remittanceRequestDate": '송금 요청 일자',
            // "supplyAmount": '공급가액',
            // "tax": "부가세",
            // "total": '합계',
            // "sendStatus": '송금 상태',
            // "invoiceStatus": '계산서 발행 여부',
        },
        excelExpert: (v, i) => {
            v['totalPrice'] = `=L${i + 1}*J${i + 1}`
            v['totalNet'] = `=L${i + 1}*M${i + 1}`
            return v
        },
        totalList: {
            "quantity": '=SUM(L1:L100)',
            "unitPrice": '=SUM(J1:J100)',
            "totalPrice": '=SUM(K1:K100)',
            "totalNet": '=SUM(N1:N100)',
            "net": '=SUM(M1:M100)',
        },
        type: 'write'
    },
    defaultInfo: {
        writtenDate: moment().format('YYYY-MM-DD'),   // 작성일
        createdId: null,                              // 작성자 id
        createdBy: null,                              // 작성자 이름
        managerAdminId: null,                         // 담당자 id
        managerAdminName: null,                       // 담당자 이름
        remittanceId: '',                             // 송금 pk
        customerName: '',                             // 고객사
        agencyName: '',                               // 매입처
        connectInquiryNo: '',                         // 발주서 no 여러개
        orderDetailIds: '',                           // 발주서 항목번호 여러개 (orderDetailId)
        totalAmount: '',                              // 총액
        partialRemittance: '',                        // 부분송금액
        balance: '',                                  // 합계
        partialRemittanceStatus: '',                  // 부분 송금 진행 여부
        remarks: '',                                  // 비고
    },
};
