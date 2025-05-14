import React, {memo, useEffect, useRef, useState} from "react";
import {ModalInitList} from "@/utils/initialList";
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
import {useRouter} from "next/router";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import 'react-splitter-layout/lib/index.css';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import moment from "moment";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {getData} from "@/manage/function/api";
import Table from "@/component/util/Table";
import {orderInfo, projectInfo, rfqInfo} from "@/utils/column/ProjectInfo";
import message from "antd/lib/message";
import {saveProject} from "@/utils/api/mainApi";
import SearchInfoModal from "@/component/SearchAgencyModal";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";

const listType = 'projectDetailList'

function ProjectWrite({copyPageInfo = {}, getPropertyId, layoutRef, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const fileRef = useRef(null);
    const tableRef = useRef(null);
    const [routerId, setRouterId] = useState(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('project_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        getMemberList();
    }, []);

    async function getMemberList() {
        // @ts-ignore
        await getData.post('admin/getAdminList', {
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
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const userInfo = useAppSelector((state) => state.user.userInfo);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        createdBy: userInfo['name'],
        managerAdminName: userInfo['name'],
        writtenDate: moment().format('YYYY-MM-DD'),
    }
    const getProjectInit = () => {
        const copyInit = _.cloneDeep(projectInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState(getProjectInit());
    const getProjectValidateInit = () => _.cloneDeep(projectInfo['write']['validate']);
    const [validate, setValidate] = useState(getProjectValidateInit());

    const [fileList, setFileList] = useState([]);
    const [tableData, setTableData] = useState([]);

    const tempData = [
        {calcCheck: false, connectInquiryNo: '', model: '111', item: '11111', maker: '1', unit: 'ea', quantity: '', currencyUnit: 'KRW', requestDeliveryDate: '', remarks: '비고 1'},
        {calcCheck: false, connectInquiryNo: '', model: '222', item: '22222', maker: '2', unit: 'ea', quantity: '', currencyUnit: 'KRW', requestDeliveryDate: '', remarks: '비고 2'},
        {calcCheck: false, connectInquiryNo: '', model: '333', item: '33333', maker: '3', unit: 'ea', quantity: '', currencyUnit: 'KRW', requestDeliveryDate: '', remarks: '비고 3'},
        {calcCheck: false, connectInquiryNo: '', model: '444', item: '44444', maker: '4', unit: 'ea', quantity: '', currencyUnit: 'KRW', requestDeliveryDate: '', remarks: '비고 4'},
        {calcCheck: false, connectInquiryNo: '', model: '555', item: '55555', maker: '5', unit: 'ea', quantity: '', currencyUnit: 'KRW', requestDeliveryDate: '', remarks: '비고 5'}
    ]

    useEffect(() => {
        setLoading(true);
        setValidate(getProjectValidateInit());
        setInfo(getProjectInit());
        setFileList([]);
        setTableData([]);
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            // setTableData(commonFunc.repeatObject(projectInfo['write']['defaultData'], 1000))
            setTableData([...tempData, ...commonFunc.repeatObject(projectInfo['write']['defaultData'], 1000 - tempData.length)])
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...getProjectInit(),
                ...copyPageInfo,
                writtenDate: moment().format('YYYY-MM-DD')
            });
            setTableData(copyPageInfo[listType]);
            setRouterId(null);
        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);

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

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if (activeTab?.renderedName === '프로젝트 등록') {
                saveFunc()
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    /**
     * @description 등록 페이지 > 저장 버튼
     * 프로젝트 > 프로젝트 등록
     */
    async function saveFunc() {


        if (!commonManage.checkValidate(info, projectInfo['write']['validationList'], setValidate)) return;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터가 1개 이상이여야 합니다.');
        }
        const emptyQuantity = filterTableList.filter(v => !v.quantity)
        if (emptyQuantity.length) {
            return message.error('하위 데이터의 수량을 입력해야 합니다.')
        }

        // const resultFilterTableList = filterTableList.map(v => {
        //     delete v.total;
        //     delete v.totalPurchase;
        //     return {
        //         ...v,
        //         unitPrice: isNaN(v.unitPrice) ? '' : v.unitPrice,
        //         purchasePrice: isNaN(v.purchasePrice) ? '' : v.purchasePrice
        //     }
        //
        // })
        //
        // if (!resultFilterTableList.length) {
        //     return message.warn('하위 데이터 1개 이상이여야 합니다');
        // }

        setLoading(true)

        const findMember = memberList.find(v => v.adminId === parseInt(info['managerAdminId']));
        info['managerAdminName'] = findMember['name'];

        const formData: any = new FormData();
        // commonManage.setInfoFormData(infoData, formData, listType, resultFilterTableList)
        commonManage.setInfoFormData(info, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);

        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await saveProject({data: formData, router: router, returnFunc: returnFunc})
        setLoading(false);
    }

    async function returnFunc(e, data, msg) {
        const dom = infoRef.current.querySelector('#documentNumberFull');
        if (e === 1) {
            setRouterId(data?.projectId)
            window.postMessage({message: 'reload', target: 'project_read'}, window.location.origin);
            notificationAlert('success', '💾프로젝트 등록완료',
                <>
                    <div>Project No. : {dom.value}</div>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , function () {
                    getPropertyId('project_update', data?.projectId)
                },
                {cursor: 'pointer'}
            )
            clearAll();
            getPropertyId('project_update', data?.projectId)
        } else if (e === -20001) {
            setValidate(v => {
                return {...v, documentNumberFull: false}
            })
            message.error(msg);
        } else {
            notificationAlert('error', '⚠️ 작업실패',
                <>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , function () {
                    alert('작업 로그 페이지 참고')
                },
                {cursor: 'pointer'}
            )
        }
    }

    /**
     * @description 등록 페이지 > 초기화 버튼
     * 프로젝트 > 프로젝트 등록
     */
    function clearAll() {
        setLoading(true);
        setValidate(getProjectValidateInit());
        setInfo(getProjectInit());
        setFileList([]);

        function calcData(sourceData) {
            const keyOrder = Object.keys(projectInfo['write']['defaultData']);
            return sourceData
                .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
                .map(projectInfo['write']['excelExpert'])
                .concat(projectInfo['write']['totalList']); // `push` 대신 `concat` 사용
        }
        // tableRef.current?.hotInstance?.loadData(calcData(commonFunc.repeatObject(projectInfo['write']['defaultData'], 1000)));
        setTableData(calcData(commonFunc.repeatObject(projectInfo['write']['defaultData'], 1000)))
        setLoading(false);
    }

    /**
     * @description 둥록 페이지 > 견적의뢰 이동 버튼
     * 프로젝트 > 프로젝트 등록
     * 선택된 Item을 가지고 견적의뢰 작성 페이지로 이동
     */
    function copyPage () {
        const totalList = tableRef.current.getSourceData().slice(0, -1);
        // totalList.pop();
        const checkedList = totalList.filter(v => v.check);
        console.log(checkedList);

        if (!checkedList?.length) {
            return message.warn('선택한 데이터가 1개 이상이여야 합니다.');
        }

        const copyInfo = _.cloneDeep(info);

        const list = checkedList.map(v=>{
            return {
                model : v.model,
                quantity : v.quantity,
                unit : v.unit,
                currencyUnit : v.currencyUnit,
                remarks: v.remarks
            }
        })
        copyInfo['estimateRequestDetailList'] = [...list, ...commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000 - list.length)];
        getCopyPage('rfq_write', { ...copyInfo, _meta: {updateKey: Date.now()}})
    }

    /**
     * @description 등록 페이지 > 돋보기 버튼
     * 프로젝트 > 프로젝트 등록
     * 고객사 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <Spin spinning={loading}>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo} open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>
        <PanelSizeUtil groupRef={groupRef} storage={'project_write'}/>
        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '485px' : '65px'} calc(100vh - ${mini ? 580 : 160}px)`,
            rowGap: 10
        }}>
            <MainCard title={'프로젝트 등록'} list={[
                // {
                //     name: <div style={{opacity: routerId ? 1 : 0.5}}><ArrowRightOutlined style={{paddingRight: 8}}/>수정페이지
                //         이동</div>, func: moveUpdate, type: ''
                // },
                {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div>
                        <TopBoxCard title={''} grid={'110px 80px 80px'}>
                            {datePickerForm({
                                title: '작성일자',
                                id: 'writtenDate',
                                disabled: true,
                                data: info
                            })}
                            {inputForm({
                                title: '작성자',
                                id: 'createdBy',
                                disabled: true,
                                data: info
                            })}
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
                        </TopBoxCard>

                        <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                    style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProject')}>
                                    {inputForm({
                                        title: 'Project No.',
                                        id: 'documentNumberFull',
                                        onChange : onChange,
                                        data: info,
                                        validate: validate['documentNumberFull'],
                                        key: validate['documentNumberFull']
                                    })}
                                    {inputForm({
                                        title: '프로젝트 제목',
                                        id: 'projectTitle',
                                        onChange : onChange,
                                        data: info,
                                        validate: validate['projectTitle'],
                                        key: validate['projectTitle']
                                    })}
                                    {datePickerForm({title: '마감일자', id: 'dueDate', onChange: onChange, data: info})}
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
                                        handleKeyPress: handleKeyPress,
                                        onChange : onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자명',
                                        id: 'customerManagerName',
                                        onChange : onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '전화번호',
                                        id: 'customerManagerPhone',
                                        onChange : onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '이메일',
                                        id: 'customerManagerEmail',
                                        onChange : onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
                                    {textAreaForm({
                                        title: '비고란',
                                        rows: 2,
                                        id: 'remarks',
                                        onChange : onChange,
                                        data: info
                                    })}
                                    {textAreaForm({
                                        title: '지시사항',
                                        rows: 2,
                                        id: 'instructions',
                                        onChange : onChange,
                                        data: info
                                    })}
                                    {textAreaForm({
                                        title: '특이사항',
                                        rows: 2,
                                        id: 'specialNotes',
                                        onChange : onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={15} maxSize={100}>
                                <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}
                                         disabled={!userInfo['microsoftId']}>

                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     info={info}/>

                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                        </PanelGroup>
                    </div> : <></>}
            </MainCard>

            <Table data={tableData} column={projectInfo['write']} funcButtons={['print']} ref={tableRef}
                   infoRef={infoRef} type={'project_write_column'} customFunc={copyPage}/>
        </div>
    </Spin>
}

export default memo(ProjectWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});