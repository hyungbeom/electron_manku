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
    }
};
