import React, {memo, useEffect, useRef, useState} from "react";
import {CopyOutlined, DeleteOutlined, FileAddFilled, FormOutlined} from "@ant-design/icons";
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
import {getAttachmentFileList, updateEstimate} from "@/utils/api/mainApi";
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

const listType = 'estimateDetailList'

function findNextAvailableNumber(data: { name: string }[], prefix: string): string {
    // 1. prefix로 시작하는 항목만 추출
    const filtered = data
        .map(item => item.name)
        .filter(name => name.startsWith(prefix + '.'))
        .map(name => {
            const numPart = name.split(' ')[0]; // "03.1"
            const decimal = parseFloat(numPart.split('.')[1]); // 1, 3, ...
            return decimal;
        });

    if (filtered.length === 0) return `${prefix}.1`;

    // 2. 정렬
    filtered.sort((a, b) => a - b);

    // 3. 빈 숫자 찾기
    for (let i = 1; i <= filtered[filtered.length - 1]; i++) {
        if (!filtered.includes(i)) {
            return `${prefix}.${i}`;
        }
    }

    // 4. 다 있으면 마지막 숫자 다음
    return `${prefix}.${filtered[filtered.length - 1] + 1}`;
}

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

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('estimate_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
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

    const options = memberList?.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [count, setCount] = useState(0);

    const [fileList, setFileList] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);
    const [tableData, setTableData] = useState([]);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const userInfo = useAppSelector((state) => state.user);
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
    const [validate, setValidate] = useState(estimateInfo['write']['validate']);

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {estimateDetail, attachmentFileList} = v;
            setInfo({
                ...estimateDetail,
                uploadType: 3,
                managerAdminId: estimateDetail['managerAdminId'] ? estimateDetail['managerAdminId'] : '',
                managerAdminName: estimateDetail['managerAdminName'] ? estimateDetail['managerAdminName'] : '',
                createdBy: userInfo['name']
            })
            setFileList(fileManage.getFormatFiles(attachmentFileList));
            setOriginFileList(attachmentFileList)
            estimateDetail[listType] = [...estimateDetail[listType], ...commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000 - estimateDetail[listType].length)]
            setTableData(estimateDetail[listType]);
            setLoading(false)
        })
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
        const { key, value } = e?.target;
        commonManage.resetValidate(key, value, setValidate);
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
            width={1050}
            footer={null}
            onOk={() => setIsPrintModalOpen(false)}>
            <EstimatePaper infoRef={infoRef} pdfRef={pdfRef} pdfSubRef={pdfSubRef} tableRef={tableRef} position={true}
                           memberList={memberList} maker={info.maker} title={'견적서 출력'} count={count}/>
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

        setLoading(true)

        const findMember = memberList.find(v => v.adminId === parseInt(info['managerAdminId']));
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

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateEstimate({data: formData, returnFunc: returnFunc});

    }

    async function returnFunc(v) {
        const dom = infoRef.current.querySelector('#documentNumberFull');
        if (v.code === 1) {
            await getAttachmentFileList({
                data: {
                    "relatedType": "ESTIMATE",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": updateKey['estimate_update']
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);

                setFileList(list)
                setOriginFileList(list);

                window.postMessage('update', window.location.origin);
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
            })
        } else {
            notificationAlert('error', '⚠️작업실패',
                <>
                    <div>Inquiry No. : {info.documentNumberFull}</div>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , function () {
                    alert('관리자 로그 페이지 참고')
                },
                {cursor: 'pointer'}
            )
        }
        setLoading(false)
    }

    /**
     * @description 수정 페이지 > 복제 버튼
     * 견적서 > 견적서 수정
     */
    function copyPage() {
        /**
         * 개선사항
         * 견적서 복제버튼 > 등록페이지 이동시 고객사 정보 초기화
         * copyInfo 데이터에서 해당 키의 값 제거함
         */
        const copyInfo = {
            ...info,
            customerName: '',
            managerName: '',
            phoneNumber: '',
            customerManagerEmail: '',
            faxNumber: ''
        };
        //

        const totalList = tableRef.current.getSourceData();
        totalList.pop();
        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000 - totalList.length)];

        getCopyPage('estimate_write', { ...copyInfo, _meta: {updateKey: Date.now()}})
    }

    /**
     * @description 수정 페이지 > 삭제 버튼
     * 견적서 > 견적서 수정
     */
    function deleteFunc() {
        setLoading(true)
        getData.post('estimate/deleteEstimate', {estimateId: updateKey['estimate_update']}).then(v => {
            const {code, message} = v.data;
            if (code === 1) {

                notificationAlert('success', '🗑️견적서 삭제완료',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null,
                    {cursor: 'pointer'}
                )
                const {model} = layoutRef.current.props;
                getCopyPage('estimate_read', {})
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'estimate_update');

                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
                setLoading(false)
            } else {
                message.error(v?.data?.message)
                setLoading(false)
            }
        }, err => setLoading(false))
    }

    /**
     * @description 수정 페이지 > 초기화 버튼
     * 견적서 > 견적서 수정
     */
    function clearAll() {
        // info 데이터 초기화
        commonManage.setInfo(infoRef, estimateInfo['defaultInfo'], userInfo['adminId']);
        setTableData(commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000))
    }

    /**
     * @description 수정 페이지 > 드라이브 목록 파일 버튼
     * 견적서 > 견적서 수정
     */
    async function addEstimate() {
        setLoading(true)
        let infoData = commonManage.getInfo(infoRef, estimateInfo['defaultInfo']);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];
        infoData['name'] = findMember['name'];
        infoData['contactNumber'] = findMember['contactNumber'];
        infoData['email'] = findMember['email'];
        infoData['customerManagerName'] = infoData['managerName'];
        infoData['customerManagerPhone'] = infoData['phoneNumber'];

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

        const blob = await pdfs(<PdfForm data={data} topInfoData={infoData} totalData={results}
                                         key={Date.now()}/>).toBlob();

        const dom = infoRef.current.querySelector('#documentNumberFull');

        // File 객체로 만들기 (선택 사항)


        const file = new File([blob], `${dom.value}.pdf`, {type: 'application/pdf'});

        const findNumb = findNextAvailableNumber(fileList, '03')
        const newFile = {
            ...file,
            uid: file.name + "_" + Date.now(),
            name: `${findNumb} ${file.name}`,
            originFileObj: file,
            type: file.type,
        }

        setFileList([
            ...fileList,
            newFile,
        ]);
        setLoading(false)
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
                    {name: <div>견적서 출력</div>, func: printEstimate, type: ''},
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
                            <TopBoxCard grid={'110px 70px 70px 120px 120px 300px'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    data: info
                                })}
                                {inputForm({title: '작성자', id: 'createdBy', disabled: true, data: info})}
                                <div>
                                    {/*<div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>*/}
                                    {/*<select name="languages" id="managerAdminId"*/}
                                    {/*        style={{*/}
                                    {/*            outline: 'none',*/}
                                    {/*            border: '1px solid lightGray',*/}
                                    {/*            height: 23,*/}
                                    {/*            width: '100%',*/}
                                    {/*            fontSize: 12,*/}
                                    {/*            paddingBottom: 0.5*/}
                                    {/*        }}>*/}
                                    {/*    {*/}
                                    {/*        options?.map(v => {*/}
                                    {/*            return <option value={v.value}>{v.label}</option>*/}
                                    {/*        })*/}
                                    {/*    }*/}
                                    {/*</select>*/}
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
                                    title: '만쿠견적서 No.',
                                    id: 'documentNumberFull',
                                    disabled: true,
                                    data: info
                                })}
                                {inputForm({title: 'RFQ No.', id: 'rfqNo', onChange: onChange, data: info})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle', onChange: onChange, data: info})}
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
                                    <BoxCard title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div>드라이브 목록</div>
                                        <FileAddFilled style={{fontSize: 18, cursor: 'pointer'}} onClick={addEstimate}/>
                                    </div>} disabled={!userInfo['microsoftId']}>
                                        {/*@ts-ignored*/}
                                        <div style={{overFlowY: "auto", maxHeight: 300}}>
                                            <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                             infoRef={infoRef} uploadType={info.uploadType}/>
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
        </>
    </Spin></div>
}

export default memo(EstimateUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});