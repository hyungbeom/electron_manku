import React, {memo, useEffect, useRef, useState} from "react";
import {DownloadOutlined, RadiusSettingOutlined, RollbackOutlined, SaveOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import {BoxCard, datePickerForm, inputForm, MainCard, SelectForm, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import _ from "lodash";
import {saveOrder} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData} from "@/manage/function/api";
import Spin from "antd/lib/spin";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import PrintPo from "@/component/printPo";
import moment from "moment/moment";
import {estimateInfo, orderInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {Switch} from "antd";
import {findCodeInfo} from "@/utils/api/commonApi";

const listType = 'orderDetailList'

function OrderWrite({copyPageInfo, getPropertyId, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null);
    const fileRef = useRef(null);
    const uploadRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('order_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 20]; // 기본값 [50, 50, 50]
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
            setMemberList(v?.data?.entity?.adminList)
        })
    }


    const options = memberList?.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false, event3: false});
    const [fileList, setFileList] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);
    const [tableData, setTableData] = useState([]);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const userInfo = useAppSelector((state) => state.user.userInfo);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
        managerId: userInfo['name'],
        managerPhoneNumber: userInfo['contactNumber'],
        managerFaxNumber: userInfo['faxNumber'],
        managerEmail: userInfo['email'],
        estimateManager: userInfo['name'],
        createdId: 0,
        customerId: 0
    }
    const getOrderInit = () => {
        const copyInit = _.cloneDeep(orderInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState<any>(getOrderInit())
    const getOrderValidateInit = () => _.cloneDeep(orderInfo['write']['validate']);
    const [validate, setValidate] = useState(getOrderValidateInit());

    const [isFolderId, setIsFolderId] = useState(false);
    const [driveKey, setDriveKey] = useState(0);

    useEffect(() => {
        setLoading(true);
        setValidate(getOrderValidateInit());
        setInfo(getOrderInit());
        setFileList([]);
        setDriveKey(prev => prev + 1);
        setOriginFileList([]);
        setTableData([]);
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setTableData(commonFunc.repeatObject(orderInfo['write']['defaultData'], 1000));
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...getOrderInit(),
                ...copyPageInfo['info'],
                writtenDate: moment().format('YYYY-MM-DD')
            });
            setTableData(copyPageInfo[listType]);
            if (!copyPageInfo?.agencyCode?.toUpperCase().startsWith('K')) setCheck(true);
        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);

    async function handleKeyPress(e) {
        console.log(e.key)
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'agencyCode' :

                    await findCodeInfo(e, setInfo, openModal,'agencyCode_domestic')
                    break;
                case 'customerName' :
                    await findCodeInfo(e, setInfo, openModal)
                    break;
                case 'ourPoNo' :

                    const connValue = e.target.value
                    if (!e.target.value) {
                        return message.warn('만쿠견적서 No.를 입력해주세요.');
                    }
                    setLoading(true);
                    await getData.post('estimate/getEstimateDetail', {
                        estimateId: '',
                        documentNumberFull: e.target.value.toUpperCase()
                    }).then(async v => {
                        if (v?.data?.code === 1) {
                            const {estimateDetail = {}, attachmentFileList = []} = v?.data?.entity;
                            if (!isEmptyObj(estimateDetail)) {
                                setLoading(false);
                                return message.warn('조회데이터가 없습니다.')
                            }
                            setInfo(getOrderInit());
                            setFileList([]);
                            setOriginFileList([]);

                            // const result = await findDocumentInfo(e, setInfo);
                            await getData.post('estimate/generateDocumentNumberFull', {
                                type: 'ORDER',
                                documentNumberFull: info?.ourPoNo?.toUpperCase()
                            }).then(async src => {
                                const manager = estimateDetail?.managerAdminId;
                                const findManager = memberList.find(v => v.adminId === manager)

                                let result = 1;
                                if(estimateDetail?.connectDocumentNumberFull) {

                                    const source = await getData.post('estimate/getEstimateRequestDetail', {
                                        estimateRequestId: '',
                                        documentNumberFull: estimateDetail?.connectDocumentNumberFull?.toUpperCase()
                                    })


                                    const list = source.data.entity.estimateRequestDetail?.estimateRequestDetailList || [];
                                    // 숫자인 deliveryDate만 필터링
                                    const validDates = list
                                        .map(item => Number(item.deliveryDate))
                                        .filter(date => !isNaN(date) && date > 0);

                                     result = validDates.length > 0 ? Math.max(...validDates) : 1;

                                }

                                setInfo({
                                    ...getOrderInit(),
                                    ...estimateDetail,
                                    documentNumberFull: src?.data?.code === 1 ? src?.data?.entity?.newDocumentNumberFull : '',
                                    ourPoNo: connValue,
                                    estimateManager: findManager?.name,
                                    customerManagerName: estimateDetail?.managerName,
                                    customerManagerPhoneNumber: estimateDetail?.phoneNumber,
                                    customerManagerEmail: estimateDetail?.customerManagerEmail,
                                    customerManagerFaxNumber: estimateDetail?.faxNumber,
                                    sendTerms: !isNaN(estimateDetail?.delivery) ? moment().add(parseInt(estimateDetail?.delivery), 'weeks').format('YYYY-MM-DD') : null,
                                    deliveryTerms: !isNaN(result) ? moment().add(result, 'weeks').format('YYYY-MM-DD') : null,
                                    delivery: estimateDetail?.deliveryDate ? estimateDetail.deliveryDate : '',
                                    managerAdminId: adminParams['managerAdminId'],
                                    managerAdminName: adminParams['managerAdminName'],
                                    createdBy: adminParams['createdBy'],
                                    paymentTerms: '발주시 50% / 납품시 50%',
                                    writtenDate: moment().format('YYYY-MM-DD'),
                                    managerId: adminParams['managerId'],
                                    managerPhoneNumber: adminParams['managerPhoneNumber'],
                                    managerFaxNumber: adminParams['managerFaxNumber'],
                                    managerEmail: adminParams['managerEmail']
                                })
                                // folderId 가져오면 연결 inquiry 수정 못하게 막기
                                if (estimateDetail.folderId) setIsFolderId(true);
                                // setFileList(fileManage.getFormatFiles(src?.data?.entity.attachmentFileList));
                                setFileList(fileManage.getFormatFiles(attachmentFileList));
                                if (estimateDetail?.estimateDetailList?.length) {
                                    const copyList = estimateDetail.estimateDetailList.map(v => {
                                        return {...v, currency: v.currencyUnit}
                                    })
                                    setTableData([...copyList, ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000 - estimateDetail?.estimateDetailList.length)])
                                }
                            })
                                .finally(() => {
                                    setLoading(false);
                                });
                        }
                    })
                        .finally(() => {
                            setLoading(false);
                        });
                    break;
                // await findOrderDocumentInfo(e, setInfo, setTableData, memberList)
            }
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)

        // 값 입력되면 유효성 초기화
        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 등록 페이지 > 발주서 출력 버튼
     * 발주서 > 발주서 등록
     */
    function printPo() {
        setIsModalOpen({event1: false, event2: false, event3: true});
    }

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if (activeTab?.renderedName === '국내발주서 등록') {
                saveFunc();
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    /**
     * @description 등록 페이지 > 저장 버튼
     * 발주서 > 발주서 등록
     */
    async function saveFunc() {

        if (!commonManage.checkValidate(info, orderInfo['write']['validationList'], setValidate)) return;

        const admin = memberList.find(v => v.adminId === parseInt(info.managerAdminId));
        info.managerAdminName = admin?.name;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터가 1개 이상이여야 합니다.');
        }
        const emptyQuantity = filterTableList.filter(v => !v.quantity)
        if (emptyQuantity.length) {
            return message.error('하위 데이터의 수량을 입력해야 합니다.')
        }

        setLoading(true);

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);

        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await saveOrder({data: formData, router: router, returnFunc: returnFunc})
        setLoading(false);
    }

    async function returnFunc(code, msg, data) {
        if (code === 1) {
            window.postMessage({message: 'reload', target: 'order_read'}, window.location.origin);
            notificationAlert('success', '💾 국내발주서 등록완료',
                <>
                    <div>Inquiry No. : {info.documentNumberFull}</div>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , function () {
                    getPropertyId('order_update', data?.orderId)
                },
                {cursor: 'pointer'}
            )
            clearAll();
            getPropertyId('order_update', data?.orderId);
        } else if (code === -20001) {
            setValidate(v => {
                return {...v, documentNumberFull: false}
            })
            message.warn(msg);
        } else {
            console.warn(msg);
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
     * 발주서 > 발주서 등록
     */
    function clearAll() {
        setLoading(true);
        setValidate(getOrderValidateInit());
        setInfo(getOrderInit());
        setFileList([]);
        setOriginFileList([]);

        setIsFolderId(false);

        function calcData(sourceData) {
            const keyOrder = Object.keys(orderInfo['write']['defaultData']);
            return sourceData
                .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
                .map(orderInfo['write']['excelExpert'])
                .concat(orderInfo['write']['totalList']); // `push` 대신 `concat` 사용
        }

        setTableData(calcData(commonFunc.repeatObject(orderInfo['write']['defaultData'], 1000)))
        setLoading(false);
    }

    /**
     * @description 등록 페이지 > 돋보기 버튼
     * 발주서 > 발주서 등록
     * 매입처, 고객사 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    /**
     * @description 등록 페이지 > 결제 조건 토글 버튼
     * 발주서 > 발주서 등록
     */
    const [check, setCheck] = useState(false)

    const switchChange = (checked: boolean) => {
        setCheck(checked)
        info.paymentTerms = !checked ? '발주시 50% / 납품시 50%' : 'By in advance T/T';
    };

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'order_write'}/>
        {(isModalOpen['event1'] || isModalOpen['agencyCode_domestic'] || isModalOpen['event2'] || isModalOpen['customerName']) &&
            <SearchInfoModal infoRef={infoRef} setInfo={setInfo}
                             open={isModalOpen}

                             setIsModalOpen={setIsModalOpen}/>}
        <>
            {isModalOpen['event3'] &&
                <PrintPo info={info} tableRef={tableRef} isModalOpen={isModalOpen}
                         setIsModalOpen={setIsModalOpen}  type={'ko'}/>}
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '495px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
                rowGap: 10,
            }}>
                <MainCard title={'국내발주서 작성'} list={[
                    // {name: '거래명세표 출력', func: printTransactionStatement, type: 'default'},
                    {name: '국내발주서 출력', func: printPo, type: 'default'},
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    }
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                        <TopBoxCard grid={'110px 70px 70px 120px 120px 120px 120px'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, data: info})}
                            <div>
                                <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>
                                <select name="languages" id="managerAdminId" onChange={e => {
                                    // 담당자 정보가 현재 작성자 정보가 나와야한다고 함
                                    const member = memberList.find(v => v.adminId === parseInt(e.target.value))
                                    const managerInfo = {
                                        managerId: member?.name,
                                        managerAdminId: member?.adminId,
                                        managerPhoneNumber: member?.contactNumber,
                                        managerFaxNumber: member?.faxNumber,
                                        managerEmail: member?.email
                                    }
                                    setInfo(v => ({...v, ...managerInfo}))
                                }} style={{
                                    outline: 'none',
                                    border: '1px solid lightGray',
                                    height: 23,
                                    width: '100%',
                                    fontSize: 12,
                                    paddingBottom: 0.5
                                }} value={info?.managerAdminId ?? ''}>
                                    {
                                        options?.map(v => {
                                            return <option value={v.value}>{v.label}</option>
                                        })
                                    }
                                </select>
                            </div>
                            {inputForm({
                                title: '만쿠견적서 No.',
                                id: 'ourPoNo',
                                suffix: <DownloadOutlined style={{cursor: 'pointer'}} onClick={(e) => {
                                    handleKeyPress({key: 'Enter', target: {id: 'ourPoNo', value: info.ourPoNo}})
                                }}/>,
                                handleKeyPress: handleKeyPress,
                                onChange: onChange,
                                data: info,
                                disabled: isFolderId
                            })}
                            {inputForm({
                                title: '만쿠발주서 No.',
                                id: 'documentNumberFull',
                                onChange: onChange,
                                data: info,
                                validate: validate['documentNumberFull'],
                                key: validate['documentNumberFull']
                            })}
                            {inputForm({title: '고객사발주서 No.', id: 'yourPoNo', onChange: onChange, data: info})}
                            {inputForm({
                                title: 'Project No.',
                                id: 'rfqNo',
                                onChange: onChange,
                                data: info
                            })}
                        </TopBoxCard>
                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'매입처 정보'}>
                                    {inputForm({
                                        title: '매입처 코드',
                                        id: 'agencyCode',
                                        suffix: <span style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('agencyCode_domestic');
                                            }
                                        }>🔍</span>,
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info,
                                        validate: validate['agencyCode'],
                                        key: validate['agencyCode']
                                    })}
                                    {inputForm({title: '회사명', id: 'agencyName', onChange: onChange, data: info})}
                                    {inputForm({title: '관리번호', id: 'attnTo', onChange: onChange, data: info})}
                                    {inputForm({title: '담당자', id: 'agencyManagerName', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'고객사 정보'}>
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
                                        id: 'customerManagerName',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '연락처',
                                        id: 'customerManagerPhoneNumber',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '이메일',
                                        id: 'customerManagerEmail',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '팩스',
                                        id: 'customerManagerFaxNumber',
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={<div style={{display: 'flex', justifyContent: 'space-between'}}><span>담당자 정보</span></div>}>
                                    {inputForm({title: '작성자', id: 'managerId', onChange: onChange, data: info})}
                                    {inputForm({
                                        title: 'TEL',
                                        id: 'managerPhoneNumber',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({title: 'Fax', id: 'managerFaxNumber', onChange: onChange, data: info})}
                                    {inputForm({title: 'E-Mail', id: 'managerEmail', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>세부사항</div>
                                </div>}>
                                    <div style={{paddingBottom: 10}}>
                                        <SelectForm id={'paymentTerms'}
                                                    list={!check ?
                                                        ['발주시 50% / 납품시 50%', '현금결제', '선수금', '정기결제'] :
                                                        ['T/T', 'Credit Card', 'Order 30% Before Shipping 70%', 'Order 50% Before Shipping 50%']
                                                    }
                                                    title={'결제조건'}
                                                    onChange={onChange}
                                                    data={info}
                                                    key={info.paymentTerms}
                                        />
                                    </div>
                                    {datePickerForm({
                                        title: '납품 예정일',
                                        id: 'sendTerms',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {datePickerForm({
                                        title: '입고 예정일',
                                        id: 'deliveryTerms',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({title: 'Maker', id: 'maker', onChange: onChange, data: info})}
                                    {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}

                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {inputForm({
                                        title: '견적서담당자',
                                        id: 'estimateManager',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {textAreaForm({
                                        title: '비고란',
                                        rows: 9,
                                        id: 'remarks',
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[5]} minSize={5}>
                                <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     ref={uploadRef}
                                                     info={info} key={driveKey}/>
                                </BoxCard>
                            </Panel>

                        </PanelGroup>
                    </div> : <></>}
                </MainCard>
                <Table data={tableData} column={orderInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'order_write_column'}/>
            </div>
        </>
    </Spin>
}

export default memo(OrderWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});