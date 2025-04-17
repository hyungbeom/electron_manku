import React, {memo, useEffect, useRef, useState} from "react";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {ModalInitList} from "@/utils/initialList";
import message from "antd/lib/message";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
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
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData, getFormData} from "@/manage/function/api";
import moment from "moment";
import Spin from "antd/lib/spin";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {rfqInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import SearchAgencyModal_test from "@/component/SearchAgencyModal_test";

const listType = 'estimateRequestDetailList'

function RqfWrite({copyPageInfo = {}, getPropertyId, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const checkInfoRef = useRef<any>({
        info: {},
        table: []
    })
    const [memberList, setMemberList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [validate, setValidate] = useState({agencyCode: true, managerAdminId: true});


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


    const fileRef = useRef(null);
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null)


    const copyInit = _.cloneDeep(rfqInfo['defaultInfo'])


    const userInfo = useAppSelector((state) => state.user);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }

    const infoInit = {
        ...copyInit,
        ...adminParams,
        writtenDate: moment().format('YYYY-MM-DD')
    }

    const [info, setInfo] = useState<any>(infoInit)

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            setInfo(infoInit)
            setTableData(commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000))
        } else {
            setInfo({
                ...copyPageInfo, ...adminParams,
                documentNumberFull: '',
                writtenDate: moment().format('YYYY-MM-DD')
            });
            setTableData(copyPageInfo[listType]);
        }
    }, [copyPageInfo]);


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

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)

        if (e.target.id === 'agencyCode' && !validate['agencyCode']) {
            setValidate(v => {
                return {...v, agencyCode: true}
            })
        }
        if (e.target.id === 'managerAdminId' && !validate['managerAdminId']) {
            setValidate(v => {
                return {...v, managerAdminId: true}
            })
        }

    }

    async function saveFunc() {

        let infoData = _.cloneDeep(info);


        const findMember = memberList.find(v => v.adminId === parseInt(info['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];

        setLoading(true);
        setLoading(false);


        // 중복 저장을 막기 위한 로직
        if (infoData['documentNumberFull']) {
            delete checkInfoRef.current['info']['documentNumberFull']
            const copyData = {...infoData};
            delete copyData['documentNumberFull']

            if (JSON.stringify(copyData) === JSON.stringify(checkInfoRef.current['info'])) {
                setLoading(false);
                return false
            } else {
                checkInfoRef.current['info'] = infoData;
            }
        }

        if (!infoData['managerAdminId']) {
            setValidate(v => {
                return {...v, managerAdminId: false}
            })
            setLoading(false);
            return message.warn('담당자가 누락되었습니다.')
        }
        if (!infoData['agencyCode']) {
            setValidate(v => {
                return {...v, agencyCode: false}
            })
            setLoading(false);
            return message.warn('매입처 코드가 누락되었습니다.')
        }

        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            setLoading(false);
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        const emptyQuantity = filterTableList.filter(v => !v.quantity)
        if (emptyQuantity.length) {
            setLoading(false);
            return message.error('수량을 입력해야 합니다.')
        }
        // setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(infoData, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        formData.delete('createdDate')
        formData.delete('modifiedDate')


        await getFormData.post('estimate/addEstimateRequest', formData).then(async (v: any) => {
            const {code, entity} = v?.data;
            if (code === 1) {
                const {documentNumberFull, estimateRequestId} = entity;
                getPropertyId('rfq_update', estimateRequestId);
                clearAll()

                notificationAlert('success', '💾견적의뢰 등록완료',
                    <>
                        <div>의뢰자료 No. : {documentNumberFull}</div>
                        <div>등록일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('rfq_update', estimateRequestId)
                    },
                    {cursor: 'pointer'}
                )
                checkInfoRef.current['info'] = infoData
                setLoading(false);

            } else {
                setLoading(false)
            }
        }, err => setLoading(false))
    }


    /**
     * @description 등록 페이지 > 초기화 버튼
     * 견적의뢰 > 견적의뢰 등록
     */
    function clearAll() {
        setInfo(infoInit)

        function calcData(sourceData) {
            const keyOrder = Object.keys(rfqInfo['write']['defaultData']);
            return sourceData
                .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
                .map(rfqInfo['write']['excelExpert'])
                .concat(rfqInfo['write']['totalList']); // `push` 대신 `concat` 사용
        }

        tableRef.current?.hotInstance?.loadData(calcData(commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000)));
        setFileList([])
    }


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('rfq_write');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 25, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes] = useState(getSavedSizes); // 패널 크기 상태

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if (activeTab?.renderedName === '견적의뢰 등록') {
                saveFunc()
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    console.log(info)

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'rfq_write'}/>
        <SearchAgencyModal_test info={info} setInfo={setInfo}
                                open={isModalOpen}
                                setIsModalOpen={setIsModalOpen}/>

        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 495 : 65}px calc(100vh - ${mini ? 590 : 195}px)`,
                rowGap: 10,
            }}>

                <MainCard title={'견적의뢰 작성'} list={[

                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    }
                ]} mini={mini} setMini={setMini}>
                    <div id={'agencyId'}/>
                    <div id={'agencyManagerPhoneNumber'}/>
                    {mini ? <div>
                            <TopBoxCard title={''} grid={'100px 80px 80px 110px 110px 110px 300px'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    onChange: onChange,
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
                                    onChange: onChange,
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
                                            validate: validate['agencyCode']
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

                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} infoRef={infoRef}
                                                         fileRef={fileRef}/>
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[5]} minSize={0}>
                                </Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={rfqInfo['write']} funcButtons={['print']} ref={tableRef}
                       infoRef={infoRef} type={'rfq_write_column'}/>
            </div>
        </>
    </Spin>
}

export default memo(RqfWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});