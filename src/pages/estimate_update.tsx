import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {
    CopyOutlined,
    DownCircleFilled,
    DownloadOutlined,
    EditOutlined,
    FileSearchOutlined,
    SaveOutlined,
    UpCircleFilled
} from "@ant-design/icons";
import {tableEstimateWriteColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateDetailUnit, ModalInitList} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Select from "antd/lib/select";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import PrintEstimate from "@/component/printEstimate";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {updateEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {DriveUploadComp} from "@/component/common/SharePointComp";


const listType = 'estimateDetailList'
export default function estimate_update({dataInfo}) {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();



    const copyUnitInit = _.cloneDeep(estimateDetailUnit)

    const infoInit = dataInfo?.estimateDetail
    const infoFileInit = dataInfo?.attachmentFileList


    const userInfo = useAppSelector((state) => state.user);

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);



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
    }


    async function saveFunc() {
        const list = gridManage.getAllData(gridRef)
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }



        const formData:any = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                if (key !== listType) {
                        formData.append(key, value);
                }
            }
        };

        handleIteration();

        if (list.length) {
            list.forEach((detail, index) => {
                Object.keys(detail).forEach((key) => {
                    if(!(key == 'orderDate' || key === 'orderProcessing'|| key === 'order') )
                        formData.append(`${listType}[${index}].${key}`, detail[key]);
                });
            });
        }

        const uploadContainer = document.querySelector(".ant-upload-list"); // 업로드 리스트 컨테이너

        if (uploadContainer) {
            const fileNodes = uploadContainer.querySelectorAll(".ant-upload-list-item-name");
            const fileNames = Array.from(fileNodes).map((node:any) => node.textContent.trim());

            let count = 0
            fileRef.current.fileList.forEach((item, index) => {
                if(item?.originFileObj){
                    formData.append(`attachmentFileList[${count}].attachmentFile`, item.originFileObj);
                    formData.append(`attachmentFileList[${count}].fileName`, fileNames[index].replace(/\s+/g, ""));
                    count += 1;
                }
            });

        }
        //기존 기준 사라진 파일
        const result = infoFileInit.filter(itemA => !fileRef.current.fileList.some(itemB => itemA.id === itemB.id));
        result.map((v, idx) => {
            formData.append(`deleteAttachementIdList[${idx}]`, v.id);
        })

        await updateEstimate({data: formData})
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

    function addRow() {
        const newRow = {...copyUnitInit, "currency": commonManage.changeCurr(info['agencyCode'])};
        gridRef.current.applyTransaction({add: [newRow]});
    }


    async function printEstimate() {
        const list = gridManage.getAllData(gridRef)
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        setIsPrintModalOpen(true)
    }

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
        {/*@ts-ignore*/}
        <SearchInfoModal  info={info} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>
        <PrintEstimate data={info} isModalOpen={isPrintModalOpen} userInfo={userInfo}
                       setIsModalOpen={setIsPrintModalOpen} gridRef={gridRef}/>
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
                                data: info, disabled:true
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
                                    }/>, onChange: onChange, data: info, handleKeyPress : handleKeyPress
                                })}
                                {inputForm({title: '매입처명', id: 'agencyName', onChange: onChange, data: info,  disabled: true})}
                                {inputForm({title: '담당자', id: 'agencyManagerName', onChange: onChange, data: info,  disabled: true})}
                                {inputForm({
                                    title: '연락처',
                                    id: 'agencyManagerPhoneNumber',
                                    onChange: onChange,
                                    data: info,  disabled: true
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
                                    }/>, onChange: onChange, data: info, handleKeyPress : handleKeyPress
                                })}
                                {inputForm({title: '담당자', id: 'managerName', onChange: onChange, data: info,  disabled: true})}
                                {inputForm({title: '전화번호', id: 'phoneNumber', onChange: onChange, data: info,  disabled: true})}
                                {inputForm({title: '팩스', id: 'faxNumber', onChange: onChange, data: info,  disabled: true})}
                                {inputForm({title: '이메일', id: 'customerManagerEmail', onChange: onChange, data: info,  disabled: true})}
                            </BoxCard>

                            <BoxCard title={'운송 정보'}>
                                {selectBoxForm({
                                    title: '유효기간', id: 'validityPeriod', list: [
                                        {value: '0', label: '견적 발행 후 10일간'},
                                        {value: '1', label: '견적 발행 후 30일간'},
                                    ], onChange: onChange, data: info
                                })}
                                {selectBoxForm({
                                    title: '결제조건', id: 'paymentTerms', list: [
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
                                {inputForm({title: '환율', id: 'exchangeRate', onChange: onChange, data: info})}
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
                                    , onChange: onChange, data: info, handleKeyPress : handleKeyPress
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
                            <BoxCard title={'드라이브 목록'}>
                                {/*@ts-ignored*/}
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp infoFileInit={infoFileInit} fileRef={fileRef} numb={3}/>
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
                    funcButtons={subTableUtil}
                />
            </div>
        </LayoutComponent>
    </>
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