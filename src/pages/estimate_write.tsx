import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {
    CopyOutlined, DownCircleFilled,
    DownloadOutlined, EditOutlined,
    FileSearchOutlined,
    RetweetOutlined,
    SaveOutlined, UpCircleFilled, UploadOutlined
} from "@ant-design/icons";
import {tableEstimateWriteColumns, tableOrderWriteColumn} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {
    estimateWriteInitial,
    ModalInitList, modalList,
    orderWriteInitial,
    rfqWriteInitial,
    tableOrderWriteInitial
} from "@/utils/initialList";
import {subOrderWriteInfo} from "@/utils/modalDataList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import * as XLSX from "xlsx";
import Select from "antd/lib/select";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import SearchAgendaModal from "@/component/SearchAgencyModal";
import SearchCustomerModal from "@/component/SearchCustomerModal";
import SearchAgencyModal from "@/component/SearchAgencyModal";
import SearchMakerModal from "@/component/SearchMakerModal";
import SearchInfoModal from "@/component/SearchAgencyModal";
import Upload from "antd/lib/upload";

const BoxCard = ({children, title}) => {
    return <Card size={'small'} title={title}
                 style={{
                     fontSize: 13,
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                 }}>
        {children}
    </Card>
}

export default function EstimateWrite({dataInfo}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>(estimateWriteInitial)
    const [mini, setMini] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const inputForm = ({title, id, disabled = false, suffix = null}) => {
        let bowl = info;

        // switch (id) {
        //     case 'customerName' :
        //     case 'managerName' :
        //     case 'phoneNumber' :
        //     case 'faxNumber' :
        //     case 'customerManagerEmail' :
        //         bowl = bowl['customerInfoList'][0]
        // }

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   suffix={suffix}
            />
        </div>
    }

    const textAreaForm = ({title, id, rows = 5, disabled = false}) => {
        return <div>
            <div>{title}</div>
            <TextArea rows={rows} id={id} value={info[id]} disabled={disabled}
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

    function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    searchFunc(e)
                    break;
                case 'documentNumberFull' :
                    findDocument(e);
                    break;
            }

        }
    }


    function openModal(e) {
        let bowl = {};
        bowl[e] = true
        setIsModalOpen(v => {
            return {...v, ...bowl}
        })
    }


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        switch (e.target.id) {
            case 'customerName' :
            case 'managerName' :
            case 'phoneNumber' :
            case 'faxNumber' :
            case 'customerManagerEmail' :
                setInfo(v => {
                    v['customerInfoList'][0][e.target.id] = e.target.value
                    return {...v}
                })
                break;

            default :
                setInfo(v => {
                    return {...v, ...bowl}
                })

        }

    }

    async function searchFunc(e) {

        const resultList = await getData.post(modalList[e.target.id]?.url, {
            "searchType": "1",
            "searchText": e.target.value,       // 대리점코드 or 대리점 상호명
            "page": 1,
            "limit": -1
        });

        const data = resultList?.data?.entity[modalList[e.target.id]?.list];
        const size = data?.length;

        if (size > 1) {
            return openModal(e.target.id);
        } else if (size === 1) {
            switch (e.target.id) {
                case 'agencyCode' :
                    const {agencyId, agencyCode, agencyName} = data[0];
                    setInfo(v => {
                        return {...v, agencyId: agencyId, agencyCode: agencyCode, agencyName: agencyName}
                    })
                    break;
                case 'customerName' :
                    const {customerName, managerName, directTel, faxNumber, email} = data[0];
                    setInfo(v => {
                        return {
                            ...v,
                            customerInfoList: [{
                                customerName: customerName,
                                managerName: managerName,
                                phoneNumber: directTel,
                                faxNumber: faxNumber,
                                customerManagerEmail: email
                            }]
                        }
                    })
                    break;

                case 'maker' :
                    break;

            }
        } else {
            message.warn('조회된 데이터가 없습니다.')
        }
    }

    async function saveFunc() {
        if (!info['estimateDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');

            await getData.post('estimate/addEstimate', copyData).then(v => {
                if (v.data.code === 1) {
                    message.success('저장되었습니다.')
                    setInfo(rfqWriteInitial);
                    deleteList()
                    window.location.href = '/estimate_read'
                } else {
                    message.error('저장에 실패하였습니다.')
                }
            });
        }
    }


    function deleteList() {

        const api = gridRef.current.api;

        // 전체 행 반복하면서 선택되지 않은 행만 추출
        const uncheckedData = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const rowNode = api.getDisplayedRowAtIndex(i);
            if (!rowNode.isSelected()) {
                uncheckedData.push(rowNode.data);
            }
        }

        let copyData = {...info}
        copyData['estimateDetailList'] = uncheckedData;
        console.log(copyData, 'copyData::')
        setInfo(copyData);

    }

    function addRow() {
        let copyData = {...info};

        copyData['estimateDetailList'].push({
            "model": "",   // MODEL
            "quantity": 0,                  // 수량
            "unit": "EA",                   // 단위
            "currency": "USD",              // CURR
            "net": 0,                 // NET/P
            "unitPrice": 0,           // 단가
            "amount": 0,               // 금액
            "serialNumber": 1           // 견적의뢰 내역 순서 (1부터 시작)
        })

        setInfo(copyData)
    }

    async function findDocument(e) {

        const result = await getData.post('estimate/getEstimateRequestList', {
            "searchEstimateRequestId": "",      // 견적의뢰 Id
            "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
            "searchStartDate": "",              // 작성일자 시작일
            "searchEndDate": "",                // 작성일자 종료일
            "searchDocumentNumber": e.target.value,         // 문서번호
            "searchCustomerName": "",           // 거래처명
            "searchMaker": "",                  // MAKER
            "searchModel": "",                  // MODEL
            "searchItem": "",                   // ITEM
            "searchCreatedBy": "",              // 등록직원명
            "searchManagerName": "",            // 담당자명
            "searchMobileNumber": "",           // 담당자 연락처
            "searchBiddingNumber": "",          // 입찰번호(미완성)
            "page": 1,
            "limit": -1
        });

        // console.log(result)

        if (result?.data?.code === 1) {

            if(result?.data?.entity?.estimateRequestList.length) {
                console.log(result?.data?.entity?.estimateRequestList,':::')
                setInfo(v => {
                        return {...v, ...result?.data?.entity?.estimateRequestList[0], writtenDate : moment(), estimateDetailList : result?.data?.entity?.estimateRequestList}
                    }
                )
            }
        }
    }


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`, height: '100vh', columnGap: 5}}>
                {/*@ts-ignore*/}
                <SearchInfoModal type={'agencyList'} info={info} setInfo={setInfo}
                                 open={isModalOpen}
                                 setIsModalOpen={setIsModalOpen}/>

                <Card title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 14, fontWeight: 550}}>견적서 작성</div>
                    <div>
                        <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                onClick={saveFunc}><SaveOutlined/>저장</Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{marginRight: 8}}
                                onClick={() => setInfo(orderWriteInitial)}><RetweetOutlined/>초기화</Button>
                    </div>
                </div>} style={{fontSize: 12, border: '1px solid lightGray'}}
                      extra={<span style={{fontSize: 20, cursor: 'pointer'}} onClick={() => setMini(v => !v)}> {!mini ?
                          <DownCircleFilled/> : <UpCircleFilled/>}</span>}>

                    <BoxCard title={'기본 정보'}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 0.6fr 1fr 1fr 1fr',
                            maxWidth: 900,
                            minWidth: 600,
                            columnGap: 15
                        }}>
                            {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                            {inputForm({title: '만쿠담당자', id: 'adminName', disabled: true})}
                            {inputForm({
                                title: '연결 INQUIRY No.',
                                id: 'documentNumberFull',
                                suffix: <DownloadOutlined style={{cursor: 'pointer'}} onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        openModal('documentNumberFull');
                                    }
                                }/>
                            })}
                            {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                            {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                        </div>
                    </BoxCard>

                    <div style={{display: 'grid', gridTemplateColumns: "repeat(4, 1fr)", gap:10, marginTop:10}}>

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
                            {inputForm({title: '담당자', id: 'agencyName'})}
                            {inputForm({title: '연락처', id: 'agencyName'})}
                        </BoxCard>

                        <BoxCard title={'거래처 정보'}>
                            {inputForm({
                                title: '거래처명',
                                id: 'customerName',
                                suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        openModal('customerName');
                                    }
                                }/>
                            })}
                            {inputForm({title: '담당자명', id: 'managerName'})}
                            {inputForm({title: '전화번호', id: 'phoneNumber'})}
                            {inputForm({title: '팩스', id: 'faxNumber'})}
                            {inputForm({title: '이메일', id: 'customerManagerEmail'})}
                        </BoxCard>

                        <BoxCard title={'운송 정보'}>
                            <div>
                                <div>유효기간</div>
                                <Select id={'validityPeriod'} defaultValue={'0'}
                                        onChange={(src) => onChange({target: {id: 'validityPeriod', value: src}})}
                                        size={'small'} value={info['validityPeriod']} options={[
                                    {value: '0', label: '견적 발행 후 10일간'},
                                    {value: '1', label: '견적 발행 후 30일간'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div>
                                <div>결제조건</div>
                                <Select id={'validityPeriod'} defaultValue={'0'}
                                        onChange={(src) => onChange({target: {id: 'paymentTerms', value: src}})}
                                        size={'small'} value={info['paymentTerms']} options={[
                                    {value: '0', label: '발주시 50% / 납품시 50%'},
                                    {value: '1', label: '납품시 현금결제'},
                                    {value: '2', label: '정기결제'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div>운송조건</div>
                                <Select id={'shippingTerms'} defaultValue={'0'}
                                        onChange={(src) => onChange({target: {id: 'shippingTerms', value: src}})}
                                        size={'small'} value={info['shippingTerms']} options={[
                                    {value: '0', label: '귀사도착도'},
                                    {value: '1', label: '화물 및 택배비 별도'},
                                ]} style={{width: '100%',}}/>
                            </div>
                            {inputForm({title: '환율', id: 'exchangeRate'})}
                        </BoxCard>

                        <Card size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>MAKER</div>
                                <Input id={'maker'} value={info['maker']} onChange={onChange}
                                       size={'small'}
                                       onKeyDown={handleKeyPress}
                                       suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                           (e) => {
                                               e.stopPropagation();
                                               openModal('maker');
                                           }
                                       }/>}/>

                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>ITEM</div>
                                <Input id={'item'} value={info['item']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>Delivery</div>
                                <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
                            </div>

                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>비고란</div>
                                <TextArea id={'instructions'} value={info['instructions']} onChange={onChange}
                                          size={'small'}/>
                            </div>

                        </Card>
                    </div>
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    columns={tableEstimateWriteColumns}
                    tableData={info['estimateDetailList']}
                    listType={'estimateId'}
                    listDetailType={'estimateDetailList'}
                    setInfo={setInfo}
                    excel={true}
                    type={'write'}
                    funcButtons={<div style={{display : 'flex', alignItems : 'end'}}>
                        <Button type={'primary'} size={'small'} style={{marginLeft: 5}}
                                onClick={addRow}>
                            <SaveOutlined/>추가
                        </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{ marginLeft: 5,}} onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>
                    </div>}
                />
            </div>
        </LayoutComponent>
    </>
}
// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);

    if (!userInfo) {
        return {
            redirect: {
                destination: '/', // 리다이렉트할 경로
                permanent: false, // true면 301 리다이렉트, false면 302 리다이렉트
            },
        };
    }

    store.dispatch(setUserInfo(userInfo));

    // const {estimateId} = ctx.query;

    //
    // const result = await getData.post('estimate/getEstimateDetail', {
    //     estimateId:estimateId
    // });


    // return {props: {dataInfo: estimateId ? result?.data?.entity?.estimateDetail : null}}
})