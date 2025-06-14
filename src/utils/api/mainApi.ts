import {getData, getFormData} from "@/manage/function/api";
import msg from "antd/lib/message";

export const checkInquiryNo = async ({data}) => {
    return await getData.post('estimate/getNewDocumentNumberFull', data).then(v => {
        if (v.data.code === 1) {
            return v.data.entity.newDocumentNumberFull
        }
    }, err => msg.error(err))
};

export const saveRfq = async ({data}) => {
    return await getFormData.post('estimate/addEstimateRequest', data).then(v => {

        return v.data
    }, err => {

        console.log(err)
    })
};

export const updateRfq = async ({data, returnFunc}) => {
    await getFormData.post('estimate/updateEstimateRequest', data).then(v => {
        returnFunc(v.data);
    }, err => msg.error(err))
};

export const getAttachmentFileList = async ({data}) => {
    return await getData.post('common/getAttachmentFileList', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            return v.data.entity;
        } else {
            msg.error('파일 저장에 실패하였습니다.')
        }
    }, err => msg.error(err))
};


export const searchRfq = async ({data}) => {
    const result = await getData.post('estimate/getEstimateRequestList', data);

    const {estimateRequestList, pageInfo} = result?.data?.entity
    return {data: estimateRequestList, pageInfo: pageInfo}
};


export const deleteRfq = async ({
                                    data, returnFunc = function (e) {
    }
                                }) => {

    return await getData.post('estimate/deleteEstimateRequestDetails', data).then(v => {

        return v.data

    }, err => msg.error(err))
};


// =================================================================================================
export const saveEstimate = async ({data}) => {
    return await getFormData.post('estimate/addEstimate', data).then(v => {
        return v.data
    });
};

export const saveRemittance = async ({data}) => {
    return await getFormData.post('remittance/addRemittance', data).then(v => {
        if (v.data.code === 1) {
            // window.opener?.postMessage('write', window.location.origin);
            // msg.success('저장되었습니다.')
            return v
        } else {
            msg.error('저장에 실패하였습니다.')
        }
    });
};


export const saveProject = async ({data, router, returnFunc}) => {
    await getFormData.post('project/addProject', data).then(v => {
        const {code, message, entity} = v.data;
        returnFunc(code, entity, message)
    });
};
export const saveStore = async ({data, router}) => {
    await getData.post('order/addOrderStatus', data).then(v => {
        if (v.data.code === 1) {
            window.opener?.postMessage('write', window.location.origin);
            msg.success('저장되었습니다.')
        } else if (v.data.code === -20001) {

            msg.warning('B/L No.가 이미 존재합니다.')
        } else {
            msg.error('저장에 실패하였습니다.')
        }
    });
};


export const updateStore = async ({data, router}) => {
    await getData.post('order/updateOrderStatus', data).then(v => {
        if (v.data.code === 1) {
            // window.opener?.postMessage('write', window.location.origin);
            msg.success('수정되었습니다.')
        } else if (v.data.code === -20001) {
            msg.error('B/L No.가 중복됩니다.')
        } else {
            msg.error('수정에 실패하였습니다.')

        }
    });
};


export const updateRemittance = async ({data}) => {
    return await getFormData.post('remittance/updateRemittance', data).then(v => {
        if (v.data.code === 1) {
            // window.opener?.postMessage('write', window.location.origin);
            // msg.success('수정되었습니다.');
            return v
        } else {
            // msg.error('저장에 실패하였습니다.')
        }
    });
};

export const updateProject = async ({data, router, returnFunc}) => {
    await getFormData.post('project/updateProject', data).then(v => {
        const {code, message} = v.data;
        returnFunc(code, message);
    });
};


export const updateEstimate = async ({data, returnFunc}) => {
    await getFormData.post('estimate/updateEstimate', data).then(v => {
        returnFunc(v.data);
    }, err => console.log(err, '::::'));
};

export const searchEstimate = async ({data}) => {

    return await getData.post('estimate/getEstimateList', {
        ...data, page: 1,
        limit: -1
    }).then(v => {
        if (v.data.code === 1) {
            const {estimateList, pageInfo} = v?.data?.entity
            return {data: estimateList, pageInfo: pageInfo}
        }
    })

};


export const searchProject = async ({data}) => {

    return await getData.post('project/getProjectList', data).then(v => {
        if (v.data.code === 1) {
            const {projectList, pageInfo} = v.data.entity;
            return {data: projectList, pageInfo: pageInfo}
        }
    })
};

export const deleteProjectList = async ({
                                            data, returnFunc = function (e) {
    }
                                        }) => {

    return await getData.post('project/deleteProjectDetails', data).then(v => {
        return v.data
    }, err => msg.error(err))
};

export const deleteRemittanceList = async ({
                                               data, returnFunc = function (e) {
    }
                                           }) => {

    await getData.post('remittance/deleteRemittances', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            msg.success('삭제되었습니다.')

        } else {
            msg.error('오류가 발생하였습니다. 다시 시도해주세요.')
        }
        returnFunc(code === 1);
    }, err => msg.error(err))
};


export const deleteEstimate = async ({
                                         data, returnFunc = function (e) {
    }
                                     }) => {

    return await getData.post('estimate/deleteEstimateDetails', data).then(v => {

        return v.data
    }, err => msg.error(err))
};

export const deleteDelivery = async ({
                                         data, returnFunc = function () {
    }
                                     }) => {

    return await getData.post('delivery/deleteDeliveries', data).then(v => {
        return v.data
    }, err => msg.error(err))
};


export const deleteOrderStatusDetails = async ({
                                                   data, returnFunc = function (e) {
    }
                                               }) => {

    await getData.post('order/deleteOrderStatusDetails', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            msg.success('삭제되었습니다.')

        } else {
            msg.error('오류가 발생하였습니다. 다시 시도해주세요.')
        }
        returnFunc(code === 1);
    }, err => msg.error(err))
};


// ==================================================================================================================

export const saveOrder = async ({data, router, returnFunc}) => {
    await getFormData.post('order/addOrder', data).then(v => {
        const {code, message, entity} = v.data
        returnFunc(code, message, entity);
    });
};


export const updateOrder = async ({data, returnFunc}) => {
    return await getFormData.post('order/updateOrder', data).then(v => {
        const {code, message, entity} = v.data
        returnFunc(code, message, entity);
    });
};


export const searchOrder = async ({data}) => {

    return await getData.post('order/getOrderList', {
        ...data, page: 1,
        limit: -1
    }).then(v => {
        if (v.data.code === 1) {
            const {orderList, pageInfo} = v?.data?.entity;
            return {data: orderList, pageInfo: pageInfo}
        }
    })
};

export const deleteOrder = async ({
                                      data, returnFunc = function (e) {
    }
                                  }) => {

    return await getData.post('order/deleteOrderDetails', data).then(v => {
        return v.data
    }, err => msg.error(err))
};

export const deleteHsCodeList = async ({data,}) => {

    return await getData.post('hsCode/deleteHsCodes', data).then(v => {
        return v.data
    }, err => msg.error(err))
};


export const getDeliveryList = async ({data}) => {
    const v = await getData.post('delivery/getDeliveryList', {
        ...data, page: 1,
        limit: -1
    })
    if (v.data.code === 1) {
        return v.data.entity.deliveryList
    } else {
        msg.error('오류가 발생하였습니다. 다시 시도해주세요.')
    }
};
export const getOrderStatusList = async ({data}) => {
    return await getData.post('order/getOrderStatusList', {
        ...data, page: 1,
        limit: -1
    }).then(v => {
        if (v.data.code === 1) {
            const {orderStatusList, pageInfo} = v.data.entity
            return {data: orderStatusList, pageInfo: pageInfo}
        } else {
            msg.error('오류가 발생하였습니다. 다시 시도해주세요.')
        }
    })

};

export const getRemittanceList = async ({data}) => {
    const v = await getData.post('remittance/getRemittanceList', {
        ...data,
        page: 1,
        limit: -1
    })
    if (v.data.code === 1) {
        return {data: v?.data?.entity, pageInfo: {totalRow: v?.data?.entity.length}}
    } else {
        msg.error('오류가 발생하였습니다. 다시 시도해주세요.')
    }
};


// =====================================================================================================================
// =====================================================================================================================
// ==============================================data===================================================================
// =====================================================================================================================
// =====================================================================================================================

export const saveDomesticAgency = async ({data, router}: any) => {

    getData.post('agency/addAgency', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            window.opener?.postMessage('write', window.location.origin);
            msg.success('등록되었습니다.')
            router.push(`/data/agency/domestic/agency_update?`)
        } else {
            msg.error('실패하였습니다.')
        }
    })
};

export const updateDomesticAgency = async ({data, returnFunc}: any) => {

   return await getData.post('agency/updateOverseasAgency', data).then(v => {

       return v.data
    })

};


export const searchDomesticAgency = async ({data}: any) => {

    return getData.post('agency/getAgencyList', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            const {agencyList, pageInfo} = v.data.entity
            return {data: agencyList, pageInfo: pageInfo}
            msg.success('수정되었습니다.')
        } else {
            msg.error('실패하였습니다.')
        }
    })

};

export const searchOverseasAgency = async ({data}: any) => {
    return getData.post('agency/getOverseasAgencyList', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            const {overseasAgencyList, pageInfo} = v.data.entity
            return {data: overseasAgencyList, pageInfo: pageInfo}
            msg.success('수정되었습니다.')
        } else {
            msg.error('실패하였습니다.')
        }
    })
};


export const searchDomesticCustomer = async ({data}: any) => {

    return getData.post('customer/getCustomerList', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            const {customerList, pageInfo} = v.data.entity
            return {data: customerList, pageInfo: pageInfo}
            msg.success('수정되었습니다.')
        } else {
            msg.error('실패하였습니다.')
        }
    })

};


export const searchOverseasCustomer = async ({data}: any) => {

    return getData.post('customer/getOverseasCustomerList', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            const {overseasCustomerList, pageInfo} = v.data.entity
            return {data: overseasCustomerList, pageInfo: pageInfo}
            msg.success('수정되었습니다.')
        } else {
            msg.error('실패하였습니다.')
        }
    })
};


export const searchMaker = async ({data}: any) => {

    return getData.post('maker/getMakerList', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            const {makerList, pageInfo} = v.data.entity
            return {data: makerList, pageInfo: pageInfo}
            msg.success('수정되었습니다.')
        } else {
            msg.error('실패하였습니다.')
        }
    })
};

export const searchCompanyAccount = async ({data}: any) => {

    return getData.post('company/getCompanyAccountList', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            const {companyAccountList, pageInfo} = v.data.entity
            return {data: companyAccountList, pageInfo: pageInfo}
            msg.success('수정되었습니다.')
        } else {
            msg.error('실패하였습니다.')
        }
    })
};

export const searchHSCode = async ({data}: any) => {

    return getData.post('hsCode/getHsCodeList', data).then(v => {
        const code = v.data.code;
        if (code === 1) {
            const {hsCodeList, pageInfo} = v.data.entity
            return {data: hsCodeList, pageInfo: pageInfo}
            msg.success('수정되었습니다.')
        } else {
            msg.error('실패하였습니다.')
        }
    })

};