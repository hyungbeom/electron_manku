import React, {useEffect, useRef, useState} from "react";
import {FileSearchOutlined} from "@ant-design/icons";
import {tableEstimateWriteColumns} from "@/utils/columnList";
import {ModalInitList} from "@/utils/initialList";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {commonManage, fileManage, gridManage} from "@/utils/commonManage";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {getAttachmentFileList, updateEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import Modal from "antd/lib/modal/Modal";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import Select from "antd/lib/select";
import EstimatePaper from "@/component/견적서/EstimatePaper";

const listType = 'estimateDetailList'
export default function EstimateUpdate({
                                           dataInfo = {estimateDetail: [], attachmentFileList: []},
                                           updateKey = {},

                                           getCopyPage = null
                                       }) {
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

    const options = memberList.map((item) => ({
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


    const [loading, setLoading] = useState(false);




    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo?.estimateDetail[listType]});
    };

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {estimateDetail, attachmentFileList} = v;
            setFileList(fileManage.getFormatFiles(attachmentFileList))
            setInfo(estimateDetail)
            gridManage.resetData(gridRef, estimateDetail[listType])
            setLoading(false)

        })
        // setLoading(false)
    }, [updateKey['estimate_update']])

    async function getDataInfo() {
        return await getData.post('estimate/getEstimateDetail', {
            estimateId: updateKey['estimate_update'],
            documentNumberFull: ""
        }).then(v => {
            return v.data?.entity;
        })
    }

    console.log(info,'info')

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
        gridRef.current.clearFocusedCell();
        const list = gridManage.getAllData(gridRef)
        const filterList = list.filter(v => !!v.model);
        if (!filterList.length) {
            return message.warn('유효한 하위 데이터 1개 이상이여야 합니다')
        }
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }

        setLoading(true)
        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, filterList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)

        await updateEstimate({data: formData, returnFunc: returnFunc});
        setLoading(false)
    }

    async function returnFunc(e) {
        if (e) {
            await getAttachmentFileList({
                data: {
                    "relatedType": "ESTIMATE",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": infoInit['estimateId']
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(list)
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        getCopyPage('estimate_write', copyInfo)

    }


    function deleteList() {
        const list = commonManage.getUnCheckList(gridRef);
        gridManage.resetData(gridRef, list);
    }


    async function printEstimate() {
        const list = gridManage.getAllData(gridRef)
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        if(!info['managerAdminName']){
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
            <EstimatePaper data={info} pdfRef={pdfRef} pdfSubRef={pdfSubRef} gridRef={gridRef} position={true}/>
        </Modal>
    }

    const onCChange = (value: string, e: any) => {
        setInfo(v => {
            return {...v, managerAdminId: e.adminId, managerAdminName: e.name}
        })
    };

    return <Spin spinning={loading} tip={'견적의뢰 수정중...'}>
        {/*@ts-ignore*/}
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         type={'ESTIMATE'}
                         gridRef={gridRef}
                         setIsModalOpen={setIsModalOpen}/>
        <EstimateModal/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '510px' : '65px'} calc(100vh - ${mini ? 640 : 195}px)`,
                columnGap: 5
            }}>

                <MainCard title={'견적서 수정'} list={[
                    {name: '견적서 출력', func: printEstimate, type: 'default'},
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '복제', func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                        <TopBoxCard grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr 1fr'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
                            {/*{inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}*/}
                            <div>
                                <div style={{paddingBottom: 4.5, fontSize: 12}}>담당자</div>
                                <Select style={{width: '100%', fontSize: 12}} size={'small'}
                                        showSearch
                                        value={info['managerAdminId']}
                                        placeholder="Select a person"
                                        optionFilterProp="label"
                                        onChange={onCChange}
                                        options={options}
                                />
                            </div>
                            {inputForm({
                                title: 'Inquiry No.',
                                id: 'documentNumberFull',
                                placeholder: '폴더생성 규칙 유의',
                                onChange: onChange,
                                data: info, disabled: true
                            })}

                            {inputForm({title: 'RFQ No.', id: 'rfqNo', onChange: onChange, data: info})}
                            {inputForm({title: '프로젝트 제목', id: 'projectTitle', onChange: onChange, data: info})}
                        </TopBoxCard>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: "180px 200px 200px 180px 1fr 300px",
                            gridColumnGap: 10,
                            paddingTop: 10
                        }}>

                            <BoxCard title={'매입처 정보'}>
                                {inputForm({
                                    title: '매입처코드',
                                    id: 'agencyCode',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('agencyCode');
                                        }
                                    }/>,
                                    onChange: onChange,
                                    data: info,
                                    handleKeyPress: handleKeyPress
                                })}
                                {inputForm({
                                    title: '매입처명',
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
                                    title: '매입처이메일',
                                    id: 'agencyManagerEmail',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '연락처',
                                    id: 'agencyManagerPhoneNumber',
                                    onChange: onChange,
                                    data: info
                                })}
                            </BoxCard>

                            <BoxCard title={'고객사 정보'}>
                                {inputForm({
                                    title: '고객사명',
                                    id: 'customerName',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('customerName');
                                        }
                                    }/>, onChange: onChange, data: info, handleKeyPress: handleKeyPress
                                })}
                                {inputForm({
                                    title: '담당자',
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

                            <BoxCard title={'운송 정보'}>
                                {selectBoxForm({
                                    title: '유효기간', id: 'validityPeriod', list: [
                                        {value: '견적 발행 후 10일간', label: '견적 발행 후 10일간'},
                                        {value: '견적 발행 후 30일간', label: '견적 발행 후 30일간'},
                                    ], onChange: onChange, data: info
                                })}
                                {selectBoxForm({
                                    title: '결제조건', id: 'paymentTerms', list: [
                                        {value: '발주시 50% / 납품시 50%', label: '발주시 50% / 납품시 50%'},
                                        {value: '현금결제', label: '현금결제'},
                                        {value: '선수금', label: '선수금'},
                                        {value: '정기 결제', label: '정기 결제'},
                                    ], onChange: onChange, data: info
                                })}

                                {selectBoxForm({
                                    title: '운송조건', id: 'shippingTerms', list: [
                                        {value: '귀사도착도', label: '귀사도착도'},
                                        {value: '화물 및 택배비 별도', label: '화물 및 택배비 별도'},
                                    ], onChange: onChange, data: info
                                })}
                                {inputNumberForm({
                                    title: '납기',
                                    id: 'delivery',
                                    onChange: onChange,
                                    data: info,
                                    addonAfter: <span style={{fontSize: 11}}>주</span>
                                })}
                                {inputNumberForm({
                                    title: '환율',
                                    id: 'exchangeRate',
                                    onChange: onChange,
                                    data: info,
                                    step: 0.01
                                })}
                            </BoxCard>
                            <BoxCard title={'Maker 정보'}>
                                {inputForm({
                                    title: 'Maker',
                                    id: 'maker',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('maker');
                                        }
                                    }/>
                                    , onChange: onChange, data: info, handleKeyPress: handleKeyPress
                                })}
                                {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                            </BoxCard>
                            <BoxCard title={'ETC'}>
                                {textAreaForm({
                                    title: '지시사항',
                                    rows: 6,
                                    id: 'instructions',
                                    onChange: onChange,
                                    data: info
                                })}
                                {textAreaForm({title: '비고란', rows: 5, id: 'remarks', onChange: onChange, data: info})}
                            </BoxCard>
                            <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                {/*@ts-ignored*/}
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     numb={3}/>
                                </div>
                            </BoxCard>
                        </div>
                    </div> : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    onGridReady={onGridReady}
                    columns={tableEstimateWriteColumns}
                    type={'write'}
                    funcButtons={['estimateUpload', 'estimateAdd', 'delete', 'print']}
                />
            </div>
        </>

    </Spin>
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {estimateId} = ctx.query;

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));

        const result = await getData.post('estimate/getEstimateDetail', {
            estimateId: estimateId,
            documentNumberFull: ""
        });

        const dataInfo = result?.data?.entity;
        return {
            props: {dataInfo: dataInfo ? dataInfo : null}
        }
    }
})