import React, {useEffect, useRef, useState} from "react";
import {DownloadOutlined, RetweetOutlined} from "@ant-design/icons";
import {ModalInitList} from "@/utils/initialList";
import Button from "antd/lib/button";
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
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage, gridManage} from "@/utils/commonManage";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {checkInquiryNo, getAttachmentFileList, updateEstimate} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import Modal from "antd/lib/modal/Modal";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import EstimatePaper from "@/component/견적서/EstimatePaper";
import {estimateInfo, projectInfo, rfqInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import moment from "moment/moment";

const listType = 'estimateDetailList'
export default function EstimateUpdate({
                                           dataInfo = {estimateDetail: [], attachmentFileList: []},
                                           updateKey = {},

                                           getCopyPage = null,
                                           notificationAlert = null, getPropertyId
                                       }:any) {

    const groupRef = useRef<any>(null)


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('estimate_write');
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
            setMemberList(v.data.entity.adminList)
        })
    }

    const options = memberList?.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));

    const userInfo = useAppSelector((state) => state.user);


    // const adminParams = {
    //     managerAdminId: userInfo['adminId'],
    //     createdBy: userInfo['name'],
    //     managerAdminName: userInfo['name']
    // }
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);


    const pdfRef = useRef(null);
    const pdfSubRef = useRef(null);
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const infoInit = dataInfo?.estimateDetail
    const infoInitFile = dataInfo?.attachmentFileList

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    const [fileList, setFileList] = useState(fileManage.getFormatFiles(infoInitFile));
    const [originFileList, setOriginFileList] = useState(infoInitFile);
    const [tableData, setTableData] = useState([]);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {estimateDetail, attachmentFileList} = v;
            console.log(estimateDetail,'estimateDetail:')
            setFileList(fileManage.getFormatFiles(attachmentFileList));
            setOriginFileList(attachmentFileList)
            setInfo({
                ...estimateDetail,
                uploadType: 3,
                managerAdminId: estimateDetail['managerAdminId'] ? estimateDetail['managerAdminId'] : ''
            })
            estimateDetail[listType] = [...estimateDetail[listType], ...commonFunc.repeatObject(rfqInfo['write']['defaultData'], 100 - estimateDetail[listType].length)]

            setTableData(estimateDetail[listType]);

            setLoading(false)
        })
    }, [updateKey['estimate_update']])

    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);


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
                    await findCodeInfo(e, setInfo, openModal, 'ESTIMATE')
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
        if (e.target.id === 'agencyCode') {
        }
        commonManage.onChange(e, setInfo)
    }


    async function saveFunc() {

        let infoData = commonManage.getInfo(infoRef, estimateInfo['defaultInfo']);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];
        infoData['estimateId'] = updateKey['estimate_update']
        if (!infoData['agencyCode']) {
            const dom = infoRef.current.querySelector('#agencyCode');
            dom.style.borderColor = 'red'
            return message.warn('매입처 코드가 누락되었습니다.')
        }

        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }


        setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(infoData, formData, listType, filterTableList)
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
                    "relatedId": infoInit['estimateId']
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(list);
                console.log(v.entity?.estimateId,'v.entity?.estimateId??')
                notificationAlert('success', '💾견적서 수정완료',
                    <>
                        <div>Inquiry No. : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('estimate_update', updateKey['estimate_update'])
                    },
                    {cursor: 'pointer'}
                )
                setLoading(false)
            })
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
    }

    function copyPage() {
        const totalList = tableRef.current.getSourceData();
        totalList.pop();


        const result = Object.keys(estimateInfo['defaultInfo']).map(v => `#${v}`)
        const test = `${result.join(',')}`;
        const elements = infoRef.current.querySelectorAll(test);

        let copyInfo = {}
        for (let element of elements) {
            copyInfo[element.id] = element.value
        }

        const dom = infoRef.current.querySelector('#managerAdminId');

        copyInfo['managerAdminId'] = parseInt(dom.value);
        const findMember = memberList.find(v => v.adminId === parseInt(dom.value));

        if (findMember?.name) {
            copyInfo['managerAdminName'] = findMember['name'];
        }

        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 100 - totalList.length)];

        getCopyPage('estimate_write', copyInfo)
    }


    function deleteList() {
        const list = commonManage.getUnCheckList(gridRef);
        gridManage.resetData(gridRef, list);
    }


    async function printEstimate() {
        let infoData = commonManage.getInfo(infoRef, estimateInfo['defaultInfo']);
        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])


        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        if (!infoData['managerAdminId']) {
            return message.warn('담당자를 선택해주세요')
        }
        setIsPrintModalOpen(true)
    }

    const generatePDF = async (printMode = false) => {
        const pdf = new jsPDF("portrait", "px", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const padding = 30; // 좌우 여백 설정
        const contentWidth = pdfWidth - padding * 2; // 실제 이미지 너비

        // ✅ 높이가 0이 아닌 요소만 필터링
        const elements = Array.from(pdfSubRef.current.children).filter(
            (el: any) => el.offsetHeight > 0 && el.innerHTML.trim() !== ""
        );

        if (pdfRef.current) {
            const firstCanvas = await html2canvas(pdfRef.current, {scale: 2, useCORS: true});
            const firstImgData = firstCanvas.toDataURL("image/png");
            const firstImgProps = pdf.getImageProperties(firstImgData);
            const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;
            pdf.addImage(firstImgData, "PNG", 0, 20, pdfWidth, firstImgHeight);


        }

        for (let i = 0; i < elements.length; i++) {
            const element: any = elements[i];
            const firstCanvas = await html2canvas(element, {scale: 2, useCORS: true});
            const firstImgData = firstCanvas.toDataURL("image/png");
            const firstImgProps = pdf.getImageProperties(firstImgData);
            const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;

            pdf.addPage();
            pdf.addImage(firstImgData, "PNG", 0, 0, pdfWidth, firstImgHeight);

        }

        if (printMode) {
            const pdfBlob = pdf.output("bloburl");
            window.open(pdfBlob, "_blank");
        } else {
            pdf.save(`${info.documentNumberFull}_견적서.pdf`);
        }
    };

    function print() {
        const printContents = pdfRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
        location.reload();
    }

    function EstimateModal() {
        return <Modal
            title={<div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 30px'}}>
                <span>견적서 출력</span>
                <span>
                       <Button style={{fontSize: 11, marginRight: 10}} size={'small'}
                               onClick={() => generatePDF(false)}>다운로드</Button>
                       <Button style={{fontSize: 11}} size={'small'} onClick={() => generatePDF(true)}>인쇄</Button>
                </span>
            </div>}
            onCancel={() => setIsPrintModalOpen(false)}
            open={isPrintModalOpen}
            width={1050}
            footer={null}
            onOk={() => setIsPrintModalOpen(false)}>
            <EstimatePaper infoRef={infoRef} pdfRef={pdfRef} pdfSubRef={pdfSubRef} tableRef={tableRef} position={true}
                           memberList={memberList}/>
        </Modal>
    }

    function clearAll() {
        // info 데이터 초기화
        commonManage.setInfo(infoRef, estimateInfo['defaultInfo'], userInfo['adminId']);
        setTableData(commonFunc.repeatObject(estimateInfo['write']['defaultData'], 100))
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
                    {name: '견적서 출력', func: printEstimate, type: 'default'},
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard grid={'100px 70px 70px 120px 120px 300px'}>
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
                                    title: 'Inquiry No.',
                                    id: 'documentNumberFull',
                                    disabled : true
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
                                            title: '매입처명',
                                            id: 'agencyName',


                                        })}
                                        {inputForm({
                                            title: '담당자',
                                            id: 'agencyManagerName',

                                        })}
                                        {inputForm({
                                            title: '매입처이메일',
                                            id: 'agencyManagerEmail'
                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'agencyManagerPhoneNumber'
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
                                            title: '팩스',
                                            id: 'faxNumber',

                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'customerManagerEmail',

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
                {/*<TableGrid*/}
                {/*    setInfo={setInfo}*/}
                {/*    gridRef={gridRef}*/}
                {/*    columns={tableEstimateWriteColumns}*/}
                {/*    type={'write'}*/}
                {/*    onGridReady={onGridReady}*/}
                {/*    funcButtons={['estimateUpload', 'estimateAdd', 'delete', 'print']}*/}
                {/*/>*/}
                <Table data={tableData} column={estimateInfo['write']} funcButtons={['print']} ref={tableRef} type={'estimate_write_column'}/>
            </div>
        </>
        {/*{ready && <EstimatePaper data={info} pdfRef={pdfRef} gridRef={gridRef}/>}*/}
    </Spin></div>
}
