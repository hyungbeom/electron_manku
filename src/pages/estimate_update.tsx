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
    SaveOutlined, UpCircleFilled
} from "@ant-design/icons";
import {tableEstimateWriteColumns, tableOrderWriteColumn} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateWriteInitial, orderWriteInitial, rfqWriteInitial, tableOrderWriteInitial} from "@/utils/initialList";
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
import SearchAgendaModal from "@/component/SearchAgendaModal";
import SearchCustomerModal from "@/component/SearchCustomerModal";


export default function EstimateWrite({dataInfo}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>(estimateWriteInitial)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});
    const [agencyData, setAgencyData] = useState([]);
    const [customerData, setCustomerData] = useState([]);


    useEffect(() => {

        let copyData = {...estimateWriteInitial}

        if (dataInfo) {
            copyData = dataInfo;
            copyData['writtenDate'] = moment(copyData['writtenDate']);
        } else {
            // @ts-ignored
            copyData['writtenDate'] = moment();
        }

        setInfo(copyData);
    }, [dataInfo, router])

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        if (!info['estimateDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');

            await getData.post('estimate/updateEstimate', copyData).then(v => {
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
            "quantity": 1,                  // 수량
            "unit": "ea",                   // 단위
            "currency": "USD",              // CURR
            "net": 0,                 // NET/P
            "unitPrice": 0,           // 단가
            "amount": 0,               // 금액
            "serialNumber": 1           // 견적의뢰 내역 순서 (1부터 시작)
        })

        setInfo(copyData)
    }


    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            if (e.target.id === 'agencyCode') {
                if(!info['agencyCode']){
                    return false;
                }
                const result = await getData.post('agency/getAgencyListForEstimate', {
                    "searchText": info['agencyCode'],       // 대리점코드 or 대리점 상호명
                    "page": 1,
                    "limit": -1
                })
                if (result.data.entity.agencyList.length > 1) {
                    setAgencyData(result.data.entity.agencyList)
                    setIsModalOpen({event1: true, event2: false})
                } else if (!!result.data.entity.agencyList.length) {
                    const {agencyCode, agencyName} = result.data.entity.agencyList[0]

                    setInfo(v => {
                        return {...v, agencyCode: agencyCode, agencyName: agencyName}
                    })
                }
            }else{
                if(!info['customerName']){
                    return false
                }
                const result = await getData.post('customer/getCustomerListForEstimate', {
                    "searchText": info['customerName'],       // 대리점코드 or 대리점 상호명
                    "page": 1,
                    "limit": -1
                })
                if(result.data.entity.customerList.length > 1){
                    setCustomerData(result.data.entity.customerList)
                    setIsModalOpen({event1: false, event2: true})
                } else if (!!result.data.entity.customerList.length) {
                    const {customerName, managerName, directTel, faxNumber} = result.data.entity.customerList[0]


                    setInfo(v => {
                        return {...v, customerName: customerName, managerName: managerName,phoneNumber:directTel, faxNumber : faxNumber }
                    })
                }
            }
        }
    };


    const downloadExcel = () => {

        if (!info['estimateDetailList'].length) {
            return message.warn('출력할 데이터가 존재하지 않습니다.')
        }

        const worksheet = XLSX.utils.json_to_sheet(info['estimateDetailList']);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };


    async function findDocument() {

        const result = await getData.post('estimate/getEstimateList', {
            "searchType": "",           // 검색조건 1: 주문, 2: 미주문
            "searchStartDate": "",      // 작성일 검색 시작일
            "searchEndDate": "",        // 작성일 검색 종료일
            "searchDocumentNumber": info['documentNumberFull'], // 문서번호
            "searchCustomerName": "",   // 거래처명
            "searchModel": "",          // MODEL
            "searchMaker": "",          // MAKER
            "searchItem": "",           // ITEM
            "searchCreatedBy": "",      // 등록 관리자 이름
            "page": 1,
            "limit": -1
        });

        if (result?.data?.code === 1) {

            if(result?.data?.entity?.estimateList.length) {
                setInfo(v => {
                        return {...v, ...result?.data?.entity?.estimateList[0], writtenDate : moment(result?.data?.entity?.estimateList[0].writtenDate)}
                    }
                )
            }
        }
    }

    function handleKeyPressDoc(e) {
        if (e.key === 'Enter') {
            findDocument();
        }
    }


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`, height: '100%', gridColumnGap: 5}}>

                <SearchAgendaModal info={info} setInfo={setInfo} agencyData={agencyData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                <SearchCustomerModal info={info} setInfo={setInfo} customerData={customerData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                <Card title={'견적서 수정'} style={{fontSize: 12, border: '1px solid lightGray'}} extra={<span style={{fontSize : 20, cursor : 'pointer'}} onClick={()=>setMini(v => !v)}> {!mini ? <UpCircleFilled/> : <DownCircleFilled/>}</span>} >

                    <Card size={'small'} style={{
                        fontSize: 11,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        marginBottom : 5
                    }}>
                        <div style={{display : 'grid', gridTemplateColumns : '1fr 1fr 1fr', width : 640, columnGap : 20}}>
                            {/*<div>*/}
                            {/*    <div style={{marginTop: 8, width : '100%'}}>작성일</div>*/}
                            {/*    <DatePicker value={info['writtenDate']} style={{width : '100%'}}*/}
                            {/*                onChange={(date, dateString) => onChange({*/}
                            {/*                    target: {*/}
                            {/*                        id: 'writtenDate',*/}
                            {/*                        value: date*/}
                            {/*                    }*/}
                            {/*                })*/}
                            {/*                } id={'writtenDate'} size={'small'}/>*/}
                            {/*</div>*/}
                            <div>
                                <div style={{marginTop: 8}}>INQUIRY NO.</div>
                                <Input disabled={true} size={'small'}/>
                            </div>
                        </div>
                    </Card>


                    <div style={{display : 'grid', gridTemplateColumns : '1fr 1.2fr  1.22fr 1.5fr', columnGap : 10}}>

                    <Card title={'inpuiry 정보 및 supplier information'} size={'small'}
                          style={{
                              fontSize: 11,
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                          }}>

                            <div>
                                <div>연결 INQUIRY No.</div>
                                <Input size={'small'} id={'documentNumberFull'} value={info['documentNumberFull']}
                                       onChange={onChange}
                                       onKeyDown={handleKeyPressDoc}
                                       suffix={<DownloadOutlined style={{cursor: 'pointer'}} onClick={findDocument}/>}/>
                            </div>
                            <div>
                                <div style={{marginTop: 8}}>대리점코드</div>
                                <Input id={'agencyCode'}  onKeyDown={handleKeyPress} value={info['agencyCode']} onChange={onChange} size={'small'}
                                       suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                           (e) => {
                                               e.stopPropagation();
                                               setIsModalOpen({event1: true, event2: false})
                                           }
                                       }/>}/>
                            </div>

                    </Card>


                    <Card size={'small'} style={{
                        fontSize: 11,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>

                            <div>
                                <div style={{marginBottom: 3}}>CUSTOMER 코드</div>
                                <Input id={'customerCode'} value={info['customerCode']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{marginTop: 8, marginBottom: 3}}>상호명</div>
                                <Input id={'customerName'}  onKeyDown={handleKeyPress} value={info['customerName']} onChange={onChange}
                                       size={'small'} suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        setIsModalOpen({event1: false, event2: true})
                                    }
                                }/>}/>
                            </div>


                            <div>
                                <div style={{marginTop: 8, marginBottom: 3}}>담당자</div>
                                <Input id={'managerName'} value={info['managerName']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{marginTop: 8, marginBottom: 3}}>전화번호</div>
                                <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{marginTop: 8, marginBottom: 3}}>팩스번호</div>
                                <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                    </Card>

                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>

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
                                <div style={{marginTop: 8}}>결제조건</div>
                                <Select id={'validityPeriod'} defaultValue={'0'}
                                        onChange={(src) => onChange({target: {id: 'paymentTerms', value: src}})}
                                        size={'small'} value={info['paymentTerms']} options={[
                                    {value: '0', label: '발주시 50% / 납품시 50%'},
                                    {value: '1', label: '납품시 현금결제'},
                                    {value: '2', label: '정기결제'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>

                            <div>
                                <div style={{marginTop: 8}}>운송조건</div>
                                <Input id={'shippingTerms'} value={info['shippingTerms']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{marginTop: 8}}>환율</div>
                                <Input id={'exchangeRate'} value={info['exchangeRate']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                    </Card>

                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'maker'} value={info['maker']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'item'} value={info['item']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>Delivery</div>
                            <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>비고란</div>
                            <TextArea id={'instructions'} value={info['instructions']} onChange={onChange}
                                      size={'small'}/>
                        </div>

                    </Card>
                        <div style={{paddingTop: 10}}>

                            <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>수정</Button>
                            {/*@ts-ignored*/}
                            <Button size={'small'}  type={'ghost'} style={{marginRight: 8,}}
                                    onClick={() => router?.push('/estimate_write')}><EditOutlined/>신규작성</Button>

                        </div>
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
                    funcButtons={<div>
                        {/*@ts-ignored*/}
                        <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                onClick={addRow}>
                            <SaveOutlined/>추가
                        </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                onClick={deleteList}>
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

    const {estimateId} = ctx.query;


    const result = await getData.post('estimate/getEstimateDetail', {
        estimateId:estimateId
    });


    return {props: {dataInfo: estimateId ? result?.data?.entity?.estimateDetail : null}}
})