import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {
    CopyOutlined,
    DownloadOutlined, EditOutlined,
    FileExcelOutlined,
    FileSearchOutlined,
    RetweetOutlined,
    SaveOutlined
} from "@ant-design/icons";
import {
    searchAgencyCodeColumn,
    searchCustomerColumn, subRfqWriteColumn, tableEstimateWriteColumns, tableOrderWriteColumn
} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {
    estimateWriteInitial, orderWriteInitial, rfqWriteInitial,
    tableEstimateWriteInitial, tableOrderWriteInitial
} from "@/utils/initialList";
import {subOrderWriteInfo, tableEstimateWriteInfo} from "@/utils/modalDataList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Modal from "antd/lib/modal/Modal";
import Table from "antd/lib/table";
import * as XLSX from "xlsx";
import TableModal from "@/utils/TableModal";
import Select from "antd/lib/select";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import {AgGridReact} from "ag-grid-react";
import {iconSetMaterial, themeQuartz} from "@ag-grid-community/theming";
import MyComponent from "@/component/MyComponent";


const tableTheme = themeQuartz
    .withPart(iconSetMaterial)
    .withParams({
        browserColorScheme: "light",
        cellHorizontalPaddingScale: 0.5,
        columnBorder: true,
        fontSize: "10px",
        headerBackgroundColor: "#FDFDFD",
        headerFontSize: "12px",
        headerFontWeight: 550,
        headerVerticalPaddingScale: 0.8,
        iconSize: "11px",
        rowBorder: true,
        rowVerticalPaddingScale: 0.8,
        sidePanelBorder: true,
        spacing: "5px",
        wrapperBorder: true,
        wrapperBorderRadius: "6px",
    });


const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function EstimateWrite({dataInfo}) {

    const gridRef = useRef(null);
    const router = useRouter();

    const [selectedRows, setSelectedRows] = useState([]);

    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>(estimateWriteInitial)
    const [isMainModalOpen, setIsMainModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});
    const [agencyData, setAgencyData] = useState([]);
    const [customerData, setCustomerData] = useState([]);




    useEffect(() => {

        let copyData = {...estimateWriteInitial}

        if (dataInfo) {
            copyData = dataInfo;
            copyData['writtenDate'] = moment(copyData['writtenDate']);
            // @ts-ignored
            copyData['delivery'] = moment(copyData['delivery']);
        } else {
            // @ts-ignored
            copyData['writtenDate'] = moment();
            // @ts-ignored
            copyData['delivery'] = moment();
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

            await getData.post('estimate/addEstimate', copyData).then(v => {
                if (v.data.code === 1) {
                    message.success('저장되었습니다.')
                }
            });
        }
        const checkList = Array.from({ length: info['estimateDetailList'].length }, (_, i) => i + 1);
        setInfo(orderWriteInitial);
        deleteList(checkList)
    }


    function deleteList(checkList) {
        let copyData = { ...info };

        console.log(checkList, "checkList");
        checkList.forEach(v => console.log(v.serialNumber, "serialNumber"));

        const checkSerialNumbers = checkList.map(item => item.serialNumber);

        const result = copyData['estimateRequestDetailList'].filter(v => !checkSerialNumbers.includes(v.serialNumber));
        console.log(result, "result");
        copyData['estimateRequestDetailList']=result;

        setInfo(copyData)
    }


    function SearchAgencyCode() {
        const [data, setData] = useState(agencyData)
        const [code, setCode] = useState(info['agencyCode']);

        // useEffect(() => {
        //     searchFunc();
        // }, [])

        async function searchFunc() {
            const result = await getData.post('agency/getAgencyListForEstimate', {
                "searchText": code,       // 대리점코드 or 대리점 상호명
                "page": 1,
                "limit": -1
            });
            setData(result?.data?.entity?.agencyList)
        }

        function handleKeyPress(e){
            if (e.key === 'Enter') {
                searchFunc();
            }
        }

        return <Modal
            // @ts-ignored
            id={'event1'}
            title={'대리점 코드 조회'}
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            open={isModalOpen?.event1}
            width={'60vw'}
            onOk={() => setIsModalOpen({event1: false, event2: false})}
        >
            <div style={{height: '50vh'}}>
                <div style={{display:'flex', justifyContent:'space-between', gap:15, marginBottom: 20}}>
                    <Input style={{width:'100%'}} onKeyDown={handleKeyPress} id={'agencyCode'} value={code} onChange={(e)=>setCode(e.target.value)}></Input>
                    <Button onClick={searchFunc}>조회</Button>
                </div>

                <AgGridReact containerStyle={{height:'93%', width:'100%' }} theme={tableTheme}
                             onCellClicked={(e)=>{
                                 setInfo(v=>{
                                     return {
                                         ...v, ... e.data
                                     }})
                                 setIsModalOpen({event1: false, event2: false})
                             }}
                             rowData={data}
                             columnDefs={searchAgencyCodeColumn}
                             pagination={true}

                />
            </div>
        </Modal>
    }


    function SearchCustomer() {
        const [data, setData] = useState(customerData)
        const [customer, setCustomer] = useState(info['customerName']);


        async function searchFunc() {
            // console.log(modalInfo, 'modalInfo:')
            const result = await getData.post('customer/getCustomerListForEstimate', {
                "searchText": customer,       // 상호명
                "page": 1,
                "limit": -1
            });
            setData(result?.data?.entity?.customerList)
        }

        function handleKeyPress(e){
            if (e.key === 'Enter') {
                searchFunc();
            }
        }


        return <Modal
            title={'거래처 상호명 조회'}
            // @ts-ignored
            id={'event2'}
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            open={isModalOpen?.event2}
            width={'60vw'}
            onOk={() => setIsModalOpen({event1: false, event2: false})}
        >
            <div style={{height: '50vh'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', gap: 15, marginBottom: 20}}>
                    <Input onKeyDown={handleKeyPress} id={'customerName'} value={customer}
                           onChange={(e) => setCustomer(e.target.value)}></Input>
                    <Button onClick={searchFunc}>조회</Button>
                </div>

                <AgGridReact containerStyle={{height:'93%', width:'100%' }} theme={tableTheme}
                             onCellClicked={(e)=>{
                                 setInfo(v=>{
                                     return {
                                         ...v,phoneNumber: e?.data?.directTel, ... e.data
                                     }})
                                 setIsModalOpen({event1: false, event2: false})
                             }}
                             rowData={data}
                             columnDefs={searchCustomerColumn}
                             pagination={true}
                />
            </div>
        </Modal>
    }


    const downloadExcel = () => {

        if (!info['estimateDetailList'].length) {
            return message.warn('출력할 데이터가 존재하지 않습니다.')
        }

        const worksheet = XLSX.utils.json_to_sheet(info['estimateDetailList']);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {

            selectedRows = selectedRowKeys

        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    function addRow() {
        let copyData = {...info};
        copyData['estimateRequestDetailList'].push({
            "model": "",           // MODEL
            "quantity": 1,              // 수량
            "unit": "ea",               // 단위
            "currency": "krw",          // CURR
            "net": 0,            // NET/P
            "deliveryDate": "",   // 납기
            "content": "",         // 내용
            "replyDate": '',  // 회신일
            "remarks": "",           // 비고
            "serialNumber": 1           // 견적의뢰 내역 순서 (1부터 시작)
        })

        setInfo(copyData)
    }

    const handleKeyPress = async (e) => {
        console.log(e.target.id)
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
            "limit": 20
        });

        if (result?.data?.code === 1) {
            console.log(result?.data?.entity?.estimateList, '::::::')
        }
    }


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: '450px 1fr', height: '100%', gridColumnGap: 5}}>

                <SearchAgencyCode/>
                <SearchCustomer/>
                <Card title={dataInfo ? '견적서 수정' : '견적서 작성'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <div style={{display : 'grid', gridTemplateColumns : '220px 320px 320px 1fr', columnGap : 10}}>
                        <div>
                        <Card size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>

                            <div>
                                <div style={{paddingBottom: 3}}>INQUIRY NO.</div>
                                <Input disabled={true} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>작성일</div>
                                <DatePicker value={info['writtenDate']}
                                            onChange={(date, dateString) => onChange({
                                                target: {
                                                    id: 'writtenDate',
                                                    value: date
                                                }
                                            })
                                            } id={'writtenDate'} size={'small'}/>
                            </div>

                        </Card>

                        <Card title={'inpuiry 정보 및 supplier information'} size={'small'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                              }}>

                            <div>
                                <div style={{paddingBottom: 3}}>연결 INQUIRY No.</div>
                                <Input size={'small'} id={'documentNumberFull'} value={info['documentNumberFull']}
                                       onChange={onChange}
                                       suffix={<DownloadOutlined style={{cursor: 'pointer'}}
                                                                 onClick={findDocument}/>}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>대리점코드</div>
                                <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange}
                                       size={'small'}
                                       suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                           (e) => {
                                               e.stopPropagation();
                                               setIsModalOpen({event1: true, event2: false})
                                           }
                                       }/>}/>
                            </div>

                        </Card>
                        </div>
                        <Card title={'CUSTOMER INFORMATION'} size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>상호명</div>
                                <Input id={'customerName'} value={info['customerName']} onChange={onChange}
                                       size={'small'}
                                       onKeyDown={handleKeyPress}
                                       suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                           (e) => {
                                               e.stopPropagation();
                                               setIsModalOpen({event1: false, event2: true})
                                           }
                                       }/>}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>담당자</div>
                                <Input id={'managerName'} value={info['managerName']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingBottom: 3}}>전화번호</div>
                                <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>팩스/이메일</div>
                                <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </Card>

                        <Card title={'ETC'} size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>MAKER</div>
                                <Input id={'maker'} value={info['maker']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>ITEM</div>
                                <Input id={'item'} value={info['item']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>비고란</div>
                                <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>지시사항</div>
                                <TextArea id={'instructions'} value={info['instructions']} onChange={onChange}
                                          size={'small'}/>
                            </div>

                        </Card>
                        <div style={{paddingTop: 20}}>
                            {/*@ts-ignored*/}
                            {dataInfo ? <Button type={'danger'} size={'small'} style={{marginRight: 8}}
                                                onClick={saveFunc}><SaveOutlined/>수정</Button> :
                                <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                        onClick={saveFunc}><SaveOutlined/>저장</Button>}


                            {dataInfo ? <Button size={'small'}  type={'primary'} style={{marginRight: 8}}
                                                onClick={() => router?.push('/rfq_write')}><EditOutlined/>신규</Button> :
                                // @ts-ignored
                                <Button type={'danger'} size={'small'}
                                        onClick={() => setInfo(rfqWriteInitial)}><RetweetOutlined/>초기화</Button>}

                        </div>
                    </div>
                </Card>


                <TableGrid
                            columns={tableOrderWriteColumn}
                            tableData={info['estimateDetailList']}
                            setSelectedRows={setSelectedRows}
                            listType={'estimateId'}
                            // dataInfo={tableOrderReadInfo}
                            setInfo={setInfo}
                            // setTableInfo={setTableInfo}
                            excel={true}
                            modalComponent={
                                <TableModal listType={'estimateDetailList'} title={'견적서 세부 작성'}
                                            initialData={tableOrderWriteInitial}
                                            dataInfo={subOrderWriteInfo}
                                            setInfoList={setInfo}
                                            isModalOpen={isMainModalOpen}
                                            setIsModalOpen={setIsMainModalOpen}
                                />}
                            funcButtons={<div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                                <CopyOutlined/>복사
                            </Button>
                                {/*@ts-ignored*/}
                                <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={()=>deleteList(selectedRows)}>
                                    <CopyOutlined/>삭제
                                </Button>
                                <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                                    <FileExcelOutlined/>출력
                                </Button></div>}
                        />



            </div>
            <MyComponent/>
        </LayoutComponent>

        {/*<LayoutComponent>*/}
        {/*    <div style={{display: 'grid', gridTemplateColumns: '450px 1fr', height: '100%', gridColumnGap: 5}}>*/}

        {/*        <SearchAgencyCode/>*/}
        {/*        <SearchCustomer/>*/}

        {/*        <Card title={dataInfo ? '견적서 수정' : '견적서 작성'} style={{fontSize: 12, border: '1px solid lightGray'}}>*/}
        {/*            <div style={{display: 'grid', gridTemplateColumns: '220px 320px 320px 1fr', columnGap: 10}}>*/}
        {/*                <Card size={'small'} style={{*/}
        {/*                    fontSize: 13,*/}
        {/*                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'*/}
        {/*                }}>*/}

        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>INQUIRY NO.</div>*/}
        {/*                            <Input disabled={true} size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>작성일</div>*/}
        {/*                            <DatePicker value={info['writtenDate']}*/}
        {/*                                        onChange={(date, dateString) => onChange({*/}
        {/*                                            target: {*/}
        {/*                                                id: 'writtenDate',*/}
        {/*                                                value: date*/}
        {/*                                            }*/}
        {/*                                        })*/}
        {/*                                        } id={'writtenDate'} size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                </Card>*/}
        {/*            </div>*/}

        {/*                <Card title={'inpuiry 정보 및 supplier information'} size={'small'}*/}
        {/*                      style={{*/}
        {/*                          fontSize: 13,*/}
        {/*                          marginTop: 20,*/}
        {/*                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'*/}
        {/*                      }}>*/}
        {/*                    <TwinInputBox>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>연결 INQUIRY No.</div>*/}
        {/*                            <Input size={'small'} id={'documentNumberFull'} value={info['documentNumberFull']}*/}
        {/*                                   onChange={onChange}*/}
        {/*                                   suffix={<DownloadOutlined style={{cursor: 'pointer'}}*/}
        {/*                                                             onClick={findDocument}/>}/>*/}
        {/*                        </div>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>대리점코드</div>*/}
        {/*                            <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange}*/}
        {/*                                   size={'small'}*/}
        {/*                                   suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={*/}
        {/*                                       (e) => {*/}
        {/*                                           e.stopPropagation();*/}
        {/*                                           setIsModalOpen({event1: true, event2: false})*/}
        {/*                                       }*/}
        {/*                                   }/>}/>*/}
        {/*                        </div>*/}
        {/*                    </TwinInputBox>*/}
        {/*                </Card>*/}


        {/*                <Card title={'CUSTOMER INFORMATION'} size={'small'} style={{*/}
        {/*                    fontSize: 13,*/}
        {/*                    marginTop: 20,*/}
        {/*                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'*/}
        {/*                }}>*/}
        {/*                    <TwinInputBox>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>CUSTOMER 코드</div>*/}
        {/*                            <Input id={'customerCode'} value={info['customerCode']} onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>상호명</div>*/}
        {/*                            <Input id={'customerName'} value={info['customerName']} onChange={onChange}*/}
        {/*                                   size={'small'}*/}
        {/*                                   suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={*/}
        {/*                                       (e) => {*/}
        {/*                                           e.stopPropagation();*/}
        {/*                                           setIsModalOpen({event1: false, event2: true})*/}
        {/*                                       }*/}
        {/*                                   }/>}/>*/}
        {/*                        </div>*/}
        {/*                    </TwinInputBox>*/}
        {/*                    <TwinInputBox>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>담당자</div>*/}
        {/*                            <Input id={'managerName'} value={info['managerName']} onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>전화번호</div>*/}
        {/*                            <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                    </TwinInputBox>*/}
        {/*                    <TwinInputBox>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>팩스번호</div>*/}
        {/*                            <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                    </TwinInputBox>*/}
        {/*                </Card>*/}

        {/*                <Card title={'OPTION'} size={'small'} style={{*/}
        {/*                    fontSize: 13,*/}
        {/*                    marginTop: 20,*/}
        {/*                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'*/}
        {/*                }}>*/}
        {/*                    <TwinInputBox>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>유효기간</div>*/}
        {/*                            <Select id={'validityPeriod'} defaultValue={'0'}*/}
        {/*                                    onChange={(src) => onChange({target: {id: 'validityPeriod', value: src}})}*/}
        {/*                                    size={'small'} value={info['validityPeriod']} options={[*/}
        {/*                                {value: '0', label: '견적 발행 후 10일간'},*/}
        {/*                                {value: '1', label: '견적 발행 후 30일간'},*/}
        {/*                            ]} style={{width: '100%'}}>*/}
        {/*                            </Select>*/}
        {/*                        </div>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>결제조건</div>*/}
        {/*                            <Select id={'validityPeriod'} defaultValue={'0'}*/}
        {/*                                    onChange={(src) => onChange({target: {id: 'paymentTerms', value: src}})}*/}
        {/*                                    size={'small'} value={info['paymentTerms']} options={[*/}
        {/*                                {value: '0', label: '발주시 50% / 납품시 50%'},*/}
        {/*                                {value: '1', label: '납품시 현금결제'},*/}
        {/*                                {value: '2', label: '정기결제'},*/}
        {/*                            ]} style={{width: '100%'}}>*/}
        {/*                            </Select>*/}
        {/*                        </div>*/}
        {/*                    </TwinInputBox>*/}
        {/*                    <TwinInputBox>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>운송조건</div>*/}
        {/*                            <Input id={'shippingTerms'} value={info['shippingTerms']} onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>환율</div>*/}
        {/*                            <Input id={'exchangeRate'} value={info['exchangeRate']} onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                    </TwinInputBox>*/}
        {/*                </Card>*/}


        {/*                <Card title={'담당자 정보'} size={'small'} style={{*/}
        {/*                    fontSize: 13,*/}
        {/*                    marginTop: 20,*/}
        {/*                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'*/}
        {/*                }}>*/}
        {/*                    <TwinInputBox>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>담당자</div>*/}
        {/*                            <Input disabled={true} id={'estimateManager'} value={userInfo['name']}*/}
        {/*                                   onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>E-Mail</div>*/}
        {/*                            <Input disabled={true} id={'email'} value={userInfo['email']} onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                    </TwinInputBox>*/}
        {/*                    <TwinInputBox>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>전화번호</div>*/}
        {/*                            <Input disabled={true} id={'managerPhoneNumber'} value={userInfo['contactNumber']}*/}
        {/*                                   onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                        <div>*/}
        {/*                            <div style={{paddingBottom: 3}}>팩스번호</div>*/}
        {/*                            <Input disabled={true} id={'managerFaxNumber'} value={userInfo['faxNumber']}*/}
        {/*                                   onChange={onChange}*/}
        {/*                                   size={'small'}/>*/}
        {/*                        </div>*/}
        {/*                    </TwinInputBox>*/}
        {/*                </Card>*/}

        {/*                <Card title={'ETC'} size={'small'} style={{*/}
        {/*                    fontSize: 13,*/}
        {/*                    marginTop: 20,*/}
        {/*                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'*/}
        {/*                }}>*/}
        {/*                    <div style={{paddingTop: 8}}>*/}
        {/*                        <div style={{paddingBottom: 3}}>MAKER</div>*/}
        {/*                        <Input id={'maker'} value={info['maker']} onChange={onChange} size={'small'}/>*/}
        {/*                    </div>*/}
        {/*                    <div style={{paddingTop: 8}}>*/}
        {/*                        <div style={{paddingBottom: 3}}>ITEM</div>*/}
        {/*                        <Input id={'item'} value={info['item']} onChange={onChange} size={'small'}/>*/}
        {/*                    </div>*/}
        {/*                    <div style={{paddingTop: 8}}>*/}
        {/*                        <div style={{paddingBottom: 3}}>Delivery</div>*/}
        {/*                        <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>*/}
        {/*                    </div>*/}
        {/*                    <div style={{paddingTop: 8}}>*/}
        {/*                        <div style={{paddingBottom: 3}}>비고란</div>*/}
        {/*                        <TextArea id={'instructions'} value={info['instructions']} onChange={onChange}*/}
        {/*                                  size={'small'}/>*/}
        {/*                    </div>*/}

        {/*                    <div style={{paddingTop: 20, textAlign: 'right', width: '100%'}}>*/}
        {/*                        <Button type={'primary'} style={{marginRight: 8, letterSpacing: dataInfo ? -2 : 0}}*/}
        {/*                                onClick={saveFunc}><SaveOutlined/>{dataInfo ? '변경사항 저장' : '저장'}</Button>*/}
        {/*                        {dataInfo ? // @ts-ignored*/}
        {/*                            <Button type={'danger'} style={{letterSpacing: -2}}*/}
        {/*                                    onClick={() => router?.push('/order_write')}><EditOutlined/>새로*/}
        {/*                                작성하기</Button> :*/}
        {/*                            // @ts-ignored*/}
        {/*                            <Button type={'danger'} style={{letterSpacing: -1}}*/}
        {/*                                    onClick={() => setInfo(orderWriteInitial)}><RetweetOutlined/>초기화</Button>}*/}
        {/*                    </div>*/}
        {/*                </Card>*/}
        {/*        </Card>*/}

        {/*
        {/*    </div>*/}
        {/*</LayoutComponent>*/}
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