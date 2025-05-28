import React, {memo, useEffect, useRef, useState} from "react";
import {
    CopyOutlined,
    DeleteOutlined,
    ExceptionOutlined,
    FileAddFilled,
    FormOutlined,
    SettingOutlined
} from "@ant-design/icons";
import {ModalInitList} from "@/utils/initialList";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    selectBoxForm,
    SelectForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {updateEstimate} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import Modal from "antd/lib/modal/Modal";
import EstimatePaper from "@/component/견적서/EstimatePaper";
import {estimateInfo, rfqInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import moment from "moment/moment";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import _ from "lodash";
import {Actions} from "flexlayout-react";
import {pdf as pdfs} from "@react-pdf/renderer";
import {PdfForm} from "@/component/견적서/PdfForm";
import Drawer from "antd/lib/drawer";
import Button from "antd/lib/button";

const listType = 'estimateDetailList'

function EstimateUpdate({
                            dataInfo = {estimateDetail: [], attachmentFileList: []},
                            updateKey = {},
                            getCopyPage = null, getPropertyId, layoutRef
                        }: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const pdfRef = useRef(null);
    const pdfSubRef = useRef(null);
    const fileRef = useRef(null);
    const uploadRef = useRef<any>(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('estimate_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태



    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [count, setCount] = useState(0);

    const { userInfo, adminList } = useAppSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const adminParams = {
        managerAdminId: userInfo['adminId'],

        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getEstimateInit = () => {
        const copyInit = _.cloneDeep(estimateInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState<any>({})
    const getEstimateValidateInit = () => _.cloneDeep(estimateInfo['write']['validate']);
    const [validate, setValidate] = useState(getEstimateValidateInit());

    const [driveKey, setDriveKey] = useState(0);

    const [fileList, setFileList] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setValidate(getEstimateValidateInit());
        setInfo(getEstimateInit());
        setFileList([]);
        setDriveKey(prev => prev + 1);
        setOriginFileList([]);
        setTableData([]);
        getDataInfo().then(v => {
            const {estimateDetail, attachmentFileList} = v;
            setInfo({
                ...getEstimateInit(),
                ...estimateDetail,
                managerAdminId: estimateDetail['managerAdminId'] ? estimateDetail['managerAdminId'] : '',
                receiverId: estimateDetail['managerAdminId'] ? estimateDetail['managerAdminId'] : '',
                managerAdminName: estimateDetail['managerAdminName'] ? estimateDetail['managerAdminName'] : '',
                createdBy: estimateDetail['createdBy'] ? estimateDetail['createdBy'] : ''
            })
            setFileList(fileManage.getFormatFiles(attachmentFileList));
            // setOriginFileList(attachmentFileList)
            setOriginFileList(fileManage.getFormatFiles(attachmentFileList));
            estimateDetail[listType] = [...estimateDetail[listType], ...commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000 - estimateDetail[listType].length)]
            setTableData(estimateDetail[listType]);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['estimate_update']])

    async function getDataInfo() {
        return await getData.post('estimate/getEstimateDetail', {
            estimateId: updateKey['estimate_update'],
            documentNumberFull: ""
        }).then(v => {
            return v.data?.entity;
        })
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'agencyCode':
                case 'customerName':
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal)
                    break;
                case 'connectDocumentNumberFull' :
                    await findDocumentInfo(e, setInfo)
                    break;
            }

        }
    }

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)

        // 값 입력되면 유효성 초기화
        const { id, value } = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 수정 페이지 > 견적서 출력
     * 견적서 > 견적서 수정
     */
    async function printEstimate() {
        if (!info['managerAdminId']) {
            return message.warn('담당자가 누락되었습니다.');
        }
        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다.')
        }
        setCount(v => v + 1)
        setIsPrintModalOpen(true);
    }

    /**
     * @description 수정 페이지 > 견적서 모달
     * 견적서 > 견적서 수정
     * @constructor
     */
    function EstimateModal() {
        return <Modal
            onCancel={() => setIsPrintModalOpen(false)}
            open={isPrintModalOpen}
            width={1100}
            footer={null}
            onOk={() => setIsPrintModalOpen(false)}>
            <EstimatePaper info={info} pdfRef={pdfRef} pdfSubRef={pdfSubRef} tableRef={tableRef} position={true}
                           memberList={adminList} maker={info.maker} title={'견적서 출력'} count={count}/>
        </Modal>
    }

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if (activeTab?.renderedName === '견적서 수정') {
                saveFunc()
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    /**
     * @description 수정 페이지 > 수정 버튼
     * 견적서 > 견적서 수정
     */
    async function saveFunc() {
        console.log(info, 'info:::')

        // 유효성 체크
        if(!commonManage.checkValidate(info, estimateInfo['write']['validationList'], setValidate)) return;

        const findMember = adminList.find(v => v.adminId === parseInt(info['managerAdminId']));
        info['managerAdminName'] = findMember['name'];
        info['estimateId'] = updateKey['estimate_update']

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터가 1개 이상이여야 합니다.');
        }
        const emptyQuantity = filterTableList.filter(v => !v.quantity)
        if (emptyQuantity.length) {
            return message.error('하위 데이터의 수량을 입력해야 합니다.')
        }

        setLoading(true)

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateEstimate({data: formData, returnFunc: returnFunc});
        setLoading(false);
    }

    async function returnFunc(v) {
        if (v.code === 1) {
            window.postMessage({message: 'reload', target: 'estimate_read'}, window.location.origin);
            notificationAlert('success', '💾 견적서 수정완료',
                <>
                    <div>Inquiry No. : {info.documentNumberFull}</div>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , function () {
                    getPropertyId('estimate_update', updateKey['estimate_update'])
                },
                {cursor: 'pointer'}
            )
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
     * 견적서 > 견적서 수정
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('estimate/deleteEstimate', {estimateId: updateKey['estimate_update']}).then(v => {
            const {code, message} = v.data;
            if (code === 1) {
                window.postMessage({message: 'reload', target: 'estimate_read'}, window.location.origin);
                notificationAlert('success', '🗑 견적서 삭제완료',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                const {model} = layoutRef.current.props;
                getCopyPage('estimate_read', {})
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'estimate_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                notificationAlert('error', '⚠️작업실패',
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
        })
        .finally(() => {
            setLoading(false);
        });
    }

    /**
     * @description 수정 페이지 > 초기화 버튼
     * 견적서 > 견적서 수정
     */
    function clearAll() {
        setLoading(true);
        setInfo(getEstimateInit());
        setValidate(estimateInfo['write']['validate']);

        function calcData(sourceData) {
            const keyOrder = Object.keys(estimateInfo['write']['defaultData']);
            return sourceData
                .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
                .map(estimateInfo['write']['excelExpert'])
                .concat(estimateInfo['write']['totalList']); // `push` 대신 `concat` 사용
        }

        // tableRef.current?.hotInstance?.loadData(calcData(commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000)));
        setTableData(calcData(commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000)))
        setFileList([]);
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 복제 버튼
     * 견적서 > 견적서 수정
     */
    async function copyPage() {
        /**
         * 개선사항
         * 견적서 복제버튼 > 등록페이지 이동시 고객사 정보 초기화
         * copyInfo 데이터에서 해당 키의 값 제거함
         */
        const copyInfo = {
            info : {
                ..._.cloneDeep(info),
                customerName: '',
                managerName: '',
                phoneNumber: '',
                customerManagerEmail: '',
                faxNumber: '',
            }
        };
        //

        const totalList = tableRef.current.getSourceData();
        totalList.pop();
        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000 - totalList.length)];

        // 복제시 새로운 Inquiry No. 생성 및 파일리스트 같이 넘김.
        const res = await getData.post('estimate/generateDocumentNumberFull', {
            type: 'ESTIMATE',
            documentNumberFull: info['documentNumberFull'].toUpperCase()
        })
        if (res?.data?.code !== 1) return message.error('새로운 Inquiry No. 생성이 실패하였습니다.');
        const { newDocumentNumberFull = '' , attachmentFileList = [] } = res?.data?.entity;
        copyInfo['info']['connectDocumentNumberFull'] = copyInfo['info']['documentNumberFull'];
        copyInfo['info']['documentNumberFull'] = newDocumentNumberFull;
        copyInfo['attachmentFileList'] = attachmentFileList;

        getCopyPage('estimate_write', { ...copyInfo, _meta: {updateKey: Date.now()}})
    }

    /**
     * @description 수정 페이지 > 드라이브 목록 파일 버튼 (견적서 파일 생성)
     * 견적서 > 견적서 수정
     */
    async function addEstimate() {
        setLoading(true);
        const findMember = adminList.find(v => v.adminId === parseInt(info['managerAdminId']));
        info['managerAdminName'] = findMember['name'];
        info['name'] = findMember['name'];
        info['contactNumber'] = findMember['contactNumber'];
        info['email'] = findMember['email'];
        info['customerManagerName'] = info['managerName'];
        info['customerManagerPhone'] = info['phoneNumber'];

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        const data = commonManage.splitDataWithSequenceNumber(filterTableList, 18, 28);

        let results = filterTableList.reduce((acc, cur, idx) => {
            const {quantity, net} = cur
            acc['quantity'] += quantity;
            acc['net'] += net;
            acc['total'] += (quantity * net)
            return acc
        }, {quantity: 0, net: 0, total: 0})

        results['unit'] = filterTableList[0]['unit'];

        const blob = await pdfs(<PdfForm data={data} topInfoData={info} totalData={results}
                                         key={Date.now()}/>).toBlob();

        // File 객체로 만들기 (선택 사항)
        const file = new File([blob], `${info?.documentNumberFull}.pdf`, {type: 'application/pdf'});

        // const findNumb = commonManage.findNextAvailableNumber(fileList, '03')
        // const newFile = {
        //     ...file,
        //     uid: file.name + "_" + Date.now(),
        //     name: `${findNumb} ${file.name}`,
        //     originFileObj: file,
        //     type: file.type,
        // }
        // setOriginFileList([...originFileList, newFile]);
        // setFileList([...fileList, newFile,]);


        // 업로드 컴포넌트에 직접 올림
        const newFile = {
            ...file,
            uid: file.name + "_" + Date.now(),
            name: file.name,
            originFileObj: file,
            type: file.type,
        }
        console.log(newFile)
        uploadRef.current.addEstimateFile(newFile);

        setLoading(false);
    }

    function sendMessage(){
        const findMember = adminList.find(v=> v.adminId === info.receiverId);
        console.log(info.message);
        getData.post('socket/send',{receiverId :info.receiverId,receiverName : findMember?.name,   title :'[견적서알림]', message :info.message, pk :updateKey['estimate_update']}).then(src=>{
            message.success("전송되었습니다");
            setOpen(false)
        });
    }


    return <div style={{overflow: 'hidden'}}><Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'estimate_update'}/>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>
        <EstimateModal/>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '500px' : '65px'} calc(100vh - ${mini ? 595 : 195}px)`,
                overflowY: 'hidden',
                rowGap: 10,
            }}>
                <MainCard title={'견적서 수정'} list={[
                    {
                        name: <div><SettingOutlined style={{paddingRight: 8}}/>메세지 보내기</div>,
                        func: ()=>setOpen(true)
                    },
                    {name: <div><ExceptionOutlined style={{paddingRight: 8}}/>견적서 출력</div>, func: printEstimate, type: 'default'},
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
                            <TopBoxCard grid={'110px 70px 70px 120px 120px'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    data: info
                                })}
                                {inputForm({title: '작성자', id: 'createdBy', disabled: true, data: info})}
                                <div>
                                    {selectBoxForm({
                                        title: '담당자',
                                        id: 'managerAdminId',
                                        onChange: onChange,
                                        data: info,
                                        validate: validate['managerAdminId'],
                                        list: adminList?.map((item) => ({
                                            ...item,
                                            value: item.adminId,
                                            label: item.name,
                                        }))
                                    })}
                                </div>
                                {inputForm({
                                    title: '만쿠견적서 No.',
                                    id: 'documentNumberFull',
                                    disabled: true,
                                    data: info
                                })}
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
                                            id: 'managerName',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'phoneNumber',
                                            onChange: onChange,
                                            data: info
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
                                    <BoxCard title={'운송 정보'}>
                                        <SelectForm id={'validityPeriod'} list={['견적 발행 후 10일간', '견적 발행 후 30일간']}
                                                    title={'유효기간'}
                                                    onChange={onChange}
                                                    data={info}/>
                                        <div style={{paddingTop: 10}}>
                                            <SelectForm id={'paymentTerms'}
                                                        list={['발주시 50% / 납품시 50%', '현금결제', '선수금', '정기결제']}
                                                        title={'결제조건'}
                                                        onChange={onChange}
                                                        data={info}/>
                                        </div>

                                        <div style={{paddingTop: 10, paddingBottom: 10}}>
                                            <SelectForm id={'shippingTerms'}
                                                        list={['귀사도착도', '화물 및 택배비 별도']}
                                                        title={'운송조건'}
                                                        onChange={onChange}
                                                        data={info}/>
                                        </div>

                                        {inputNumberForm({
                                            title: '납기',
                                            id: 'delivery',
                                            min: 0,
                                            max: 10,
                                            addonAfter: '주',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputNumberForm({
                                            title: '환율',
                                            id: 'exchangeRate',
                                            min: 0,
                                            step: 0.01,
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={'Maker 정보'}>
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
                                        {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={5}>
                                    <BoxCard title={'ETC'}>
                                        {textAreaForm({
                                            title: '지시사항',
                                            rows: 5,
                                            id: 'instructions',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {textAreaForm({
                                            title: '비고란', rows: 5, id: 'remarks', onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[5]} minSize={5}>
                                    <BoxCard title={
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <div>드라이브 목록</div>
                                                <FileAddFilled style={{fontSize: 18, cursor: 'pointer'}} onClick={addEstimate}/>
                                                </div>
                                             } disabled={!userInfo['microsoftId']}>
                                        {/*@ts-ignored*/}
                                        <div style={{overFlowY: "auto", maxHeight: 300}}>
                                            <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef} ref={uploadRef}
                                                             info={info} key={driveKey} type={'estimate'}/>
                                        </div>
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[6]} minSize={0}></Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={estimateInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'estimate_write_column'}/>
            </div>

            <Drawer title={'메세지 보내기'} open={open} onClose={() => setOpen(false)}>
                <div>
                    {selectBoxForm({
                        title: '담당자',
                        id: 'receiverId',
                        onChange: onChange,
                        data: info,
                        list: adminList?.map((item) => ({
                            ...item,
                            value: item.adminId,
                            label: item.name,
                        }))
                    })}
                </div>

                {textAreaForm({
                    title: '보낼 메세지',
                    rows: 2,
                    id: 'message',
                    onChange: onChange,
                    data: info
                })}
                <Button type={'primary'} onClick={sendMessage}>전송</Button>
            </Drawer>
        </>
    </Spin></div>
}

export default memo(EstimateUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});