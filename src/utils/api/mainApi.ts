import {getData, getFormData} from "@/manage/function/api";
import message from "antd/lib/message";
import moment from "moment/moment";
import {rfqWriteInitial, subRfqReadInitial} from "@/utils/initialList";


export const checkInquiryNo = async ({data}) => {
    return await getData.post('estimate/getNewDocumentNumberFull', data).then(v => {
        if (v.data.code === 1) {
            return v.data.entity.newDocumentNumberFull
        }
    }, err => message.error(err))
};


export const saveRfq = async ({data, router}) => {
    await getFormData.post('estimate/addEstimateRequest', data).then(v => {
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


    const result = await getData.post('estimate/getEstimateRequestList',data);
    console.log(result,'result:')
    return result?.data?.entity?.estimateRequestList

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

export const saveRemittance = async ({data, router}) => {
    await getFormData.post('remittance/addRemittance', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다.')
            router.push(`/remittance_domestic_update?remittanceId=${v.data.entity.remittanceId}`)
        } else {
            message.error('저장에 실패하였습니다.')
        }
    });
};

export const saveProject = async ({data, router}) => {
    await getFormData.post('project/addProject', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다.')
            router.push(`/project_update?projectId=${v.data.entity.projectId}`)
        } else {
            message.error('저장에 실패하였습니다.')
        }
    });
};
export const saveStore = async ({data, router}) => {
    await getData.post('order/addOrderStatus', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다.')
            router.push(`/store_update?orderStatusId=${v.data.entity.orderStatusId}`)
        } else {
            message.error('저장에 실패하였습니다.')
        }
    });
};


export const updateStore = async ({data, router}) => {
    await getData.post('order/updateOrderStatus', data).then(v => {
        if (v.data.code === 1) {
            message.success('수정되었습니다.')
        } else {
            message.error('수정에 실패하였습니다.')
        }
    });
};


export const updateRemittance = async ({data, router}) => {
    await getFormData.post('remittance/updateRemittance', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다.')
        } else {
            message.error('저장에 실패하였습니다.')
        }
    });
};

export const updateProject = async ({data, router}) => {
    await getFormData.post('project/updateProject', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다.')
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

    const result = await getData.post('estimate/getEstimateList', {
        ...data, page: 1,
        limit: -1
    });

    return result?.data?.entity?.estimateList
};


export const searchProject = async ({data}) => {

    const defaultParam = {
        "searchManagerAdminName": "",
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchCreatedBy": "",
        "searchDocumentNumberFull": "",
        "searchProjectTitle": "",
        "searchConnectInquiryNo": "",
        "searchCustomerName": "",
        "searchCustomerManagerName": "",
        "searchCustomerPhone": "",
        "searchCustomerEmail": "",
        "searchAgencyName": "",
        "searchAgencyManagerName": "",
        "searchAgencyManagerPhone": "",
        "searchAgencyManagerEmail": "",
        "page": 1,
        "limit": -1
    }

    const result = await getData.post('project/getProjectList', {...defaultParam, ...data});
    return result?.data?.entity?.projectList
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

export const deleteDelivery = async ({
                                         data, returnFunc = function () {
    }
                                     }) => {

    await getData.post('delivery/deleteDeliveries', data).then(v => {
        if (v.data.code === 1) {
            message.success('삭제되었습니다.')
        } else {
            message.error('오류가 발생하였습니다. 다시 시도해주세요.')
        }
    }, err => message.error(err))
};



export const deleteOrderStatusDetails = async ({
                                         data, returnFunc = function () {
    }
                                     }) => {

    await getData.post('order/deleteOrderStatusDetails', data).then(v => {
        if (v.data.code === 1) {
            message.success('삭제되었습니다.')
            returnFunc()
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
        console.log(v,':::')
    });
};


export const searchOrder = async ({data}) => {

    const result = await getData.post('order/getOrderList',{
        ...data, page: 1,
        limit: -1
    });
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
export const getOrderStatusList = async ({data}) => {
    const v = await getData.post('order/getOrderStatusList', {
        ...data, page: 1,
        limit: -1
    })
    if (v.data.code === 1) {
        console.log(v,'v:')
        return v.data.entity.orderStatusList
    } else {
        message.error('오류가 발생하였습니다. 다시 시도해주세요.')
    }
};

export const getRemittanceList = async ({data}) => {
    const v = await getData.post('remittance/getRemittanceList', {
        ...data, page: 1,
        limit: -1
    })
    if (v.data.code === 1) {
        return v.data.entity.remittanceList
    } else {
        message.error('오류가 발생하였습니다. 다시 시도해주세요.')
    }
};
