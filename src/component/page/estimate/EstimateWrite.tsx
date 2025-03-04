import React, {useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {DownloadOutlined, FileSearchOutlined, PlusSquareOutlined, RetweetOutlined} from "@ant-design/icons";
import {tableEstimateWriteColumns} from "@/utils/columnList";
import {estimateDetailUnit, estimateRequestDetailUnit, estimateWriteInitial, ModalInitList} from "@/utils/initialList";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
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
import EstimatePaper from "@/component/견적서/EstimatePaper";
import {getData} from "@/manage/function/api";
import Select from "antd/lib/select";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";


const listType = 'estimateDetailList'
export default function EstimateWrite({ copyPageInfo = {}}) {

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


    const pdfRef = useRef(null);
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const [ready, setReady] = useState(false);

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

    const [info, setInfo] = useState<any>({...copyInit, ...adminParams})
    const [mini, setMini] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const [fileList, setFileList] = useState([]);

    const [loading, setLoading] = useState(false);


    const onGridReady = (params) => {
        gridRef.current = params.api;
        setInfo(isEmptyObj(copyPageInfo['estimate_write'])?copyPageInfo['estimate_write'] : infoInit);
        params.api.applyTransaction({add: copyPageInfo['estimate_write'][listType] ? copyPageInfo['estimate_write'][listType] : commonFunc.repeatObject(estimateDetailUnit, 10)});
        setReady(true)
    };

    useEffect(() => {
        if(ready) {
            if(!isEmptyObj(copyPageInfo['estimate_write'])){
                setInfo(infoInit);
                gridManage.resetData(gridRef,commonFunc.repeatObject(estimateDetailUnit, 10))
            }else{
                setInfo({...copyPageInfo['estimate_write'], ...adminParams});
                gridManage.resetData(gridRef, copyPageInfo['estimate_write'][listType])
            }
        }
    }, [copyPageInfo['estimate_write']]);

    async function handleKeyPress(e) {

        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal, 'ESTIMATE')
                    break;
                case 'connectDocumentNumberFull' :


                    const result = await getData.post('estimate/getEstimateRequestList', {
                        "searchStartDate": "",              // 작성일자 시작일
                        "searchEndDate": "",                // 작성일자 종료일
                        "searchDocumentNumber": e.target.value.toUpperCase(),         // 문서번호
                        "searchCustomerName": "",           // 거래처명
                        "searchMaker": "",                  // MAKER
                        "searchModel": "",                  // MODEL
                        "searchItem": "",                   // ITEM
                        "searchCreatedBy": "",              // 등록직원명
                        "searchRfqNo": "",                  // 견적의뢰 RFQ No
                        "searchProjectTitle": "",           // 프로젝트 제목
                        "searchEndUser": "",                // End User
                        "searchStartDueDate": "",           // 마감일 검색 시작일
                        "searchEndDueDate": "",             // 마감일 검색 종료일
                        "searchAgencyManagerName": "",      // 대리점 담당자 이름
                        "searchAgencyName": "",             // 대리점 명

                        // 메일 전송 목록 검색 필드 추가 2024.11.28
                        "searchSentStatus": null,              // 전송 여부 1: 전송, 2: 미전송
                        "searchReplyStatus": null,             // 회신 여부 1: 회신, 2: 미회신
                        "searchAgencyCode": "",          // 대리점코드 검색

                        "page": 1,
                        "limit": -1
                    });


                    // const result = await findDocumentInfo(e, setInfo);
                    await getData.post('estimate/generateDocumentNumberFull', {
                        type: 'ESTIMATE',
                        documentNumberFull: info.connectDocumentNumberFull.toUpperCase()
                    }).then(src => {

                        delete result?.data?.entity?.estimateRequestList[0]?.adminId
                        setInfo(v => {
                            return {
                                ...result.data.entity.estimateRequestList[0],
                                managerAdminName: v.managerAdminName,
                                connectDocumentNumberFull: v.connectDocumentNumberFull.toUpperCase(),
                                documentNumberFull: src.data.code === 1 ? src.data.entity.newDocumentNumberFull : v.documentNumberFull,
                                validityPeriod: '견적 발행 후 10일간',
                                paymentTerms: '발주시 50% / 납품시 50%',
                                shippingTerms: '귀사도착도'
                            }
                        });
                    });
                    gridManage.resetData(gridRef, result.data.entity.estimateRequestList);
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

    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        const list = gridManage.getAllData(gridRef);
        setInfo(v => {
            return {...v, estimateDetailList: list}
        })

        if (!info['documentNumberFull']) {

            return message.warn('INQUIRY NO. 정보가 누락되었습니다.')
        }

        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }

        const filterList = list.filter(v => !!v.model);

        if (!filterList.length) {
            return message.warn('유효한 하위 데이터 1개 이상이여야 합니다');
        }

        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, filterList)
        const resultCount = commonManage.getUploadList(fileRef, formData)


        formData.delete('createdDate')
        formData.delete('modifiedDate')


        const pdf = await commonManage.getPdfCreate(pdfRef);
        const result = await commonManage.getPdfFile(pdf, info.documentNumberFull);


        formData.append(`attachmentFileList[${resultCount}].attachmentFile`, result);
        formData.append(`attachmentFileList[${resultCount}].fileName`, `03.${resultCount + 1} ${result.name}`);

        setLoading(true)
        await saveEstimate({data: formData, router: router, returnFunc: returnFunc})
        setLoading(false)
    }

    function returnFunc(code, msg) {
        if (code === -20001) {
            const inputElement = document.getElementById("documentNumberFull");
            if (inputElement) {
                inputElement.style.border = "1px solid red"; // 빨간색 테두리
                inputElement.style.boxShadow = "none"; // 그림자 제거
                inputElement.focus();
            }
            commonFunc.validateInput('documentNumberFull')
            message.error(msg)
        } else {
            message.error(msg)
        }
        setLoading(false)
    }


    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }

    const onCChange = (value: string, e: any) => {
        setInfo(v => {
            return {...v, managerAdminId: e.adminId, managerAdminName: e.name}
        })
    };


    return <Spin spinning={loading} tip={'견적서 등록중...'}>

        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         gridRef={gridRef}
                         setIsModalOpen={setIsModalOpen} type={'ESTIMATE'}/>

        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '510px' : '65px'} calc(100vh - ${mini ? 640 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'견적서 작성'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
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
                                <div>
                                    <div style={{paddingBottom: 4.5, fontSize : 12}}>담당자</div>
                                    <Select style={{width: '100%', fontSize : 12}} size={'small'}
                                            showSearch
                                            value={info['managerAdminId']}
                                            placeholder="Select a person"
                                            optionFilterProp="label"
                                            onChange={onCChange}
                                            options={options}
                                    />
                                </div>
                                {/*{inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}*/}
                                {inputForm({
                                    title: 'INQUIRY NO.',
                                    id: 'documentNumberFull',
                                    placeholder: '폴더생성 규칙 유의',
                                    onChange: onChange,
                                    data: info,

                                    suffix:
                                        <RetweetOutlined style={{cursor: 'pointer'}} onClick={
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


                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "150px 200px 200px 180px 1fr 300px",
                                gap: 10,
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
                                        handleKeyPress: handleKeyPress,
                                        data: info,

                                    })}
                                    {inputForm({
                                        title: '매입처명',
                                        id: 'agencyName',
                                        onChange: onChange,
                                        data: info,

                                    })}
                                    {inputForm({
                                        title: '담당자',
                                        id: 'agencyManagerName',
                                        onChange: onChange,
                                        data: info,
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
                                        }/>, onChange: onChange, handleKeyPress: handleKeyPress, data: info
                                    })}
                                    {inputForm({
                                        title: '담당자명',
                                        id: 'managerName',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '전화번호',
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
                                        title: 'Delivery',
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
                                        step: 0.01,
                                        addonAfter: <span style={{fontSize: 11}}>%</span>
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
                                        rows: 5,
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
        </>
        {/*{ready && <EstimatePaper data={info} pdfRef={pdfRef} gridRef={gridRef}/>}*/}
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