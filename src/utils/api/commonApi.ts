import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {modalList} from "@/utils/initialList";
import moment from "moment/moment";
import {checkInquiryNo} from "@/utils/api/mainApi";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {inputForm} from "@/utils/commonForm";
import {orderInfo} from "@/utils/column/ProjectInfo";


export const findCodeInfo = async (event, setInfo, openModal, type?, setValidate?) => {

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
                case 'agencyCode' : {
                    const {agencyId, agencyCode, agencyName, currencyUnit, email, managerName, phoneNumber} = data[0];
                    // console.log(data[0],'data[0]:')
                    // const returnDocumentNumb = await checkInquiryNo({data: {agencyCode: agencyCode, type: type}})
                    setInfo(v => {
                        return {
                            ...v,
                            // documentNumberFull: type === 'ESTIMATE' ? v.documentNumberFull : returnDocumentNumb,
                            agencyId: agencyId,
                            agencyCode: agencyCode,
                            agencyName: agencyName,
                            agencyManagerName: managerName,
                            agencyManagerEmail: email,
                            currencyUnit: currencyUnit,
                            agencyManagerPhoneNumber: phoneNumber
                        }
                    });

                }
                    if (setValidate) {
                        setValidate(v => {
                            return {...v, agencyCode: true, documentNumberFull: true}
                        })

                    }
                    break;
                case 'customerName' :
                    const {customerName, managerName, directTel, faxNumber, email, paymentMethod} = data[0];
                    console.log(paymentMethod, 'customerName~~~~')
                    setInfo(v => {
                        return {
                            ...v,
                            customerName: customerName,
                            managerName: managerName,
                            phoneNumber: directTel,
                            faxNumber: faxNumber,
                            customerManagerEmail: email,
                            paymentTerms: paymentMethod ? paymentMethod : '발주시 50% / 납품시 50%',

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

    console.log(event.target.value, 'event.target.value:')

    const result = await getData.post('order/getOrderList', {
        "searchStartDate": "",          // 발주일자 검색 시작일
        "searchEndDate": "",            // 발주일자 검색 종료일
        "searchDocumentNumber": event.target.value,     // 문서번호
        "searchCustomerName": "",       // 거래처명
        "searchMaker": "",              // Maker
        "searchModel": "",              // Model
        "searchItem": "",               // Item
        "searchEstimateManager": "",    // 견적서담당자명
        "page": 1,
        "limit": 20
    });
    console.log(result, ':::')
    return result?.data?.entity?.orderList;
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


export const findOrderDocumentInfo = async (event, setInfo, setTableData?, managerList?) => {

    const result = await getData.post('estimate/getEstimateDetail', {
        "estimateId": null,
        "documentNumberFull": event.target.value.toUpperCase()
    });

    if (result?.data?.code === 1) {

        if (result?.data?.entity?.estimateDetail?.estimateDetailList.length) {

            const list = managerList?.find(v => v.name === result?.data?.entity?.estimateDetail?.managerAdminName)


            const {delivery, writtenDate, agencyCode} = result?.data?.entity?.estimateDetail;

            const date = moment(writtenDate);

            const newDate = date.add(parseInt(delivery), 'weeks');

            const countryNumb = commonManage.changeCurr(agencyCode);
            console.log(countryNumb, 'countryNumb:')
            setInfo(v => {
                    return {
                        ...v, ...result?.data?.entity?.estimateDetail,
                        documentNumberFull: event.target.value.toUpperCase(),
                        ourPoNo: event.target.value.toUpperCase(),
                        writtenDate: moment().format('YYYY-MM-DD'),
                        managerAdminId: list?.adminId,
                        managerId: list?.name,
                        managerPhoneNumber: countryNumb !== 'KRW' ? `+82 ${list?.contactNumber}` : list?.contactNumber,
                        managerFaxNumber: list?.faxNumber,
                        managerEmail: list?.email,
                        estimateManager: result?.data?.entity?.estimateDetail?.managerAdminName,
                        orderDetailList: result?.data?.entity?.estimateDetail?.estimateDetailList,
                        delivery: newDate.format('YYYY-MM-DD')
                    }
                }
            );

            setTableData([...result?.data?.entity?.estimateDetail?.estimateDetailList,...commonFunc.repeatObject(orderInfo['write']['defaultData'], 100 - result?.data?.entity?.estimateDetail?.estimateDetailList.length)])


            // gridManage.resetData(gridRef, detailList)

        }
    }
};






