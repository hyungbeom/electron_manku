import React, {memo, useEffect, useRef, useState} from "react";
import {
    CopyOutlined,
    DeleteOutlined,
    FormOutlined,
    RadiusSettingOutlined,
    SendOutlined,
    SettingOutlined
} from "@ant-design/icons";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    tooltipInfo,
    TopBoxCard
} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {findCodeInfo} from "@/utils/api/commonApi";
import {getAttachmentFileList, updateRfq} from "@/utils/api/mainApi";
import {rfqWriteInitial} from "@/utils/initialList";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import Table from "@/component/util/Table";
import {estimateInfo, rfqInfo} from "@/utils/column/ProjectInfo";
import moment from "moment/moment";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import _ from "lodash";
import {Actions} from "flexlayout-react";

const listType = 'estimateRequestDetailList'

function RqfUpdate({
                       updateKey = {},
                       getCopyPage = null,
                       getPropertyId = null,
                       layoutRef
                   }: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const fileRef = useRef(null);
    const gridRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('rfq_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        getMemberList();
    }, []);

    async function getMemberList() {
        // @ts-ignore
        return await getData.post('admin/getAdminList', {
            "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
            "searchAuthority": null,    // 1: 일반, 0: 관리자
            "page": 1,
            "limit": -1
        }).then(v => {
            setMemberList(v.data.entity.adminList)
        })
    }

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false, event3: false});

    const userInfo = useAppSelector((state) => state.user);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getRfqInit = () => {
        const copyInit = _.cloneDeep(rfqInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState(getRfqInit());
    const getRfqValidateInit = () => _.cloneDeep(rfqInfo['write']['validate']);
    const [validate, setValidate] = useState(getRfqValidateInit());

    const [fileList, setFileList] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setValidate(getRfqValidateInit());
        setInfo(getRfqInit());
        setFileList([]);
        setOriginFileList([]);
        setTableData([]);
        getDataInfo().then(v => {
            if (v) {
                const {estimateRequestDetail, attachmentFileList} = v;


                console.log(estimateRequestDetail?.folderId,'?????????????????????????')
                /**
                 * 개선사항
                 * 견적의뢰 수정시 드라이브 목록 '업체회신자료'로 자동 선택
                 * uploadType 0에서 1로 수정
                 */
                setInfo({
                    ...getRfqInit(),
                    ...estimateRequestDetail,
                    uploadType: 1,
                    managerAdminId: estimateRequestDetail['managerAdminId'] ? estimateRequestDetail['managerAdminId'] : '',
                    managerAdminName: estimateRequestDetail['managerAdminName'] ? estimateRequestDetail['managerAdminName'] : '',
                    createdBy: estimateRequestDetail['createdBy'] ? estimateRequestDetail['createdBy'] : ''
                });
                //
                setFileList(fileManage.getFormatFiles(attachmentFileList));
                setOriginFileList(attachmentFileList);
                estimateRequestDetail[listType] = [...estimateRequestDetail[listType], ...commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000 - estimateRequestDetail[listType].length)]
                setTableData(estimateRequestDetail[listType]);
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['rfq_update']])

    async function getDataInfo() {
        const result = await getData.post('estimate/getEstimateRequestDetail', {
            "estimateRequestId": updateKey['rfq_update']
        });
        return result?.data?.entity;
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal)
                    break;
            }
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)

        // 값 입력되면 유효성 초기화
        const { id, value } = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 수정 페이지 > 메일 발송 처리 버튼
     * 견적의뢰 > 견적의뢰 수정
     */
    function checkSend() {
        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])

        const result = filterTableList.map(src => {
            return {
                estimateRequestDetailId: src.estimateRequestDetailId,
                "sentStatus": "전송"
            }
        });

        getData.post('estimate/updateSentStatuses', {sentStatusList: result}).then(v => {
            if (v.data.code === 1) {
                message.success('발송처리가 완료되었습니다.')
            } else {
                message.error(v?.data?.message);
            }
        })
    }

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if (activeTab?.renderedName === '견적의뢰 수정') {
                saveFunc();
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    /**
     * @description 수정 페이지 > 수정 버튼
     * 견적의뢰 > 견적의뢰 수정
     */
    async function saveFunc() {
        console.log(info, 'info:::')

        // 유효성 체크 추가
        if(!commonManage.checkValidate(info, rfqInfo['write']['validationList'], setValidate)) return;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터가 1개 이상이여야 합니다.');
        }
        const emptyQuantity = filterTableList.filter(v => !v.quantity)
        if (emptyQuantity.length) {
            return message.error('하위 데이터의 수량을 입력해야 합니다.')
        }

        const findMember = memberList.find(v => v.adminId === parseInt(info['managerAdminId']));
        info['managerAdminName'] = findMember['name'];

        setLoading(true);

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)
        formData.delete('createdDate');
        formData.delete('modifiedDate');
        await updateRfq({data: formData, returnFunc: returnFunc})
        setLoading(false);
    }

    async function returnFunc(v) {
        if (v.code === 1) {
            await getAttachmentFileList({
                data: {
                    "relatedType": "ESTIMATE_REQUEST",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": updateKey['rfq_update']
                }
            }).then(v => {
                // const list = fileManage.getFormatFiles(v);
                // setFileList(list)
                // setOriginFileList(list)

                window.postMessage({message: 'reload', target: 'rfq_read'}, window.location.origin);
                notificationAlert('success', '💾 견적의뢰 수정완료',
                    <>
                        <div>의뢰자료 No. : {info.documentNumberFull}</div>
                        <div>등록일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('rfq_update', updateKey['rfq_update'])
                    },
                    {cursor: 'pointer'}
                )
            })
        } else {
            notificationAlert('error', '⚠️ 작업실패',
                <>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , function () {
                    alert('관리자 로그 페이지 참고')
                },
                {cursor: 'pointer'}
            )
        }
    }

    /**
     * @description 수정 페이지 > 삭제 버튼
     * 견적의뢰 > 견적의뢰 수정
     */
    function deleteFunc() {
        setLoading(true)
        getData.post('estimate/deleteEstimateRequest', {estimateRequestId: updateKey['rfq_update']}).then(v => {
            const {code, message} = v.data;
            if (code === 1) {
                window.postMessage({message: 'reload', target: 'rfq_read'}, window.location.origin);

                notificationAlert('success', '🗑️견적의뢰 삭제완료',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('rfq_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'rfq_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        console.log(v?.data?.message);
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
            }
        }, err => setLoading(false))
        setLoading(true)
    }

    /**
     * @description 수정 페이지 > 초기화 버튼
     * 견적의뢰 > 견적의뢰 수정
     */
    function clearAll() {
        setInfo(v => {
            return {
                ...rfqWriteInitial,
                documentNumberFull: v.documentNumberFull,
                writtenDate: v.writtenDate,
                createdBy: v.createdBy,
                managerAdminName: v.managerAdminName,
                managerAdminId: v?.managerAdminId ? v?.managerAdminId : 0
            }
        });
        setTableData(commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000))
    }

    /**
     * @description 수정 페이지 > 복제 버튼
     * 견적의뢰 > 견적의뢰 수정
     */
    function copyPage() {
        const copyInfo = _.cloneDeep(info);
        copyInfo['documentNumberFull'] = '';
        copyInfo['uploadType'] = 0;
        copyInfo['folderId'] = '';
        const totalList = tableRef.current.getSourceData();
        totalList.pop();
        const list = totalList.map(v=>{
            return {
                model : v.model,
                quantity : v.quantity,
                unit : v.unit,
                currencyUnit : v.currencyUnit,
            }
        })
        copyInfo[listType] = [...list, ...commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000 - list.length)];

        console.log(copyInfo, 'copyInfo:::')
        getCopyPage('rfq_write', { ...copyInfo, _meta: {updateKey: Date.now()}})
    }

    /**
     * @description 수정 페이지 > 돋보기 버튼
     * 매입처, 고객사, Maker 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'rfq_update'}/>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}

                         setIsModalOpen={setIsModalOpen}/>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 495 : 65}px calc(100vh - ${mini ? 590 : 195}px)`,
                rowGap: 10,
            }}>
                <MainCard title={'견적의뢰 수정'} list={[
                    {
                        name: <div><SettingOutlined style={{paddingRight: 8}}/>메일 발송 처리</div>,
                        func: checkSend,
                        type: 'mail'
                    },
                    {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                    {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                    // {
                    //     name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                    //     func: clearAll,
                    //     type: 'danger'
                    // },
                    {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: ''}
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard title={''} grid={'110px 80px 80px 110px 110px 110px 300px'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    data: info
                                })}
                                {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
                                <div>
                                    {selectBoxForm({
                                        title: '담당자',
                                        id: 'managerAdminId',
                                        onChange: onChange,
                                        data: info,
                                        validate: validate['managerAdminId'],
                                        list: memberList?.map((item) => ({
                                            ...item,
                                            value: item.adminId,
                                            label: item.name,
                                        }))
                                    })}
                                </div>
                                {inputForm({
                                    title: '의뢰자료 No.',
                                    id: 'documentNumberFull',
                                    data: info,
                                    disabled: true,
                                    placeHolder: '자동생성'
                                })}
                                {datePickerForm({
                                    title: '마감일자(예상)', id: 'dueDate'
                                    , onChange: onChange, data: info
                                })}
                                {inputForm({
                                    title: 'RFQ No.',
                                    id: 'rfqNo',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'PROJECT NAME',
                                    id: 'projectTitle',
                                    onChange: onChange,
                                    data: info
                                })}
                            </TopBoxCard>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={'매입처 정보'} tooltip={tooltipInfo('agency')}>
                                        {inputForm({
                                            title: '매입처코드',
                                            id: 'agencyCode',
                                            suffix: <span style={{cursor: 'pointer'}} onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    openModal('agencyCode');
                                                }
                                            }>🔍</span>,
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info,
                                            validate: validate['agencyCode'],
                                            key: validate['agencyCode']
                                        })}
                                        {inputForm({
                                            title: '회사명',
                                            id: 'agencyName',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '담당자',
                                            id: 'agencyManagerName',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'agencyTel',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'agencyManagerEmail',
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
                                        {inputForm({
                                            title: '고객사명',
                                            id: 'customerName',
                                            suffix: <span style={{cursor: 'pointer'}} onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    openModal('customerName');
                                                }
                                            }>🔍</span>,
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '담당자명',
                                            id: 'managerName',
                                            onChange: onChange,
                                            data: info,
                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'phoneNumber',
                                            onChange: onChange,
                                            data: info,
                                        })}
                                        {inputForm({
                                            title: '팩스',
                                            id: 'faxNumber',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'customerManagerEmail',
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={'Maker 정보'} tooltip={tooltipInfo('maker')}>
                                        {inputForm({
                                            title: 'Maker',
                                            id: 'maker',
                                            suffix: <span style={{cursor: 'pointer'}} onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    openModal('maker');
                                                }
                                            }>🔍</span>,
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: 'Item',
                                            id: 'item',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {textAreaForm({
                                            title: '지시사항',
                                            id: 'instructions',
                                            onChange: onChange,
                                            data: info,
                                            rows: 7
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={'ETC'} tooltip={tooltipInfo('etc')}>
                                        {inputForm({
                                            title: 'End User',
                                            id: 'endUser',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {textAreaForm({
                                            title: '비고란',
                                            rows: 10,
                                            id: 'remarks',
                                            onChange: onChange,
                                            data: info,
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={5}>
                                    <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}
                                             disabled={!userInfo['microsoftId']}>

                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                         info={info} type={'rfq'}/>
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[5]} minSize={0}></Panel>
                            </PanelGroup>
                        </div>: <></>}
                </MainCard>

                <Table data={tableData} column={rfqInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'rfq_write_column'} infoRef={infoRef} />
            </div>
        </>
    </Spin>
}

export default memo(RqfUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});