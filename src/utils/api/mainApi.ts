import {getData, getFormData} from "@/manage/function/api";
import message from "antd/lib/message";
import moment from "moment/moment";
import {rfqWriteInitial} from "@/utils/initialList";


export const checkInquiryNo = async ({data}) => {
    return await getData.post('estimate/getNewDocumentNumberFull', data).then(v => {
        if (v.data.code === 1) {
            return v.data.entity.newDocumentNumberFull
        }
    }, err => message.error(err))
};


export const saveRfq = async ({data, router}) => {
    await getFormData.post('estimate/addEstimateRequest', data).then(v => {
        console.log(v, '::::')
        if (v.data.code === 1) {
            message.success('저장되었습니다.');
            router.push(`/rfq_update?estimateRequestId=${v?.data?.entity?.estimateRequestId}`)
        }
    }, err => message.error(err))
};


export const updateRfq = async ({data, router}) => {
    await getFormData.post('estimate/updateEstimateRequest', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다.')
            // setInfo(rfqWriteInitial);
            router.push('/rfq_read')
            // window.location.href = '/rfq_read'
        } else {
            message.error('저장에 실패하였습니다.')
        }
    }, err => message.error(err))
};


export const searchRfq = async ({data}) => {

    const defaultParam = {
        "searchEstimateRequestId": "",      // 견적의뢰 Id
        "searchSentStatus": 0,                   // 검색조건 1: 회신, 2: 미회신
        "searchReplyStatus": 0,
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
        "searchCustomerName": "",           // 고객사명
        "searchMaker": "",                  // MAKER
        "searchModel": "",                  // MODEL
        "searchItem": "",                   // ITEM
        "searchCreatedBy": "",              // 등록직원명
        "searchManagerName": "",            // 담당자명
        "searchMobileNumber": "",           // 담당자 연락처
        "searchBiddingNumber": "",          // 입찰번호(미완성)
        "page": 1,
        "limit": -1
    }

    const result = await getData.post('estimate/getEstimateRequestList', {...defaultParam, ...data});
    return result?.data?.entity

};


export const deleteRfq = async ({
                                    data, returnFunc = function () {
    }
                                }) => {

    await getData.post('estimate/deleteEstimateRequestDetails', data).then(v => {
        if (v.data.code === 1) {
            returnFunc();
            message.success('삭제되었습니다.')
        } else {
            message.error('오류가 발생하였습니다. 다시 시도해주세요.')
        }
    }, err => message.error(err))
};


// =================================================================================================
export const saveEstimate = async ({data, router}) => {
    await getFormData.post('estimate/addEstimate', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다.')
            router.push(`/estimate_update?estimateId=${v.data.entity.estimateId}`)
        } else {
            message.error('저장에 실패하였습니다.')
        }
    });
};


export const updateEstimate = async ({data}) => {
    await getFormData.post('estimate/updateEstimate', data).then(v => {
        if (v.data.code === 1) {
            message.success('수정되었습니다.')
        } else {
            message.error('수정에 실패하였습니다.')
        }
    }, err => console.log(err, '::::'));
};

export const searchEstimate = async ({data}) => {

    const defaultParam = {
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
        "searchCustomerName": "",           // 고객사명
        "searchMaker": "",                  // MAKER
        "searchModel": "",                  // MODEL
        "searchItem": "",                   // ITEM
        "searchCreatedBy": "",              // 등록직원명
        "page": 1,
        "limit": -1,
    }

    const result = await getData.post('estimate/getEstimateList', {...defaultParam, ...data});
    return result?.data?.entity?.estimateList
};

export const deleteEstimate = async ({
                                         data, returnFunc = function () {
    }
                                     }) => {

    await getData.post('estimate/deleteEstimateDetails', data).then(v => {
        if (v.data.code === 1) {
            returnFunc();
            message.success('삭제되었습니다.')
        } else {
            message.error('오류가 발생하였습니다. 다시 시도해주세요.')
        }
    }, err => message.error(err))
};


// ==================================================================================================================

export const saveOrder = async ({data, router}) => {
    await getFormData.post('order/addOrder', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다')
            router.push(`/order_update?orderId=${v.data.entity.orderId}`)
        } else {
            ``
            message.error('저장에 실패하였습니다.')
        }
    });
};


export const updateOrder = async ({data}) => {
    await getFormData.post('order/updateOrder', data).then(v => {
        if (v.data.code === 1) {
            message.success('수정되었습니다')
        } else {
            message.error('수정에 실패하였습니다.')
        }
    });
};


export const searchOrder = async ({data}) => {

    const defaultParam = {
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchDocumentNumber": "",     // 문서번호
        "searchCustomerName": "",       // 고객사명
        "searchMaker": "",              // MAKER
        "searchModel": "",              // MODEL
        "searchItem": "",               // ITEM
        "searchEstimateManager": "",    // 견적서담당자명
        "page": 1,
        "limit": -1
    }

    const result = await getData.post('order/getOrderList', {...defaultParam, ...data});
    return result?.data?.entity?.orderList
};

export const deleteOrder = async ({
                                      data, returnFunc = function () {
    }
                                  }) => {

    await getData.post('order/deleteOrderDetails', data).then(v => {
        if (v.data.code === 1) {
            returnFunc();
            message.success('삭제되었습니다.')
        } else {
            message.error('오류가 발생하였습니다. 다시 시도해주세요.')
        }
    }, err => message.error(err))
};


export const getDeliveryList = async ({data}) => {

    console.log(data,'data')
    const v = await getData.post('delivery/getDeliveryList', {
        ...data, page: 1,
        limit: -1
    })
    if (v.data.code === 1) {
        return v.data.entity.deliveryList
    } else {
        message.error('오류가 발생하였습니다. 다시 시도해주세요.')
    }
};
