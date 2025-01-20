import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {modalList} from "@/utils/initialList";
import moment from "moment/moment";
import {checkInquiryNo} from "@/utils/api/mainApi";


export const findCodeInfo = async (event, setInfo, openModal, type? , setValidate?) => {
    getData.post(modalList[event.target.id]?.url, {
        "searchType": "1",
        "searchText": event.target.value,       // 대리점코드 or 대리점 상호명
        "page": 1,
        "limit": -1
    }).then(async v => {

        const data = v?.data?.entity[modalList[event.target.id]?.list];

        const size = data?.length;

        if (size > 1) {

            return openModal(event.target.id);
        } else if (size === 1) {
            switch (event.target.id) {
                case 'agencyCode' :
                    const {agencyId, agencyCode, agencyName, currencyUnit} = data[0];
                    const returnDocumentNumb = await checkInquiryNo({data: {agencyCode: agencyCode, type : type}})
                    setInfo(v => {
                        return {
                            ...v,
                            documentNumberFull : returnDocumentNumb,
                            agencyId: agencyId,
                            agencyCode: agencyCode,
                            agencyName: agencyName,
                            currencyUnit: currencyUnit
                        }
                    });
                    setValidate(v=>{return{...v, agencyCode :true, documentNumberFull : true}})

                    break;
                case 'customerName' :
                    const {customerName, managerName, directTel, faxNumber, email} = data[0];
                    // console.log(data[0], 'customerName~~~~')
                    setInfo(v => {
                        return {
                            ...v,
                            customerName: customerName,
                            managerName: managerName,
                            phoneNumber: directTel,
                            faxNumber: faxNumber,
                            customerManagerEmail: email

                        }
                    })
                    break;

                case 'maker' :
                    const {makerName, item, instructions} = data[0];
                    setInfo(v => {
                        return {
                            ...v,
                            maker: makerName,
                            item: item,
                            instructions: instructions,
                        }
                    })
                    break;

            }
        } else {
            message.warn('조회된 데이터가 없습니다.')
        }


    }, err => message.error(err))
};


export const findDocumentInfo = async (event, setInfo) => {

    const result = await getData.post('estimate/getEstimateRequestDetail', {
        "documentNumberFull": event.target.value,
        "page": 1,
        "limit": -1
    })
    return result?.data?.entity?.estimateRequestDetail
};

export const findEstDocumentInfo = async (event, setInfo) => {

    const result = await getData.post('estimate/getEstimateDetail', {
        "estimateId": null,
        "documentNumberFull": event.target.value
    });
    if (result?.data?.code === 1) {


        if (result?.data?.entity?.estimateDetail?.estimateDetailList.length) {

            setInfo(v => {
                    return {
                        ...v, ...result?.data?.entity?.estimateDetail,
                        documentNumberFull: event.target.value,
                        writtenDate: moment(),
                        orderDetailList: result?.data?.entity?.estimateDetail?.estimateDetailList
                    }
                }
            )
        }
    }
};


export const findOrderDocumentInfo = async (event, setInfo) => {

    const result = await getData.post('estimate/getEstimateDetail', {
        "estimateId": null,
        "documentNumberFull": event.target.value
    });
    if (result?.data?.code === 1) {


        if (result?.data?.entity?.estimateDetail?.estimateDetailList.length) {

            setInfo(v => {
                    return {
                        ...v, ...result?.data?.entity?.estimateDetail,
                        documentNumberFull: event.target.value,
                        writtenDate: moment(),
                        orderDetailList: result?.data?.entity?.estimateDetail?.estimateDetailList
                    }
                }
            )
        }
    }
};






