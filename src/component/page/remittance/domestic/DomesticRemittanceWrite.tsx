import React, {useEffect, useRef, useState} from "react";
import {ModalInitList, remittanceDomesticInitial} from "@/utils/initialList";
import message from "antd/lib/message";
import {
    BoxCard,
    inputForm,
    inputNumberForm,
    MainCard,
    numbFormatter,
    numbParser,
    radioForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {commonFunc, commonManage} from "@/utils/commonManage";
import {saveRemittance} from "@/utils/api/mainApi";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import Table from "@/component/util/Table";
import {remittanceInfo} from "@/utils/column/ProjectInfo";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import Spin from "antd/lib/spin";

const listType = 'list';

export default function DomesticRemittanceWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const fileRef = useRef(null);
    const tableRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_remittance_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [mini, setMini] = useState(true);
    const [fileList, setFileList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const userInfo = useAppSelector((state) => state.user);
    const getRemittanceInit = () => {
        const copyInit = _.cloneDeep(remittanceDomesticInitial)
        const adminParams = {
            managerAdminId: userInfo['adminId'],
            managerAdminName: userInfo['name'],
            createdBy: userInfo['name'],
        }
        return {
            ...copyInit,
            ...adminParams,
        }
    }
    const [info, setInfo] = useState(getRemittanceInit());

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setInfo(getRemittanceInit());
            setTableData(commonFunc.repeatObject(remittanceInfo['write']['defaultData'], 1000))
        } else {
            // // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo(copyPageInfo);
            setTableData(copyPageInfo[listType]);
        }
    }, [copyPageInfo]);

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 등록 페이지 > 저장 버튼
     * 송금 > 국내송금 등록
     */
    async function saveFunc() {
        if (!info['connectInquiryNo']) {
            return message.warn('Inquiry No. 가 누락 되었습니다.')
        }

        setLoading(true);

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, [], [])
        commonManage.getUploadList(fileRef, formData)
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await saveRemittance({data: info}).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '💾 국내 송금 등록완료',
                    <>
                        <div>Inquiry No. : {info.connectInquiryNo}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('domestic_remittance_update', v.data?.entity?.remittanceId)
                    },
                    {cursor: 'pointer'}
                )
            } else {
                message.error(v?.data?.message);
            }
        })
        setLoading(false);
    }

    /**
     * @description 등록 페이지 > 초기화 버튼
     * 송금 > 국내송금 등록
     */
    function clearAll() {
        setInfo(getRemittanceInit())
    }

    /**
     * @description 등록 페이지 > Inquiry No. 검색 버튼
     * 송금 > 국내송금 등록
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <Spin spinning={loading}>
            <PanelSizeUtil groupRef={groupRef} storage={'domestic_remittance_write'}/>
            <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                             open={isModalOpen}
                             setIsModalOpen={setIsModalOpen}/>

            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '435px' : '65px'} calc(100vh - ${mini ? 530 : 195}px)`,
                // overflowY: 'hidden',
                rowGap: 10,
            }}>
                <MainCard title={'국내 송금 등록'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    }
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div ref={infoRef}>
                            <TopBoxCard grid={'200px 200px 200px 200px 180px'}>
                                {inputForm({
                                    title: 'Inquiry No.',
                                    id: 'connectInquiryNo',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true,
                                    suffix: <span style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('connectInquiryNo');
                                        }
                                    }>🔍</span>,
                                })}
                                {inputForm({title: '항목번호', id: 'customerName', onChange: onChange, data: info})}
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
                                    <BoxCard title={'확인 정보'}>
                                        {radioForm({
                                            title: '송금 여부',
                                            id: 'isSend',
                                            onChange: onChange,
                                            data: info,
                                            list: [{value: 'O', title: 'O'}, {value: 'X', title: 'X'}]
                                        })}
                                        {radioForm({
                                            title: '계산서 발행 여부',
                                            id: 'isInvoice',
                                            onChange: onChange,
                                            data: info,
                                            list: [{value: 'O', title: 'O'}, {value: 'X', title: 'X'}]
                                        })}
                                        {radioForm({
                                            title: '부분 송금 진행 여부',
                                            id: 'isPartialSend',
                                            onChange: onChange,
                                            data: info,
                                            list: [{value: 'O', title: 'O'}, {value: 'X', title: 'X'}, {value: '', title: '무관'}]
                                        })}
                                        {radioForm({
                                            title: '반려 여부',
                                            id: 'isRejected',
                                            onChange: onChange,
                                            data: info,
                                            list: [{value: 'O', title: 'O'}, {value: 'X', title: 'X'}]
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard title={'금액 정보'}>
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
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={'ETC'}>
                                        {textAreaForm({title: '비고란', rows: 10, id: 'remarks'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                        {/*@ts-ignored*/}
                                        <div style={{overFlowY: "auto", maxHeight: 300}}>
                                            <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                             infoRef={infoRef}/>
                                        </div>
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={remittanceInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'domestic_remittance_write_column'}/>

            </div>
    </Spin>
}
