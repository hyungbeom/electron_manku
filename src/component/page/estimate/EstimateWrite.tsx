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
import {commonFunc, commonManage, fileManage, gridManage} from "@/utils/commonManage";
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
import {checkInquiryNo, getAttachmentFileList, saveEstimate} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import EstimatePaper from "@/component/견적서/EstimatePaper";
import {getData} from "@/manage/function/api";
import Select from "antd/lib/select";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment";
import {estimateInfo, rfqInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";


const listType = 'estimateDetailList'
export default function EstimateWrite({copyPageInfo = {}}) {

    const groupRef = useRef<any>(null)

    const [memberList, setMemberList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);

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
    }, [info, memberList]);


    async function handleKeyPress(e) {

        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal, 'ESTIMATE')
                    break;
                case 'connectDocumentNumberFull' :
                   await getData.post('estimate/getEstimateRequestDetail', {
                        "estimateRequestId": '',
                        documentNumberFull: e.target.value.toUpperCase()
                    }).then(async v => {
                        if(v.data.code === 1){
                            const {attachmentFileList, estimateRequestDetail} = v.data?.entity
                            setFileList(fileManage.getFormatFiles(attachmentFileList))
                            setOriginFileList(attachmentFileList)
                            const dom = infoRef.current.querySelector('#connectDocumentNumberFull');
                            // const result = await findDocumentInfo(e, setInfo);
                            await getData.post('estimate/generateDocumentNumberFull', {
                                type: 'ESTIMATE',
                                documentNumberFull: dom.value.toUpperCase()
                            }).then(src => {

                                // delete result?.data?.entity?.estimateRequestList[0]?.adminId
                                // delete result?.data?.entity?.estimateRequestList[0]?.createdBy

                                commonManage.setInfo(infoRef, {
                                    ...estimateRequestDetail,
                                    documentNumberFull: src.data.code === 1 ? src.data.entity.newDocumentNumberFull : '',
                                    validityPeriod: '견적 발행 후 10일간',
                                    paymentTerms: '발주시 50% / 납품시 50%',
                                    shippingTerms: '귀사도착도',
                                    writtenDate: moment().format('YYYY-MM-DD'),
                                })
                                setTableData([...estimateRequestDetail['estimateRequestDetailList'], ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 100 - estimateRequestDetail['estimateRequestDetailList'].length)])
                            });


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

    async function saveFunc() {
        let infoData = commonManage.getInfo(infoRef, infoInit);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];


        if (!infoData['managerAdminId']) {
            return message.warn('담당자가 누락되었습니다.')
        }

        if (!infoData['documentNumberFull']) {
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

        setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(infoData, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)

        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await saveEstimate({data: formData}).then(async v=>{
            const {code, message : msg, entity} = v;

            if(code === 1){
                await getAttachmentFileList({
                    data: {
                        "relatedType": "ESTIMATE",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                        "relatedId": entity?.estimateId
                    }
                }).then(v => {
                    const list = fileManage.getFormatFiles(v);
                    setFileList(list)
                    setOriginFileList(v)
                    setLoading(false)
                })
                message.success(msg);
            }else{
                setLoading(false)
                message.warning(msg);
            }
        })


    }

    async function returnFunc(e, msg) {
        if (!e) {
            const inputElement = infoRef.current.querySelector('#documentNumberFull')
            if (inputElement) {
                inputElement.style.border = "1px solid red"; // 빨간색 테두리
                inputElement.style.boxShadow = "none"; // 그림자 제거
                inputElement.focus();
            }
            commonFunc.validateInput('documentNumberFull')
            message.error(msg)
        }




        setLoading(false)
    }


    function clearAll() {
        setInfo({...infoInit});
        // gridManage.deleteAll(gridRef);
    }


    return <div style={{overflow: 'hidden'}}><Spin spinning={loading} tip={'견적서 등록중...'}>

        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}

                         setIsModalOpen={setIsModalOpen}/>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '515px' : '65px'} calc(100vh - ${mini ? 615 : 195}px)`,
                overflowY: 'hidden',
                columnGap: 5
            }}>
                <MainCard title={'견적서 작성'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard grid={'100px 70px 70px 150px 150px 110px 300px'}>
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
                                            options.map(v => {
                                                return <option value={v.value}>{v.label}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                {/*{inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}*/}
                                {inputForm({
                                    title: 'Inquiry No.',
                                    id: 'documentNumberFull',

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
                                                // onChange({target: {id: 'documentNumberFull', value: returnDocumentNumb}})
                                            }
                                        }/>
                                })}
                                {inputForm({
                                    title: '연결 INQUIRY No.',
                                    id: 'connectDocumentNumberFull',
                                    suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>
                                    , handleKeyPress: handleKeyPress
                                })}
                                {inputForm({title: 'RFQ No.', id: 'rfqNo'})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                            </TopBoxCard>


                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "150px 200px 200px 180px 200px 250px",
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

                                <BoxCard title={'고객사 정보'}>
                                    {inputForm({
                                        title: '고객사명',
                                        id: 'customerName',
                                        suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('customerName');
                                            }
                                        }/>, handleKeyPress: handleKeyPress,
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
                                        min : 0,
                                        max : 10,
                                        addonAfter: '주'
                                    })}
                                    {inputNumberForm({
                                        title: '환율',
                                        id: 'exchangeRate',
                                        min : 0,
                                        step: 0.01,
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
                                        }/>, onChange: onChange, handleKeyPress: handleKeyPress, data: info
                                    })}
                                    {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                                </BoxCard>

                                <BoxCard title={'ETC'}>
                                    {textAreaForm({
                                        title: '지시사항',
                                        rows: 5,
                                        id: 'instructions',

                                    })}
                                    {textAreaForm({title: '비고란', rows: 5, id: 'remarks'})}
                                </BoxCard>
                                <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                         infoRef={infoRef}/>
                                    </div>
                                </BoxCard>
                            </div>
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
                <Table data={tableData} column={estimateInfo['write']} funcButtons={['print']} ref={tableRef}/>
            </div>
        </>
        {/*{ready && <EstimatePaper data={info} pdfRef={pdfRef} gridRef={gridRef}/>}*/}
    </Spin></div>
}
