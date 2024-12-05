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
import {BoxCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {updateEstimate} from "@/utils/api/mainApi";
import _ from "lodash";


const listType = 'estimateDetailList'
export default function estimate_update({dataInfo}) {
    const gridRef = useRef(null);
    const router = useRouter();


    const copyUnitInit = _.cloneDeep(estimateDetailUnit)

    const userInfo = useAppSelector((state) => state.user);

    const [info, setInfo] = useState<any>({
        ...dataInfo,
        writtenDate: moment(dataInfo['writtenDate'])
    })
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
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: date
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
        if (!info[listType].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');
            await updateEstimate({data: copyData})
        }
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
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>
                <PrintEstimate data={info} isModalOpen={isPrintModalOpen} userInfo={userInfo}
                               setIsModalOpen={setIsPrintModalOpen}/>
                {/*@ts-ignore*/}
                <SearchInfoModal type={'agencyList'} info={info} setInfo={setInfo}
                                 open={isModalOpen}
                                 setIsModalOpen={setIsModalOpen}/>

                <Card title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 14, fontWeight: 550}}>견적서 수정</div>
                    <div>
                        <Button type={'default'} size={'small'} style={{marginRight: 8}}
                                onClick={printEstimate}><SaveOutlined/>견적서 출력</Button>
                        <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                onClick={saveFunc}><SaveOutlined/>수정</Button>
                        {/*@ts-ignored*/}
                        <Button size={'small'} type={'danger'} style={{marginRight: 8,}}
                                onClick={() => router?.push('/estimate_write')}><EditOutlined/>신규작성</Button>

                    </div>
                </div>} style={{fontSize: 12, border: '1px solid lightGray'}}
                      extra={<span style={{fontSize: 20, cursor: 'pointer'}} onClick={() => setMini(v => !v)}> {!mini ?
                          <DownCircleFilled/> : <UpCircleFilled/>}</span>}>

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

                    <div style={{display: 'grid', gridTemplateColumns: "150px 200px 200px 180px 1fr"}}>

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
                    </div>
                </Card>

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

        return {props: {dataInfo: estimateId ? result?.data?.entity?.estimateDetail : null}}
    }
})