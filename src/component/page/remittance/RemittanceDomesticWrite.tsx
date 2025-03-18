import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {ModalInitList, remittanceDomesticInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
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
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Radio from "antd/lib/radio";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {commonManage} from "@/utils/commonManage";
import {saveRemittance} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {FileSearchOutlined, RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";


export default function RemittanceDomesticWrite({dataInfo = [], copyPageInfo}:any) {
    const fileRef = useRef(null);
    const copyInit = _.cloneDeep(remittanceDomesticInitial)
    const groupRef = useRef<any>(null)
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null)

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const userInfo = useAppSelector((state) => state.user);

    const infoInit = {
        ...copyInit,
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        adminName: userInfo['name'],
    }

    const [info, setInfo] = useState<any>({...infoInit, ...dataInfo})
    const [fileList, setFileList] = useState([]);

    const [loading, setLoading] = useState(false);

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {

        if (!info['connectInquiryNo']) {
            return message.warn('Inquiry No. 가 누락되었습니다.')
        }
        const formData: any = new FormData();

        setLoading(true)
        commonManage.setInfoFormData(info, formData, [], [])
        commonManage.getUploadList(fileRef, formData)
        formData.delete('createdDate')
        formData.delete('modifiedDate')
        await saveRemittance({data: formData, router: router})
    }

    function clearAll() {
        setInfo(infoInit)
    }

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <>
        <div style={{height : 'calc(100vh - 90px)'}}>
            <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                             open={isModalOpen}
                             setIsModalOpen={setIsModalOpen}/>


            <MainCard title={'국내 송금 등록'} list={[
                {name: <div><SaveOutlined style={{paddingRight : 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
            ]}>
                <div ref={infoRef}>
                    <TopBoxCard grid={'250px 200px 200px 200px'}>
                        {inputForm({
                            title: 'Inquiry No.',
                            id: 'connectInquiryNo',
                            onChange: onChange,
                            data: info,
                            disabled: true,
                            suffix: <FileSearchOutlined style={{cursor: 'pointer', color: 'black'}} onClick={
                                (e) => {
                                    e.stopPropagation();
                                    openModal('connectInquiryNo');
                                }
                            }/>
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

                    <div style={{display: 'grid', gridTemplateColumns: "1fr 1fr 1fr 1fr", paddingTop : 5}}>

                        <BoxCard title={'송금정보'}>
                            {datePickerForm({title: '송금요청일자', id: 'requestDate', onChange: onChange, data: info})}
                            {datePickerForm({title: '송금지정일자', id: 'assignedDate', onChange: onChange, data: info})}
                        </BoxCard>

                        <BoxCard title={'확인정보'}>
                            <div>송금여부</div>
                            <Radio.Group id={'isSend'} value={'X'} >
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
                    </div>
                </div>
            </MainCard>
        </div>
    </>
}
