

const estimateRead = (src) => {
    return {
        "estimateId": src.estimateId,
        "documentNumber": src.documentNumber,
        "writtenDate": src.writtenDate,
        "agencyCode": src.agencyCode,
        "agencyName": src.agencyName,
        "customerCode": src.customerCode,
        "customerName": src.customerName,
        "phoneNumber": src.phoneNumber,
        "faxNumber": src.faxNumber,
        "validityPeriod": src.validityPeriod,
        "paymentTerms": src.paymentTerms,
        "shippingTerms": src.shippingTerms,
        "exchangeRate": src.exchangeRate,
        "managerName": src.managerName,
        "email" : src.email,
        "managerPhoneNumber":src.managerPhoneNumber,
        "managerFaxNumber": src.managerFaxNumber,
        "maker": src.maker,
        "item": src.item,
        "delivery": src.delivery,
        "remarks":src.remarks,
        "createdBy": src.createdBy,
        "createdDate":src.createdDate,
        "modifiedBy":src.modifiedBy,
        "modifiedDate": src.modifiedDate,
        "documentNumberFull": src.documentNumberFull,
        "subNumber": src.subNumber,
        "estimateManager": src.estimateManager,
        "key": src.key,
        children: [],
    }
}
const estimateDetailRead = (detail) => {
    return {
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
        serialNumber: detail.serialNumber
    }
}

const rfqRead = (src) => {
  return {
      key: src.key,
      agencyName: src.agencyName,
      writtenDate: src.writtenDate,
      documentNumber: src.documentNumberFull,
      estimateRequestId: src.estimateRequestId,
      managerName: src.managerName,
      createdBy: src.createdBy,
      modifiedDate: src.modifiedDate,
      maker: src.maker,
      item: src.item,
      children: [],
  }
}

const rfqDetailRead = (detail) => {
    return {
        key: detail.estimateRequestDetailId,
        estimateRequestId : detail.estimateRequestId,
        estimateRequestDetailId: detail.estimateRequestDetailId,
        model: detail.model,
        quantity: detail.quantity,
        unit: detail.unit,
        currency: detail.currency,
        net: detail.net,
        deliveryDate: detail.deliveryDate,
        content: detail.content,
        replyDate: detail.replyDate,
        remarks: detail.remarks,
        serialNumber: detail.serialNumber

    }
}


export const transformData = (data, type, listType) => {
// 그룹화된 데이터 구조를 저장할 객체
    let groupedData = {};

    data.forEach((item) => {
        const mainKey= item[type];

        // 기존에 같은 agencyName이 있는지 확인
        if (!groupedData[mainKey]) {
            // 같은 agencyName이 없으면 초기화
            switch (type) {
                case 'estimateId' :
                    groupedData[mainKey] = estimateRead(item);
                    break;
                    //견적의뢰쪽
                case 'estimateRequestId' :
                    groupedData[mainKey] = rfqRead(item)
            }
        }

        let childrenData;


        console.log(listType,'type:')
        switch (type) {
            case 'estimateId' :
                childrenData = item[listType]?.map((detail) =>estimateDetailRead(detail))
                break;
            //견적의뢰쪽
            case 'estimateRequestId' :
                childrenData = item[listType]?.map((detail) =>rfqDetailRead(detail));
                break;
        }
        // if(item[listType]){
        // childrenData = item[listType]?.map((detail) =>rfqDetailRead(detail));}

        // 같은 agencyName에 하위 데이터를 children으로 추가
        // groupedData[agencyName].children.push(...childrenData);
        groupedData[mainKey]?.children.push(...childrenData??[]);
    });

    // groupedData 객체를 배열 형태로 변환
    const transformedArray = Object.values(groupedData);

    return transformedArray;
};