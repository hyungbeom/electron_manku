import React, {memo, useEffect, useRef, useState} from "react";
import {printEstimateInitial,} from "@/utils/initialList";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {useRouter} from "next/router";
import {BoxCard, datePickerForm, inputForm, MainCard, SelectForm, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import PrintPo from "@/component/printPo";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {updateOrder} from "@/utils/api/mainApi";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Spin from "antd/lib/spin";
import {orderInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {
    AuditOutlined,
    CopyOutlined,
    DeleteOutlined,
    FileDoneOutlined,
    FormOutlined,
    RollbackOutlined, SettingOutlined
} from "@ant-design/icons";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import useEventListener from "@/utils/common/function/UseEventListener";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import _ from "lodash";
import {Actions} from "flexlayout-react";
import TransactionStatementHeader from "@/component/TransactionStatement/TransactionStatementHeader";
import {Switch} from "antd";
import Button from "antd/lib/button";

const listType = 'orderDetailList'


function OrderUpdate({updateKey, getCopyPage, layoutRef, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const tableRef = useRef(null);
    const fileRef = useRef(null);
    const uploadRef = useRef(null);
    const infoRef = useRef(null);
    const pdfRef = useRef(null);
    const pdfSubRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('order_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 25, 5]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태



    const { userInfo, adminList } = useAppSelector((state) => state.user);

    const options = adminList?.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);
    const [count, setCount] = useState(0);
    const [customerData, setCustomerData] = useState<any>(printEstimateInitial)
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false, event3: false});

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        estimateManager: userInfo['name'],
        createdBy: userInfo['name'],
        managerId: userInfo['name'],
        managerPhoneNumber: userInfo['contactNumber'],
        managerFaxNumber: userInfo['faxNumber'],
        managerEmail: userInfo['email'],
    }
    const getOrderInit = () => {
        const copyInit = _.cloneDeep(orderInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState<any>(getOrderInit());
    const getOrderValidateInit = () => _.cloneDeep(orderInfo['write']['validate']);
    const [validate, setValidate] = useState(getOrderValidateInit());

    const [driveKey, setDriveKey] = useState(0);

    const [fileList, setFileList] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setValidate(getOrderValidateInit());
        setInfo(getOrderInit());
        setFileList([]);
        setDriveKey(prev => prev + 1);
        setOriginFileList([]);
        setTableData([]);
        getDataInfo().then(v => {
            const {orderDetail, attachmentFileList} = v;
            setInfo({
                ...getOrderInit(),
                ...orderDetail,
                managerAdminId: orderDetail['managerAdminId'] ? orderDetail['managerAdminId'] : '',
                managerAdminName: orderDetail['managerAdminName'] ? orderDetail['managerAdminName'] : '',
                createdBy: orderDetail['createdBy'] ? orderDetail['createdBy'] : ''
            })
            setFileList(fileManage.getFormatFiles(attachmentFileList));
            setOriginFileList(attachmentFileList);
            const addOrderList = orderDetail[listType].map(v => {
                return {...v, order: v.quantity}
            });
            orderDetail[listType] = [...addOrderList, ...commonFunc.repeatObject(orderInfo['write']['defaultData'], 1000 - orderDetail[listType].length)]
            setTableData(orderDetail[listType]);

        })
            .finally(() => {
                setLoading(false);
            });
    }, [updateKey['order_update']])

    async function getDataInfo() {
        return await getData.post('order/getOrderDetail', {
            orderId: updateKey['order_update'],
        }).then(v => {
            return v?.data?.entity;
        })
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                    await findCodeInfo(e, setInfo, openModal)
                    // setCheck(!info?.agencyCode?.toUpperCase().startsWith('K'))
                    break;
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
     * @description 수정 페이지 > 거래명세표 출력 버튼
     * 발주서 > 발주서 수정
     */
    async function printTransactionStatement() {
        // alert('쉐어포인트 자동저장')
        setCount(v => v + 1)
        setIsModalOpen(v => {
            return {...v, event1: true}
        })
    }

    /**
     * @description 수정 페이지 > 발주서 출력 버튼
     * 발주서 > 발주서 수정
     */
    function printPo() {
        setCount(v => v + 1)
        setIsModalOpen({event1: false, event2: false, event3: true});
    }

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if (activeTab?.renderedName === '발주서 수정') {
                saveFunc();
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    /**
     * @description 수정 페이지 > 수정 버튼
     * 발주서 > 발주서 수정
     */
    async function saveFunc() {
        console.log(info, 'info:::')

        //유효성 체크
        if (!commonManage.checkValidate(info, orderInfo['write']['validationList'], setValidate)) return;

        const findMember = adminList.find(v => v.adminId === parseInt(info['managerAdminId']));
        console.log(adminList, 'memberList')
        console.log(findMember, 'findMember')
        console.log(info['managerAdminId'], 'info[\'managerAdminId\']')
        info['managerAdminName'] = findMember['name'];
        info['orderId'] = updateKey['order_update']

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        const emptyQuantity = filterTableList.filter(v => !v.quantity)
        if (emptyQuantity.length) {
            return message.error('수량을 입력해야 합니다.')
        }

        setLoading(true);

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateOrder({data: formData, returnFunc: returnFunc});
        setLoading(false);
    }

    async function returnFunc(code, msg, data) {
        if (code === 1) {
            window.postMessage({message: 'reload', target: 'order_read'}, window.location.origin);
            notificationAlert('success', '💾 발주서 수정완료',
                <>
                    <div>Inquiry No. : {info.documentNumberFull}</div>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , null, null, 2
            )
        } else {
            console.warn(msg);
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
     * 발주서 > 발주서 수정
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('order/deleteOrder', {orderId: updateKey['order_update']}).then(v => {
            const {code, message} = v.data;
            if (code === 1) {
                window.postMessage({message: 'reload', target: 'order_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 발주서 삭제완료',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('order_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'order_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                console.log(v?.data?.message);
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
        })
            .catch((err) => {
                notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
                console.error('에러:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    /**
     * @description 수정 페이지 > 초기화 버튼
     * 발주서 > 발주서 수정
     */
    function clearAll() {
        setLoading(true);
        setInfo(getOrderInit());
        setValidate(orderInfo['write']['validate']);

        function calcData(sourceData) {
            const keyOrder = Object.keys(orderInfo['write']['defaultData']);
            return sourceData
                .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
                .map(orderInfo['write']['excelExpert'])
                .concat(orderInfo['write']['totalList']); // `push` 대신 `concat` 사용
        }

        // tableRef.current?.hotInstance?.loadData(calcData(commonFunc.repeatObject(orderInfo['write']['defaultData'], 1000)));
        setTableData(calcData(commonFunc.repeatObject(orderInfo['write']['defaultData'], 1000)))
        setFileList([]);
        setOriginFileList([]);
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 복제 버튼
     * 발주서 > 발주서 수정
     */
    async function copyPage() {
        const copyInfo = {info: _.cloneDeep(info)};
        copyInfo['info']['ourPoNo'] = '';
        copyInfo['info']['documentNumberFull'] = '';
        copyInfo['info']['yourPoNo'] = '';
        copyInfo['info']['folderId'] = '';

        const totalList = tableRef.current.getSourceData();
        totalList.pop();
        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(orderInfo['write']['defaultData'], 1000 - totalList.length)];

        getCopyPage('order_write', {...copyInfo, _meta: {updateKey: Date.now()}})
    }

    /**
     * @description 수정 페이지 > 돋보기 버튼
     * 발주서 > 발주서 수정
     * 매입처, 고객사 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    /**
     * @description 수정 페이지 > 결제 조건 토글 버튼
     * 발주서 > 발주서 수정
     */



    function alertConfirm() {
        getData.post('order/replyStatusConfirm', updateKey['order_update']).then(v => {
            message.success({
                content: '메일회신확인 완료',
                duration: 2, // 3초 후 사라짐
            })
        })
    }

    function getMergePdf(){
        console.log(info.folderId,'info.folderId:')
        getData.post('common/getMergePdf', {folderId : info.folderId}).then(v => {

            if(v?.data.code === 1 && v?.data?.entity){


                const byteCharacters = atob(v?.data?.entity);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);

// Blob 생성
                const blob = new Blob([byteArray], { type: 'application/pdf' });

// Blob URL 생성
                const blobUrl = URL.createObjectURL(blob);

// 새 탭 또는 팝업으로 PDF 열기
                window.open(blobUrl);

            }
        })

    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'order_update'}/>
        {(isModalOpen['agencyCode'] || isModalOpen['customerName']) &&
            <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                             open={isModalOpen}

                             setIsModalOpen={setIsModalOpen}/>}
        <>
            {isModalOpen['event3'] &&
                <PrintPo info={info} tableRef={tableRef} isModalOpen={isModalOpen}
                         setIsModalOpen={setIsModalOpen} type={(info?.agencyCode?.startsWith('K') || info?.agencyCode === 'SK')? 'ko' : 'en'} count={count}/>}
            {isModalOpen['event1'] &&
                <TransactionStatementHeader isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
                                            customerData={customerData}
                                            pdfRef={pdfRef}
                                            tableRef={tableRef}
                                            pdfSubRef={pdfSubRef}
                                            info={info}/>}
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '495px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
                rowGap: 10,
            }}>
                <MainCard title={'발주서 수정'} list={[
                    {
                        name: <div><SettingOutlined style={{paddingRight: 8}}/>요청확인</div>,
                        func: alertConfirm
                    },
                    {
                        name: <div><FileDoneOutlined style={{paddingRight: 8}}/>거래명세표 출력</div>,
                        func: printTransactionStatement,
                        type: ''
                    },
                    {name: <div><AuditOutlined style={{paddingRight: 8}}/>발주서 출력</div>, func: printPo, type: ''},
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
                        <TopBoxCard grid={'100px 70px 70px 130px 130px 130px 120px'}>
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
                                    const member = adminList.find(v => v.adminId === parseInt(e.target.value))
                                    const managerInfo = {
                                        // managerId: info?.agencyCode?.toUpperCase().startsWith('K') ? member?.name : member?.adminName,
                                        managerAdminId: member?.adminId,
                                        // managerPhoneNumber: member?.contactNumber,
                                        // managerFaxNumber: member?.faxNumber,
                                        // managerEmail: member?.email
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
                            {inputForm({title: '만쿠견적서 No.', id: 'ourPoNo', disabled: true, data: info})}
                            {inputForm({title: '만쿠발주서 No.', id: 'documentNumberFull', disabled: true, data: info})}
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
                                    {inputForm({title: '회사명', id: 'agencyName', onChange: onChange, data: info})}
                                    {inputForm({title: '관리번호', id: 'attnTo', onChange: onChange, data: info})}
                                    {inputForm({title: '담당자', id: 'agencyManagerName', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[0]} minSize={5}>
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
                            <Panel defaultSize={sizes[1]} minSize={5}>
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
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>세부사항</div>
                                </div>}>
                                    <div style={{paddingBottom: 10}}>
                                        <SelectForm id={'paymentTerms'}
                                                    list={['발주시 50% / 납품시 50%', '현금결제', '선수금', '정기결제','T/T', 'Credit Card', 'Order 30% Before Shipping 70%', 'Order 50% Before Shipping 50%']}
                                                    title={'결제조건'}
                                                    onChange={onChange}
                                                    data={info}
                                        />
                                    </div>
                                    {/*{inputForm({title: '납기', id: 'delivery', onChange: onChange, data: info})}*/}
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
                            <Panel defaultSize={sizes[3]} minSize={5}>
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
                            <Panel defaultSize={sizes[4]} minSize={5}>
                                <BoxCard title={<>드라이브 목록 <Button size={'small'} style={{fontSize : 10, float : 'right'}} type={'primary'} onClick={getMergePdf}>폴더내 내용</Button></>}
                                         disabled={!userInfo['microsoftId']}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     ref={uploadRef}
                                                     info={info} key={driveKey} type={'order'}/>
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

export default memo(OrderUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});