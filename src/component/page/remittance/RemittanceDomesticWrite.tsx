import React, {useEffect, useRef, useState} from "react";
import {ModalInitList, remittanceDomesticInitial} from "@/utils/initialList";
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
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";


export default function RemittanceDomesticWrite({dataInfo = [], copyPageInfo}: any) {
    const fileRef = useRef(null);
    const copyInit = _.cloneDeep(remittanceDomesticInitial)
    const groupRef = useRef<any>(null)
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null)

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const userInfo = useAppSelector((state) => state.user);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('remittanceDomesticWrite');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


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


    useEffect(() => {


        if (!isEmptyObj(copyPageInfo['remittance_domestic_write'])) {
            // copyPageInfo 가 없을시

            setInfo(infoInit)

        } else {
            setInfo(copyPageInfo['remittance_domestic_write'])
            // // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            // setInfo({
            //     ...copyPageInfo, ...adminParams,
            //     documentNumberFull: '',
            //     writtenDate: moment().format('YYYY-MM-DD')
            // });

        }
    }, [copyPageInfo['remittance_domestic_write']]);


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
        await saveRemittance({data: formData})
    }

    function clearAll() {
        setInfo(infoInit)
    }

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <>
        <div style={{height: 'calc(100vh - 90px)'}}>
            <PanelSizeUtil groupRef={groupRef} storage={'remittanceDomesticWrite'}/>
            <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                             open={isModalOpen}
                             setIsModalOpen={setIsModalOpen}/>


            <MainCard title={'국내 송금 등록'} list={[
                {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
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
                            data: info
                        })}
                    </TopBoxCard>

                    <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>

                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard title={'송금정보'}>
                                {datePickerForm({title: '송금요청일자', id: 'requestDate', onChange: onChange, data: info})}
                                {datePickerForm({title: '송금지정일자', id: 'assignedDate', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>

                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[1]} minSize={5}>
                            <BoxCard title={'확인정보'}>
                                <div>송금여부</div>
                                <Radio.Group id={'isSend'} value={info?.isSend} onChange={e => {
                                    setInfo(v => {
                                        return {...v, isSend: e.target.value}
                                    })
                                }}>
                                    <Radio value={'O'}>O</Radio>
                                    <Radio value={'X'}>X</Radio>
                                </Radio.Group>
                                <div>계산서 발행여부</div>
                                <Radio.Group id={'isInvoice'} value={info?.isInvoice} onChange={e => {
                                    setInfo(v => {
                                        return {...v, isInvoice: e.target.value}
                                    })
                                }}>
                                    <Radio value={'O'}>O</Radio>
                                    <Radio value={'X'}>X</Radio>
                                </Radio.Group>
                            </BoxCard>
                        </Panel>

                        <PanelResizeHandle/>

                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard title={'금액정보'}>
                                {inputNumberForm({
                                    title: '공급가액',
                                    id: 'supplyAmount',
                                    onChange: onChange,
                                    data: info,
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
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[3]} minSize={5}>
                            <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>

                                <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                 infoRef={infoRef}/>

                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel/>
                    </PanelGroup>
                </div>
            </MainCard>
        </div>
    </>
}
