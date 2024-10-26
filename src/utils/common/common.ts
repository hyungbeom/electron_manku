import moment from "moment/moment";

export const transformData = (data) => {
// 그룹화된 데이터 구조를 저장할 객체
    const groupedData = {};

    data.forEach((item) => {
        const { agencyName } = item;

        // 기존에 같은 agencyName이 있는지 확인
        if (!groupedData[agencyName]) {
            // 같은 agencyName이 없으면 초기화
            groupedData[agencyName] = {
                key: item.key,
                agencyName: agencyName,
                writtenDate: item.writtenDate,
                documentNumber: item.documentNumberFull,
                managerName: item.managerName,
                modifiedDate: item.modifiedDate,
                maker: item.maker,
                item: item.item,
                children: [],
            };
        }

        const childrenData = item.estimateRequestDetailList.map((detail) => ({
            key: detail.estimateRequestDetailId,
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
        groupedData[agencyName].children.push(...childrenData);
    });

    // groupedData 객체를 배열 형태로 변환
    const transformedArray = Object.values(groupedData);

    return transformedArray;
};