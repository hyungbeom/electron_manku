import moment from "moment/moment";

export const transformData = (data) => {
// 그룹화된 데이터 구조를 저장할 객체
    const groupedData = {};

    data.forEach((item) => {
        const { estimateRequestId, estimateId } = item;

        // 기존에 같은 agencyName이 있는지 확인
        if (!groupedData[estimateRequestId]) {
            // 같은 agencyName이 없으면 초기화
            groupedData[estimateRequestId] = {
                key: item.key,
                agencyName: item.agencyName,
                writtenDate: item.writtenDate,
                documentNumberFull: item.documentNumberFull,
                estimateRequestId: item.estimateRequestId,
                managerName: item.managerName,
                createdBy: item.createdBy,
                modifiedDate: item.modifiedDate,
                maker: item.maker,
                item: item.item,
                children: [],
            }
        } else if (!groupedData[estimateId]) {
                groupedData[estimateId] = {
                    estimateId: item.estimateId,
                    managerName: item.managerName,
                    documentNumberFull: item.documentNumberFull,
                    documentNumber: item.documentNumber,
                    writtenDate: item.writtenDate,
                    createdBy: item.createdBy,
                    modifiedDate: item.modifiedDate,
                    agencyCode: item.agencyCode,
                    customerCode: item.customerCode,
                    customerName: item.customerName,
                    phoneNumber: item.phoneNumber,
                    faxNumber: item.faxNumber,
                    validityPeriod: item.validityPeriod,
                    paymentTerms: item.paymentTerms,
                    shippingTerms: item.shippingTerms,
                    exchangeRate: item.exchangeRate,
                    email: item.email,
                    managerPhoneNumber: item.managerPhoneNumber,
                    managerFaxNumber: item.managerFaxNumber,
                    delivery: item.delivery,
                    remarks: item.remarks,
                    createdDate: item.createdDate,
                    modifiedBy: item.modifiedBy,
                    subNumber: item.subNumber,
                    estimateManager: item.estimateManager,
                    maker: item.maker,
                    item: item.item,
                    children: [],
                
            };
        }

        // const childrenData = item.estimateRequestDetailList.map((detail) => ({
        //     key: detail.estimateRequestDetailId,
        //     content: detail.content,
        //     estimateRequestId: detail.estimateRequestId,
        //     model: detail.model,
        //     quantity: detail.quantity,
        //     unit: detail.unit,
        //     currency: detail.currency,
        //     net: detail.net,
        //     sentStatus: detail.sentStatus,
        //     serialNumber: detail.serialNumber,
        //     replySummaryId: detail.replySummaryId,
        //     unitPrice: detail.unitPrice,
        //     currencyUnit: detail.currencyUnit,
        //     deliveryDate: detail.deliveryDate,
        //     replyDate: detail.replyDate,
        // }));

        let childrenData;

        if(item.estimateRequestDetailList){
        childrenData = item.estimateRequestDetailList.map((detail) => ({
            key: detail.estimateRequestDetailId,
            estimateRequestDetailId: detail.estimateRequestDetailId,
            content: detail.content,
            estimateRequestId: detail.estimateRequestId,
            model: detail.model,
            quantity: detail.quantity,
            unit: detail.unit,
            currency: detail.currency,
            net: detail.net,
            sentStatus: detail.sentStatus,
            serialNumber: detail.serialNumber,
            replySummaryId: detail.replySummaryId,
            unitPrice: detail.unitPrice,
            currencyUnit: detail.currencyUnit,
            deliveryDate: detail.deliveryDate,
            replyDate: detail.replyDate,
        }));
            // 같은 agencyName에 하위 데이터를 children으로 추가
            // groupedData[agencyName].children.push(...childrenData);
            groupedData[estimateRequestId]?.children.push(...childrenData??[]);
        } else if(item.estimateDetailList){
            childrenData = item.estimateDetailList.map((detail) => ({
                key: detail.estimateDetailId,
                estimateDetailId: detail.estimateDetailId,
                estimateId: detail.estimateId,
                model: detail.model,
                quantity: detail.quantity,
                unit: detail.unit,
                currency: detail.currency,
                net: detail.net,
                unitPrice: detail.unitPrice,
                currencyUnit: detail.currencyUnit,
                amount: detail.amount,
                orderProcessing: detail.orderProcessing,
                orderDate: detail.orderDate,
                order: detail.order,
                serialNumber: detail.serialNumber,
            }));
            groupedData[estimateId]?.children.push(...childrenData??[]);
        }


    });

    // groupedData 객체를 배열 형태로 변환
    const transformedArray = Object.values(groupedData);

    return transformedArray;
};