import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {CopyOutlined, DownloadOutlined, FileSearchOutlined, PlusSquareOutlined, SaveOutlined} from "@ant-design/icons";
import {tableEstimateWriteColumns} from "@/utils/columnList";
import {estimateDetailUnit, estimateWriteInitial, ModalInitList} from "@/utils/initialList";
import Button from "antd/lib/button";
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
    MainCard,
    selectBoxForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import _ from "lodash";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {checkInquiryNo, saveEstimate} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";

const listType = 'estimateDetailList'
export default function EstimateWrite({dataInfo}) {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyInit = _.cloneDeep(estimateWriteInitial)
    const copyUnitInit = _.cloneDeep(estimateDetailUnit)

    const userInfo = useAppSelector((state) => state.user);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        createBy: userInfo['name'],
        managerAdminName: userInfo['name']
    }
    const infoInit = {
        ...copyInit,
    }

    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})
    const [mini, setMini] = useState(true);
    const [validate, setValidate] = useState({agencyCode : !!dataInfo});
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);


    const onGridReady = (params) => {
        gridRef.current = params.api;
        const copyData = _.cloneDeep(info);
        delete copyData?.createdDate;
        delete copyData?.modifiedDate;
        const result = dataInfo?.estimateDetailList;
        setInfo(copyData);
        params.api.applyTransaction({add: result ? result : []});
    };


    async function handleKeyPress(e) {

        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal, setValidate)
                    break;
                case 'connectDocumentNumberFull' :
                    const result = await findDocumentInfo(e, setInfo);
                    setInfo(v=>{
                        return {...result, connectDocumentNumberFull: info.connectDocumentNumberFull, documentNumberFull :v.documentNumberFull }
                    })
                    if(result['agencyCode']){
                     setValidate(v=>{return {agencyCode: true }})
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
        setValidate(v=> {
            return {...v, agencyCode: e.target.id === 'agencyCode' ? false : v.agencyCode}
        })
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        const list = gridManage.getAllData(gridRef);

        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }


        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, list)
        commonManage.getUploadList(fileRef, formData)

        formData.delete('createdDate')
        formData.delete('modifiedDate')



        await saveEstimate({data: formData, router: router})

    }


    function deleteList() {
        const list = commonManage.getUnCheckList(gridRef);
        gridManage.resetData(gridRef, list);
    }

    function addRow() {
        const newRow = {...copyUnitInit, "currency": commonManage.changeCurr(info['agencyCode'])};
        gridRef.current.applyTransaction({add: [newRow]});
    }

    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }

    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div style={{display: 'flex', alignItems: 'end'}}>
        <Button type={'primary'} size={'small'} style={{marginLeft: 5}}
                onClick={addRow}>
            <SaveOutlined/>추가
        </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{marginLeft: 5,}} onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
    </div>


    return <>

        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
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
                                {inputForm({title: '작성자', id: 'createBy', disabled: true, onChange: onChange, data: info})}
                                {inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}
                                {inputForm({
                                    title: 'INQUIRY NO.',
                                    id: 'documentNumberFull',
                                    placeholder: '폴더생성 규칙 유의',
                                    onChange: onChange,
                                    data: info,
                                    suffix:
                                        <PlusSquareOutlined style={{cursor: 'pointer'}} onClick={
                                            async (e) => {
                                                e.stopPropagation();
                                                if (!info['agencyCode']) {
                                                    return message.warn('매입처코드를 선택해주세요')
                                                }
                                                const returnDocumentNumb = await checkInquiryNo({data: {agencyCode: info['agencyCode'], type : 'ESTIMATE'}})
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
                                        }/>, onChange: onChange, handleKeyPress: handleKeyPress, data: info,   validate : validate['agencyCode']
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
                                            {value: '0', label: '견적 발행 후 10일간'},
                                            {value: '1', label: '견적 발행 후 30일간'},
                                        ], onChange: onChange, data: info
                                    })}
                                    {selectBoxForm({
                                        title: '결제조건', id: 'validityPeriod', list: [
                                            {value: '0', label: '발주시 50% / 납품시 50%'},
                                            {value: '1', label: '납품시 현금결제'},
                                            {value: '2', label: '정기결제'},
                                        ], onChange: onChange, data: info
                                    })}

                                    {selectBoxForm({
                                        title: '운송조건', id: 'shippingTerms', list: [
                                            {value: '0', label: '귀사도착도'},
                                            {value: '1', label: '화물 및 택배비 별도'},
                                        ], onChange: onChange, data: info
                                    })}
                                    {inputForm({title: 'Delivery(weeks)', id: 'delivery', onChange: onChange, data: info})}
                                    {inputForm({
                                        title: '환율',
                                        id: 'exchangeRate',
                                        placeholder: '직접기입(자동환율연결x)',
                                        onChange: onChange,
                                        data: info
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
                                <BoxCard title={'드라이브 목록'}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp infoFileInit={[]} fileRef={fileRef} numb={3}/>
                                    </div>
                                </BoxCard>
                            </div>
                        </div>
                        : <></>}
                </MainCard>
                <TableGrid
                    gridRef={gridRef}
                    columns={tableEstimateWriteColumns}
                    type={'write'}
                    onGridReady={onGridReady}
                    funcButtons={subTableUtil}
                />
            </div>
        </LayoutComponent>
    </>
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