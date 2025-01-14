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
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";
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

    console.log(infoInit,'infoInit:')

    const userInfo = useAppSelector((state) => state.user);

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    const inputForm = ({placeholder = '', title, id, disabled = false, suffix = null}) => {
        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   placeholder={placeholder}
                   onChange={onChange}
                   onKeyDown={handleKeyPress}
                   size={'small'}
                   suffix={suffix}
            />
        </div>
    }

    const textAreaForm = ({title, id, rows = 5, disabled = false}) => {
        return <div>
            <div>{title}</div>
            <TextArea style={{resize: 'none'}} rows={rows} id={id} value={info[id]} disabled={disabled}
                      onChange={onChange}
                      size={'small'}/>
        </div>
    }


    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={moment(info[id]).isValid() ? moment(info[id]) : ''} style={{width: '100%'}}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: moment(date).format('YYYY-MM-DD')
                            }
                        })
                        }
                        disabled={disabled}
                        id={id} size={'small'}/>
        </div>
    }

    const selectBoxForm = ({title, id, option}) => {
        return <div>
            <div>{title}</div>
            <Select id={'shippingTerms'} defaultValue={'0'}
                    onChange={(src) => onChange({target: {id: 'shippingTerms', value: src}})}
                    size={'small'} value={info[id]} options={option} style={{width: '100%',}}/>
        </div>
    }

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
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }
        if (!info[listType].length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
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

        const copyData = {...info}


        if (copyData[listType].length) {
            copyData[listType].forEach((detail, index) => {
                Object.keys(detail).forEach((key) => {
                    if(!(key == 'orderDate' || key === 'orderProcessing'|| key === 'order') )
                        formData.append(`${listType}[${index}].${key}`, detail[key]);
                });
            });
        }

        const filesToSave = fileRef.current.fileList.map((item) => item.originFileObj).filter((file) => file instanceof File);

        //새로 추가되는 파일
        filesToSave.forEach((file, index) => {
            formData.append(`attachmentFileList[${index}].attachmentFile`, file);
            formData.append(`attachmentFileList[${index}].fileName`, file.name.replace(/\s+/g, ""));
        });

        //기존 기준 사라진 파일
        const result = infoFileInit.filter(itemA => !fileRef.current.fileList.some(itemB => itemA.id === itemB.id));
        result.map((v, idx) => {
            formData.append(`deleteAttachementIdList[${idx}]`, v.id);
        })

        for (const [key, value] of formData.entries()) {
            console.log(`Key: ${key}, Value: ${value}:::::::::`);
        }
        await updateEstimate({data: formData})
    }

     function moveWrite() {
         router?.push('/estimate_write')
    }


    function deleteList() {
        let copyData = {...info}
        copyData[listType] = copyData[listType] = commonManage.getUnCheckList(gridRef.current.api);
        setInfo(copyData);
    }

    function addRow() {
        let copyData = {...info};
        copyData[listType].push({
            ...copyUnitInit,
            "currency": commonManage.changeCurr(info['agencyCode'])
        })
        setInfo(copyData)
    }


    async function printEstimate() {
        setIsPrintModalOpen(true)
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
        {/*@ts-ignore*/}
        <SearchInfoModal  info={info} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>
        <PrintEstimate data={info} isModalOpen={isPrintModalOpen} userInfo={userInfo}
                       setIsModalOpen={setIsPrintModalOpen}/>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>

                <MainCard title={'견적서 수정'} list={[
                    {name: '견적서 출력', func: printEstimate, type: 'default'},
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '신규작성', func: moveWrite, type: 'danger'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                        <TopBoxCard title={'기본 정보'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr 1fr'}>
                            {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true})}
                            {inputForm({title: '담당자', id: 'managerAdminName'})}
                            {inputForm({title: 'INQUIRY NO.', id: 'documentNumberFull', placeholder: '폴더생성 규칙 유의'})}
                            {inputForm({
                                placeholder: '폴더생성 규칙 유의',
                                title: '연결 INQUIRY No.',
                                id: 'connectDocumentNumberFull',
                                suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>
                            })}
                            {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                            {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
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
                                    }/>
                                })}
                                {inputForm({title: '매입처명', id: 'agencyName'})}
                                {inputForm({title: '담당자', id: 'agencyManagerName'})}
                                {inputForm({title: '연락처', id: 'agencyManagerPhoneNumber'})}
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
                                    }/>
                                })}
                                {inputForm({title: '담당자', id: 'managerName'})}
                                {inputForm({title: '전화번호', id: 'phoneNumber'})}
                                {inputForm({title: '팩스', id: 'faxNumber'})}
                                {inputForm({title: '이메일', id: 'customerManagerEmail'})}
                            </BoxCard>

                            <BoxCard title={'운송 정보'}>
                                {selectBoxForm({
                                    title: '유효기간', id: 'validityPeriod', option: [
                                        {value: '0', label: '견적 발행 후 10일간'},
                                        {value: '1', label: '견적 발행 후 30일간'},
                                    ]
                                })}
                                {selectBoxForm({
                                    title: '결제조건', id: 'paymentTerms', option: [
                                        {value: '0', label: '발주시 50% / 납품시 50%'},
                                        {value: '1', label: '납품시 현금결제'},
                                        {value: '2', label: '정기결제'},
                                    ]
                                })}
                                {selectBoxForm({
                                    title: '운송조건', id: 'shippingTerms', option: [
                                        {value: '0', label: '귀사도착도'},
                                        {value: '1', label: '화물 및 택배비 별도'},
                                    ]
                                })}
                                {inputForm({title: 'Delivery(weeks)', id: 'delivery'})}
                                {inputForm({title: '환율', id: 'exchangeRate'})}
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
                                })}
                                {inputForm({title: 'ITEM', id: 'item'})}
                            </BoxCard>
                            <BoxCard title={'ETC'}>
                                {textAreaForm({title: '지시사항', rows: 2, id: 'instructions'})}
                                {textAreaForm({title: '비고란', rows: 3, id: 'remarks'})}
                            </BoxCard>
                            <BoxCard title={'드라이브 목록'}>
                                   {/*@ts-ignored*/}
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp infoFileInit={infoFileInit} fileRef={fileRef}/>
                                </div>
                            </BoxCard>
                        </div>
                    </div> : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={tableEstimateWriteColumns}
                    tableData={info[listType]}
                    listType={'estimateId'}
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


        return {
            props: {dataInfo: result?.data?.entity}
        }
    }
})