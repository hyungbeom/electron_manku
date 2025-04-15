import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
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
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {updateRemittance} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {CopyOutlined, DeleteOutlined, FormOutlined} from "@ant-design/icons";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import SearchInfoModal from "@/component/SearchAgencyModal";
import Spin from "antd/lib/spin";
import {remittanceInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import {ModalInitList} from "@/utils/initialList";

const listType = 'list';

export default function DomesticRemittanceUpdate({updateKey, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef(null);
    const fileRef = useRef(null);
    const tableRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_remittance_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const router = useRouter();
    const [mini, setMini] = useState(true);
    const [fileList, setFileList] = useState(fileManage.getFormatFiles([]));
    const [originFileList, setOriginFileList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false)

    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState({})

    async function getDataInfo() {
        const result = await getData.post('remittance/getRemittanceDetail', {
            "remittanceId": updateKey['domestic_remittance_update']
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {remittanceDetail, attachmentFileList} = v;
            setFileList(fileManage.getFormatFiles(attachmentFileList))
            setOriginFileList(attachmentFileList)

            const supplyAmount = Number(remittanceDetail['supplyAmount']);
            setInfo({
                ...remittanceDetail,
                surtax: supplyAmount * 0.1,
                total: supplyAmount + (supplyAmount * 0.1)
            })
            // let copyData = _.cloneDeep(remittanceDetail);
            // copyData['surtax'] = copyData['supplyAmount'] * 0.1
            // copyData['total'] = copyData['supplyAmount'] * 0.1 + parseFloat(remittanceDetail['supplyAmount'])
            // setInfo(copyData);
            // remittanceDetail[listType] = [...commonFunc.repeatObject(remittanceInfo['write']['defaultData'], 1000 - remittanceDetail[listType].length)]
            setTableData(commonFunc.repeatObject(remittanceInfo['write']['defaultData'], 1000))
        })
        setLoading(false)
    }, [updateKey['project_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 송금 > 국내송금 수정
     */
    async function saveFunc() {
        if (!info['connectInquiryNo']) {
            return message.warn('Inquiry No. 가 누락 되었습니다.')
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

    /**
     * @description 수정 페이지 > 삭제 버튼
     * 송금 > 국내송금 수정
     */
    function deleteFunc() {

    }

    /**
     * @description 수정 페이지 > 복제 버튼
     * 송금 > 국내송금 수정
     */
    function copyPage() {
        getCopyPage('domestic_remittance_write', {...info, _meta: {updateKey: Date.now()}});
    }

    /**
     * @description 수정 페이지 > Inquiry No. 검색 버튼
     * 송금 > 국내송금 수정
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'domestic_remittance_update'}/>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>

        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '435px' : '65px'} calc(100vh - ${mini ? 530 : 195}px)`,
            // overflowY: 'hidden',
            rowGap: 10,
        }}>
            <MainCard title={'국내 송금 수정'} list={[
                {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
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
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     infoRef={infoRef}/>
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            <Table data={tableData} column={remittanceInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_remittance_update_column'}/>
        </div>
    </Spin>
}
