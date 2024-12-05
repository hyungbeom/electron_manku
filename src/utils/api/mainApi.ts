import {getData} from "@/manage/function/api";
import message from "antd/lib/message";

export const saveRfq = async ({data, router}) => {
        await getData.post('estimate/addEstimateRequest', data).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.');
                router.push(`/rfq_update?estimateRequestId=${v?.data?.entity?.estimateRequestId}`)
            }
    },err=> message.error(err))
};



export const updateRfq = async ({data}) => {
        await getData.post('estimate/updateEstimateRequest', data).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                // setInfo(rfqWriteInitial);

                // window.location.href = '/rfq_read'
            } else {
                message.error('저장에 실패하였습니다.')
            }
    },err=> message.error(err))
};





// =================================================================================================
export const saveEstimate = async ({data, router}) => {
    await getData.post('estimate/addEstimate', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다.')
            router.push(`/estimate_update?estimateId=${v.data.entity.estimateId}`)
        } else {
            message.error('저장에 실패하였습니다.')
        }
    });
};

export const saveOrder = async ({data, router}) => {
    await getData.post('order/addOrder', data).then(v => {
        if (v.data.code === 1) {
            message.success('저장되었습니다')
            router.push(`/order_update?orderId=${v.data.entity.orderId}`)
        } else {
            message.error('저장에 실패하였습니다.')
        }
    });
};




