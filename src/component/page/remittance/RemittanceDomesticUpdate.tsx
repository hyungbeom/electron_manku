import React, {useEffect, useRef, useState} from "react";
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
import {commonManage, fileManage} from "@/utils/commonManage";
import {updateRemittance} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {CopyOutlined, DeleteOutlined, FormOutlined, RadiusSettingOutlined} from "@ant-design/icons";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import moment from "moment/moment";

export default function RemittanceDomesticUpdate({
                                                     updateKey,
                                                     getCopyPage
                                                 }: any) {

    const groupRef = useRef<any>(null)
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

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('remittanceDomesticWrite');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


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
        setInfo(v => {
            return {
                ...v,
                agencyName: "",
                assignedDate: moment().format('YYYY-MM-DD'),
                createdDate: "2025-03-27T12:07:17.32",
                createdId: 26,
                customerName: "",
                isInvoice: "X",
                isSend: "X",
                managerAdminId: 20,
                managerAdminName: "유환진",
                modifiedBy: "test1@manku.co.kr",
                modifiedDate: "2025-03-27T12:07:38.177",
                modifiedId: 26,
                remittanceId: 1,
                requestDate: moment().format('YYYY-MM-DD'),
                supplyAmount: 0,
                surtax: 0,
                total: 0
            }
        });
    }

    function copyPage() {
        let copyInfo = _.cloneDeep(info)

        getCopyPage('remittance_domestic_write', copyInfo)

    }


    function deleteFunc() {

    }

    return <>
        <div style={{height: 'calc(100vh - 90px)'}}>


            <MainCard title={'국내 송금 수정'} list={[
                {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                {
                    name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                    func: clearAll,
                    type: 'danger'
                },
                {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: ''}

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
                                {/*@ts-ignored*/}
                                <Radio.Group id={'isSend'} value={info?.isSend}
                                             onChange={e=>{
                                                 setInfo(v=>{
                                                     return {...v, isSend :e.target.value}
                                                 })
                                             }}>
                                    <Radio value={'O'}>O</Radio>
                                    <Radio value={'X'}>X</Radio>
                                </Radio.Group>
                                <div>계산서 발행여부</div>
                                {/*@ts-ignored*/}
                                <Radio.Group id={'isInvoice'} value={info?.isInvoice} onChange={e=>{
                                    setInfo(v=>{
                                        return {...v, isInvoice :e.target.value}
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
