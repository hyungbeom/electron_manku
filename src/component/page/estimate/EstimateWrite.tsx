import React, {useEffect, useRef, useState} from "react";
import {DownloadOutlined, RadiusSettingOutlined, RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import {estimateDetailUnit, ModalInitList} from "@/utils/initialList";
import message from "antd/lib/message";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {checkInquiryNo, getAttachmentFileList, saveEstimate} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import {getData} from "@/manage/function/api";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment";
import {estimateInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import EstimatePaper from "@/component/견적서/EstimatePaper";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";


const listType = 'estimateDetailList'
export default function EstimateWrite({copyPageInfo = {}, getPropertyId, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)

    const [count, setCount] = useState(0);
    const [memberList, setMemberList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('estimate_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 20]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

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


    const pdfRef = useRef(null);
    const pdfSubRef = useRef(null);
    const fileRef = useRef(null);
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null)

    const router = useRouter();

    const [ready, setReady] = useState(false);

    const copyInit = _.cloneDeep(estimateInfo['defaultInfo']);
    const copyUnitInit = _.cloneDeep(estimateDetailUnit);

    const userInfo = useAppSelector((state) => state.user);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        createdBy: userInfo['name'],
        managerAdminName: userInfo['name']
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
        if (!isEmptyObj(copyPageInfo['estimate_write'])) {
            // copyPageInfo 가 없을시
            setInfo(infoInit)
            setTableData(commonFunc.repeatObject(estimateInfo['write']['defaultData'], 100))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...copyPageInfo['estimate_write'], ...adminParams,
                documentNumberFull: '',
                writtenDate: moment().format('YYYY-MM-DD')
            });
            setTableData(copyPageInfo['estimate_write'][listType])
        }
    }, [copyPageInfo['estimate_write']]);

    useEffect(() => {
        commonManage.setInfo(infoRef, info, userInfo['adminId']);
        if (memberList.length) {
            setReady(true)
        }
    }, [info, memberList]);


    async function handleKeyPress(e) {

        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal, infoRef)
                    break;
                case 'documentNumberFull' :
                    const dom = infoRef.current.querySelector('#agencyCode');
                    const dom2 = infoRef.current.querySelector('#documentNumberFull');

                    if (!dom.value) {
                        return message.warn('매입처코드를 선택해주세요')
                    }
                    setLoading(true)
                    await getData.post('estimate/getNewDocumentNumberFull', {
                            agencyCode: dom.value,
                            type: 'ESTIMATE'
                        }).then(v=>{
                       if(v.data.code === 1){
                           dom2.value = v.data.entity.newDocumentNumberFull;
                       }else{
                            message.error(v.data.message)
                       }
                        setLoading(false)
                    }, err=>setLoading(false))


                    break;

                case 'connectDocumentNumberFull' :
                    setLoading(true)
                    await getData.post('estimate/getEstimateRequestDetail', {
                        "estimateRequestId": '',
                        documentNumberFull: e.target.value.toUpperCase()
                    }).then(async v => {
                        if (v.data.code === 1) {
                            const {attachmentFileList, estimateRequestDetail} = v.data?.entity
                            // setFileList(fileManage.getFormatFiles(attachmentFileList))
                            const dom = infoRef.current.querySelector('#connectDocumentNumberFull');
                            // const result = await findDocumentInfo(e, setInfo);
                            await getData.post('estimate/generateDocumentNumberFull', {
                                type: 'ESTIMATE',
                                documentNumberFull: dom.value.toUpperCase()
                            }).then(src => {

                                    commonManage.setInfo(infoRef, {
                                        ...estimateRequestDetail,
                                        documentNumberFull: src.data.code === 1 ? src.data.entity.newDocumentNumberFull : '',
                                        validityPeriod: '견적 발행 후 10일간',
                                        paymentTerms: '발주시 50% / 납품시 50%',
                                        shippingTerms: '귀사도착도',
                                        writtenDate: moment().format('YYYY-MM-DD'),
                                    })

                                    if (estimateRequestDetail) {
                                        setTableData([...estimateRequestDetail['estimateRequestDetailList'], ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 100 - estimateRequestDetail['estimateRequestDetailList'].length)])
                                    }
                                setLoading(false)
                                }, err => setLoading(false)
                            );


                        }else{
                            setLoading(false)
                        }
                    })

                    // gridManage.resetData(gridRef, result.data.entity.estimateRequestList);
                    break;
            }
        }
    }


    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {

        commonManage.onChange(e, setInfo)
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    async function saveFunc() {
        setCount(v => v + 1)
        let infoData = commonManage.getInfo(infoRef, infoInit);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];


        if (!infoData['managerAdminId']) {
            return message.warn('담당자가 누락되었습니다.')
        }

        if (!infoData['documentNumberFull']) {
            const dom = infoRef.current.querySelector('#documentNumberFull');
            dom.style.borderColor = 'red'
            return message.warn('Inquiry No. 정보가 누락되었습니다.')
        }

        if (!infoData['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }
        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        const emptyQuantity = filterTableList.filter(v=> !v.quantity)
        if(emptyQuantity.length){
            return message.error('수량을 입력해야 합니다.')
        }
        setLoading(true)
        await delay(300); // 0.3초 대기 후 실행
        const formData: any = new FormData();

        const pdf = await commonManage.getPdfCreate(pdfRef, pdfSubRef)
        const result = await commonManage.getPdfFile(pdf, infoData['documentNumberFull'])

        commonManage.setInfoFormData(infoData, formData, listType, filterTableList)
        const resultCount = commonManage.getUploadList(fileRef, formData);

        formData.append(`attachmentFileList[${resultCount}].attachmentFile`, result);
        formData.append(`attachmentFileList[${resultCount}].fileName`, `03.${resultCount + 1} ${result.name}`);

        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await saveEstimate({data: formData}).then(async v => {
            const {code, message: msg, entity} = v;
            const dom = infoRef.current.querySelector('#documentNumberFull');
            if (code === 1) {
                setFileList([])
                notificationAlert('success', '💾견적서 등록완료',
                    <>
                        <div>Inquiry No. : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('estimate_update', entity?.estimateId)
                    },
                    {cursor: 'pointer'}
                )
                setLoading(false)
            } else if (code === -20001) {
                dom.style.borderColor = 'red';
                message.error(msg);
                setLoading(false)
            } else {
                notificationAlert('error', '⚠️작업실패',
                    <>
                        <div>Inquiry No. : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('관리자 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
                setLoading(false)
            }
        })
    }


    function clearAll() {
        setInfo({...infoInit});
        // gridManage.deleteAll(gridRef);
    }

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if (activeTab?.renderedName === '견적서 등록') {
                saveFunc()
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    return <div style={{overflow: 'hidden'}}><Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'estimate_write'}/>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}

                         setIsModalOpen={setIsModalOpen}/>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '500px' : '65px'} calc(100vh - ${mini ? 595 : 195}px)`,
                overflowY: 'hidden',
                rowGap: 10,
            }}>
                <MainCard title={'견적서 작성'} list={[
                    {name: <div><SaveOutlined style={{paddingRight : 8}} />저장</div>, func: saveFunc, type: 'primary'},
                    {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard grid={'100px 70px 70px 120px 120px 120px 300px'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true
                                })}
                                {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
                                <div>
                                    <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>
                                    <select name="languages" id="managerAdminId"
                                            style={{
                                                outline: 'none',
                                                border: '1px solid lightGray',
                                                height: 23,
                                                width: '100%',
                                                fontSize: 12,
                                                paddingBottom: 0.5
                                            }}>
                                        {
                                            options?.map(v => {
                                                return <option value={v.value}>{v.label}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                {/*{inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}*/}

                                {inputForm({
                                    title: '의뢰자료 No.',
                                    id: 'connectDocumentNumberFull',
                                    suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>
                                    , handleKeyPress: handleKeyPress
                                })}
                                {inputForm({
                                    title: '만쿠견적서 No.',
                                    id: 'documentNumberFull'
                                })}
                                {inputForm({title: 'RFQ No.', id: 'rfqNo'})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
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


                                            handleKeyPress: handleKeyPress,


                                        })}
                                        {inputForm({
                                            title: '회사명',
                                            id: 'agencyName',


                                        })}
                                        {inputForm({
                                            title: '담당자',
                                            id: 'agencyManagerName',

                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'agencyTel'
                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'agencyManagerEmail'
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


                                            handleKeyPress: handleKeyPress,
                                        })}
                                        {inputForm({
                                            title: '담당자명',
                                            id: 'managerName',

                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'phoneNumber',

                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'customerManagerEmail',

                                        })}
                                        {inputForm({
                                            title: '팩스',
                                            id: 'faxNumber',

                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={'운송 정보'}>
                                        <div>
                                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>유효기간</div>
                                            <select name="languages" id="validityPeriod"
                                                    style={{
                                                        outline: 'none',
                                                        border: '1px solid lightGray',
                                                        height: 23,
                                                        width: '100%',
                                                        fontSize: 12,
                                                        paddingBottom: 0.5
                                                    }}>
                                                <option value={'견적 발행 후 10일간'}>견적 발행 후 10일간</option>
                                                <option value={'견적 발행 후 30일간'}>견적 발행 후 30일간</option>
                                            </select>
                                        </div>
                                        <div style={{paddingTop: 10}}>
                                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>결제조건</div>
                                            <select name="languages" id="paymentTerms"
                                                    style={{
                                                        outline: 'none',
                                                        border: '1px solid lightGray',
                                                        height: 23,
                                                        width: '100%',
                                                        fontSize: 12,
                                                        paddingBottom: 0.5
                                                    }}>
                                                <option value={'발주시 50% / 납품시 50%'}>발주시 50% / 납품시 50%</option>
                                                <option value={'현금결제'}>현금결제</option>
                                                <option value={'선수금'}>선수금</option>
                                                <option value={'정기결제'}>정기결제</option>
                                            </select>
                                        </div>

                                        <div style={{paddingTop: 10, paddingBottom: 10}}>
                                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>운송조건</div>
                                            <select name="languages" id="shippingTerms"
                                                    style={{
                                                        outline: 'none',
                                                        border: '1px solid lightGray',
                                                        height: 23,
                                                        width: '100%',
                                                        fontSize: 12,
                                                        paddingBottom: 0.5
                                                    }}>
                                                <option value={'귀사도착도'}>귀사도착도</option>
                                                <option value={'화물 및 택배비 별도'}>화물 및 택배비 별도</option>
                                            </select>
                                        </div>

                                        {inputNumberForm({
                                            title: '납기',
                                            id: 'delivery',
                                            min: 0,
                                            max: 10,
                                            addonAfter: '주'
                                        })}
                                        {inputNumberForm({
                                            title: '환율',
                                            id: 'exchangeRate',
                                            min: 0,
                                            step: 0.01,
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
                                            handleKeyPress: handleKeyPress
                                        })}
                                        {inputForm({title: 'Item', id: 'item'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={5}>
                                    <BoxCard title={'ETC'}>
                                        {textAreaForm({
                                            title: '지시사항',
                                            rows: 5,
                                            id: 'instructions',

                                        })}
                                        {textAreaForm({title: '비고란', rows: 5, id: 'remarks'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[5]} minSize={5}>
                                    <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                        {/*@ts-ignored*/}
                                        <div style={{overFlowY: "auto", maxHeight: 300}}>
                                            <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                             infoRef={infoRef}/>
                                        </div>
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel></Panel>
                            </PanelGroup>

                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={estimateInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'estimate_write_column'}/>
            </div>
        </>
        {ready &&
            <EstimatePaper infoRef={infoRef} pdfRef={pdfRef} pdfSubRef={pdfSubRef} tableRef={tableRef} position={false}
                           memberList={memberList} count={count}/>}
        {/*{ready && <EstimatePaper data={info} pdfRef={pdfRef} gridRef={gridRef}/>}*/}
    </Spin></div>
}
