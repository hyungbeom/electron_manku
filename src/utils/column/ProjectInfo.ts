export const projectInfo = {
    write: {
        column: ['연결 Inquiry No.', 'Model', 'Maker', 'Item', '마진율', '단위', '수량', '매출 단가', '매출 총액', '매입 단가', '매입 총액', '화폐단위', '납기', '매입처명', '매입처 당담자명', '매입처 연락처', '매입처 이메일', '관련링크', '납품기한', '비고'],
        columnList: [
            {data: "connectInquiryNo", type: "text"},
            {data: "model", type: "text"},
            {data: "maker", type: "text"},
            {data: "item", type: "text"},
            {data: "marginRate", type: "numeric"},
            {data: "unit", type: "autocomplete", source :['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz']},
            {data: "quantity", type: "text",},
            {data: "unitPrice", type: "text"},
            {data: "total", type: "text", readOnly: true,},
            {data: "purchasePrice", type: "text"},
            {data: "totalPurchase", type: "text", readOnly: true},
            {data: "currencyUnit", type: "autocomplete", source :['KRW','USD', 'EUR', 'JPY', 'GBP']},
            {data: "deliveryDate", type: "text"},
            {data: "agencyName", type: "text"},
            {data: "agencyManagerName", type: "text"},
            {data: "agencyManagerPhone", type: "text"},
            {data: "agencyManagerEmail", type: "text"},
            {data: "relatedLink", type: "text"},
            {data: "requestDeliveryDate", type: "date"},
            {data: "remarks", type: "text"}
        ]
    }
};