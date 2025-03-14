import React, {useEffect, useRef, useState} from "react";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    numbFormatter,
    numbParser,
    TopBoxCard
} from "@/utils/commonForm";
import Radio from "antd/lib/radio";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {updateRemittance} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {projectInfo} from "@/utils/column/ProjectInfo";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {DriveUploadComp} from "@/component/common/SharePointComp";

export default function RemittanceDomesticUpdate({
                                                     updateKey
                                                 }:any) {


    const userInfo = useAppSelector((state) => state.user);
    const fileRef = useRef(null);
    const infoRef = useRef(null);
    const notificationAlert = useNotificationAlert();
    const router = useRouter();
    const [fileList, setFileList] = useState(fileManage.getFormatFiles([]));
    const [originFileList, setOriginFileList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [info, setInfo] = useState({})





    async function getDataInfo() {
        const result = await getData.post('remittance/getRemittanceDetail', {
            "remittanceId": updateKey['remittance_domestic_update']
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {remittanceDetail, attachmentFileList} = v;

            setFileList(fileManage.getFormatFiles(attachmentFileList))
            setOriginFileList(fileManage.getFormatFiles(attachmentFileList))

            let copyData = _.cloneDeep(remittanceDetail);
            copyData['surtax'] = copyData['supplyAmount'] * 0.1
            copyData['total'] = copyData['supplyAmount'] * 0.1 + parseFloat(remittanceDetail['supplyAmount'])

            setInfo(copyData);

            setLoading(false)
        })
    }, [updateKey['project_update']])



    // useEffect(() => {
    //     setInfo((v: any) => {
    //         return {
    //             ...v,
    //             surtax: Math.round(v.supplyAmount * 0.1),
    //             total: v.supplyAmount + Math.round(v.supplyAmount * 0.1)
    //         }
    //     })
    // }, [infoInit])


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        if (!info['connectInquiryNo']) {
            return message.warn('Inquiry No. 가 누락되었습니다.')
        }
        const formData: any = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                if (!(key === 'modifiedId' || key === 'modifiedDate'))
                    formData.append(key, value);
            }
        };

        handleIteration();


        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)

        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateRemittance({data: formData, router: router})
    }

    function clearAll() {

    }

    function copyPage() {
        let copyInfo = _.cloneDeep(info)
        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/remittance_domestic?${query}`)
    }

    return <>
        <div style={{height: 'calc(100vh - 90px)'}}>


            <MainCard title={'국내 송금 수정'} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'},
                {name: '복제', func: copyPage, type: 'default'}
            ]}>

                <div ref={infoRef}>
                    <TopBoxCard grid={'250px 200px 200px 200px'}>
                        {inputForm({
                            title: 'Inquiry No.',
                            id: 'connectInquiryNo',
                            onChange: onChange,
                            data: info,
                            disabled: true
                        })}
                        {inputForm({title: '고객사명', id: 'customerName', onChange: onChange, data: info})}
                        {inputForm({title: '매입처명', id: 'agencyName', onChange: onChange, data: info})}
                        {inputForm({
                            title: '담당자',
                            id: 'managerAdminName',
                            onChange: onChange,
                            data: info,
                            disabled: true
                        })}
                    </TopBoxCard>

                    <div style={{display: 'grid', gridTemplateColumns: "1fr 1fr 1fr 1fr", paddingTop: 5}}>

                        <BoxCard title={'송금정보'}>
                            {datePickerForm({title: '송금요청일자', id: 'requestDate', onChange: onChange, data: info})}
                            {datePickerForm({title: '송금지정일자', id: 'assignedDate', onChange: onChange, data: info})}
                        </BoxCard>

                        <BoxCard title={'확인정보'}>
                            <div>송금여부</div>
                            <Radio.Group id={'isSend'} value={'X'}>
                                <Radio value={'O'}>O</Radio>
                                <Radio value={'X'}>X</Radio>
                            </Radio.Group>
                            <div>계산서 발행여부</div>
                            <Radio.Group id={'isInvoice'} value={'X'}>
                                <Radio value={'O'}>O</Radio>
                                <Radio value={'X'}>X</Radio>
                            </Radio.Group>
                        </BoxCard>


                        <BoxCard title={'금액정보'}>
                            {inputNumberForm({
                                title: '공급가액',
                                id: 'supplyAmount',
                                onChange: onChange,
                                data: info,
                                formatter: numbFormatter,
                                parser: numbParser
                            })}
                            {inputNumberForm({
                                title: '부가세',
                                id: 'surtax',
                                disabled: true,
                                onChange: onChange,
                                data: info,
                                formatter: numbFormatter,
                                parser: numbParser
                            })}
                            {inputNumberForm({
                                title: '합계',
                                id: 'total',
                                disabled: true,
                                onChange: onChange,
                                data: info,
                                formatter: numbFormatter,
                                parser: numbParser
                            })}
                        </BoxCard>
                        <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                            {/*@ts-ignored*/}
                            <div style={{overFlowY: "auto", maxHeight: 300}}>
                                <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                 infoRef={infoRef}/>
                            </div>
                        </BoxCard>
                    </div>
                </div>
            </MainCard>
        </div>
    </>
}
