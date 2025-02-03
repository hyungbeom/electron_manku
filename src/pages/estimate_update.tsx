import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
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
import EstimatePaper from "@/component/견적서/EstimatePaper";


const listType = 'estimateDetailList'
export default function estimate_update({dataInfo}) {
    const pdfRef = useRef(null);
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const infoInit = dataInfo?.estimateDetail
    const infoInitFile = dataInfo?.attachmentFileList

    const userInfo = useAppSelector((state) => state.user);

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [validate, setValidate] = useState({agencyCode: true});
    const [fileList, setFileList] = useState(fileManage.getFormatFiles(infoInitFile));
    const [originFileList, setOriginFileList] = useState(infoInitFile);
    const [loading, setLoading] = useState(false);
    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo?.estimateDetail[listType]});
    };

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal, 'ESTIMATE', setValidate)
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
            setValidate(v => {
                return {...v, agencyCode: false}
            })
        }
        commonManage.onChange(e, setInfo)
    }


    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        const list = gridManage.getAllData(gridRef)
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }

        // setLoading(true)
        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, list)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)

        await updateEstimate({data: formData, returnFunc: returnFunc})
    }

    async function returnFunc(e) {
        console.log(e, 'e:')
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

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/estimate_write?${query}`)
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
        setIsPrintModalOpen(true)
    }

    async function getPdfFile() {
        const pdf = await commonManage.getPdfCreate(pdfRef);
        pdf.save(`${info.documentNumberFull}_견적서.pdf`);
    }

    function print(){
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
                       <Button style={{fontSize: 11, marginRight: 10}} size={'small'} onClick={getPdfFile}>다운로드</Button>
                       <Button style={{fontSize: 11}}  size={'small'} onClick={print}>인쇄</Button>
                </span>
            </div>}
            onCancel={() => setIsPrintModalOpen(false)}
            open={isPrintModalOpen}
            width={1000}
            footer={null}
            onOk={() => setIsPrintModalOpen(false)}>
            <EstimatePaper data={info} pdfRef={pdfRef} gridRef={gridRef}/>
        </Modal>
    }


    return <Spin spinning={loading} tip={'견적의뢰 수정중...'}>
        {/*@ts-ignore*/}
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         type={'ESTIMATE'}
                         gridRef={gridRef}
                         setValidate={setValidate}
                         setIsModalOpen={setIsModalOpen}/>
        <EstimateModal/>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '500px' : '65px'} calc(100vh - ${mini ? 555 : 120}px)`,
                columnGap: 5
            }}>

                <MainCard title={'견적서 수정'} list={[
                    {name: '견적서 출력', func: printEstimate, type: 'default'},
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '복제', func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                        <TopBoxCard title={'기본 정보'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr 1fr'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
                            {inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}
                            {inputForm({
                                title: 'INQUIRY NO.',
                                id: 'documentNumberFull',
                                placeholder: '폴더생성 규칙 유의',
                                onChange: onChange,
                                data: info, disabled: true
                            })}

                            {inputForm({title: 'RFQ NO.', id: 'rfqNo', onChange: onChange, data: info})}
                            {inputForm({title: '프로젝트 제목', id: 'projectTitle', onChange: onChange, data: info})}
                        </TopBoxCard>

                        <div style={{display: 'grid', gridTemplateColumns: "150px 200px 200px 180px 1fr 300px"}}>

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
                                    handleKeyPress: handleKeyPress,
                                    validate: validate['agencyCode']
                                })}
                                {inputForm({
                                    title: '매입처명',
                                    id: 'agencyName',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true
                                })}
                                {inputForm({
                                    title: '담당자',
                                    id: 'agencyManagerName',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true
                                })}
                                {inputForm({
                                    title: '연락처',
                                    id: 'agencyManagerPhoneNumber',
                                    onChange: onChange,
                                    data: info, disabled: true
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
                                    data: info,
                                    disabled: true
                                })}
                                {inputForm({
                                    title: '전화번호',
                                    id: 'phoneNumber',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true
                                })}
                                {inputForm({
                                    title: '팩스',
                                    id: 'faxNumber',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true
                                })}
                                {inputForm({
                                    title: '이메일',
                                    id: 'customerManagerEmail',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true
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
                                        {value: '납품시 현금결제', label: '납품시 현금결제'},
                                        {value: '정기결제', label: '정기결제'},
                                    ], onChange: onChange, data: info
                                })}

                                {selectBoxForm({
                                    title: '운송조건', id: 'shippingTerms', list: [
                                        {value: '귀사도착도', label: '귀사도착도'},
                                        {value: '화물 및 택배비 별도', label: '화물 및 택배비 별도'},
                                    ], onChange: onChange, data: info
                                })}
                                {inputNumberForm({
                                    title: 'Delivery(weeks)',
                                    id: 'delivery',
                                    onChange: onChange,
                                    data: info
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
                                    title: 'MAKER',
                                    id: 'maker',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('maker');
                                        }
                                    }/>
                                    , onChange: onChange, data: info, handleKeyPress: handleKeyPress
                                })}
                                {inputForm({title: 'ITEM', id: 'item', onChange: onChange, data: info})}
                            </BoxCard>
                            <BoxCard title={'ETC'}>
                                {textAreaForm({
                                    title: '지시사항',
                                    rows: 2,
                                    id: 'instructions',
                                    onChange: onChange,
                                    data: info
                                })}
                                {textAreaForm({title: '비고란', rows: 3, id: 'remarks', onChange: onChange, data: info})}
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
        </LayoutComponent>
        <div style={{marginTop: 200}}/>

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