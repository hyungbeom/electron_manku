import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {DownloadOutlined, FileSearchOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {tableEstimateWriteColumns} from "@/utils/columnList";
import {estimateDetailUnit, estimateWriteInitial, ModalInitList} from "@/utils/initialList";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {commonManage, gridManage} from "@/utils/commonManage";
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
import _ from "lodash";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {checkInquiryNo, saveEstimate} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import Test from "@/pages/test";

const listType = 'estimateDetailList'
export default function EstimateWrite({dataInfo}) {
    const pdfRef = useRef(null);
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyInit = _.cloneDeep(estimateWriteInitial);
    const copyUnitInit = _.cloneDeep(estimateDetailUnit);

    const userInfo = useAppSelector((state) => state.user);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        createdBy: userInfo['name'],
        managerAdminName: userInfo['name']
    }

    const infoInit = {
        ...copyInit,
        ...adminParams
    }

    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})
    const [mini, setMini] = useState(true);
    const [validate, setValidate] = useState({agencyCode: !!dataInfo, documentNumberFull: true});
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const [fileList, setFileList] = useState([]);

    const [loading, setLoading] = useState(false);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        const result = dataInfo?.estimateDetailList;
        params.api.applyTransaction({add: result ? result : []});
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
                    const result = await findDocumentInfo(e, setInfo);
                    console.log(result, 'result:')
                    setInfo(v => {
                        return {
                            ...result,
                            connectDocumentNumberFull: info.connectDocumentNumberFull,
                            documentNumberFull: v.documentNumberFull
                        }
                    })
                    if (result?.agencyCode) {
                        setValidate(v => {
                            return {...v, agencyCode: true}
                        })
                    }
                    gridManage.resetData(gridRef, result?.estimateRequestDetailList);
                    break;
            }
        }
    }


    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {
        setValidate(v => {
            return {...v, agencyCode: e.target.id === 'agencyCode' ? false : v.agencyCode}
        })
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        const list = gridManage.getAllData(gridRef);
        setInfo(v => {
            return {...v, estimateDetailList: list}
        })

        if (!info['documentNumberFull']) {
            setValidate(v => {
                return {...v, documentNumberFull: false}
            })
            return message.warn('INQUIRY NO. 정보가 누락되었습니다.')
        }

        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }

        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, list)
        const resultCount = commonManage.getUploadList(fileRef, formData)


        formData.delete('createdDate')
        formData.delete('modifiedDate')


        const pdf = await commonManage.getPdfCreate(pdfRef);
        const result = await commonManage.getPdfFile(pdf, info.documentNumberFull);


        formData.append(`attachmentFileList[${resultCount}].attachmentFile`, result);
        formData.append(`attachmentFileList[${resultCount}].fileName`, result.name);


        setLoading(true)
        await saveEstimate({data: formData, router: router})

    }


    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }


    return <Spin spinning={loading} tip={'견적의뢰 등록중...'}>

        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         gridRef={gridRef}
                         setValidate={setValidate}
                         setIsModalOpen={setIsModalOpen} type={'ESTIMATE'}/>

        <LayoutComponent>
            <div style={{
                display: 'grid',

                gridTemplateRows: `${mini ? '510px' : '65px'} calc(100vh - ${mini ? 565 : 120}px)`,
                columnGap: 5
            }}>
                <MainCard title={'견적서 작성'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr 1fr '}>
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
                                    data: info,
                                    validate: validate['documentNumberFull'],
                                    suffix:
                                        <PlusSquareOutlined style={{cursor: 'pointer'}} onClick={
                                            async (e) => {
                                                e.stopPropagation();
                                                if (!info['agencyCode']) {
                                                    return message.warn('매입처코드를 선택해주세요')
                                                }
                                                const returnDocumentNumb = await checkInquiryNo({
                                                    data: {
                                                        agencyCode: info['agencyCode'],
                                                        type: 'ESTIMATE'
                                                    }
                                                })
                                                onChange({target: {id: 'documentNumberFull', value: returnDocumentNumb}})
                                            }
                                        }/>
                                })}
                                {inputForm({
                                    placeholder: '폴더생성 규칙 유의',
                                    title: '연결 INQUIRY No.',
                                    id: 'connectDocumentNumberFull',
                                    suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>
                                    , onChange: onChange, data: info, handleKeyPress: handleKeyPress
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
                                        handleKeyPress: handleKeyPress,
                                        data: info,
                                        validate: validate['agencyCode']
                                    })}
                                    {inputForm({
                                        title: '매입처명',
                                        id: 'agencyName',
                                        onChange: onChange,
                                        data: info,
                                        disabled: true,

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
                                        }/>, onChange: onChange, handleKeyPress: handleKeyPress, data: info
                                    })}
                                    {inputForm({
                                        title: '담당자명',
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
                                        }/>, onChange: onChange, handleKeyPress: handleKeyPress, data: info
                                    })}
                                    {inputForm({title: 'ITEM', id: 'item', onChange: onChange, data: info})}
                                </BoxCard>

                                <BoxCard title={'ETC'}>
                                    {textAreaForm({
                                        title: '지시사항',
                                        rows: 4,
                                        id: 'instructions',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {textAreaForm({title: '비고란', rows: 4, id: 'remarks', onChange: onChange, data: info})}
                                </BoxCard>
                                <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                         numb={3}/>
                                    </div>
                                </BoxCard>
                            </div>
                        </div>
                        : <></>}
                </MainCard>
                <TableGrid
                    setInfo={setInfo}
                    gridRef={gridRef}
                    columns={tableEstimateWriteColumns}
                    type={'write'}
                    onGridReady={onGridReady}
                    funcButtons={['estimateUpload', 'estimateAdd', 'delete', 'print']}
                />
            </div>
        </LayoutComponent>
        <Test data={info} pdfRef={pdfRef} gridRef={gridRef}/>
    </Spin>
}
// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {query} = ctx;
    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    store.dispatch(setUserInfo(userInfo));
    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data}}
    }
})