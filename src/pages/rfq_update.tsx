import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {
    CopyOutlined,
    EditOutlined,
    FileExcelOutlined,
    FileSearchOutlined,
    RetweetOutlined,
    SaveOutlined
} from "@ant-design/icons";
import {searchAgencyCodeColumn, searchCustomerColumn, subRfqWriteColumn} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {orderWriteInitial, rfqWriteInitial} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Modal from "antd/lib/modal/Modal";
import Table from "antd/lib/table";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import * as XLSX from 'xlsx';
import MyComponent from "@/component/MyComponent";
import {useRouter} from "next/router";
import nookies from "nookies";
import {TwinInputBox} from "@/utils/common/component/Common";
import TableGrid from "@/component/tableGrid";
import {AgGridReact} from "ag-grid-react";
import {iconSetMaterial, themeQuartz} from "@ag-grid-community/theming";
import {tableTheme} from "@/utils/common";
import SearchAgendaModal from "@/component/SearchAgendaModal";
import SearchCustomerModal from "@/component/SearchCustomerModal";

export default function rqfUpdate({dataInfo, display}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>(dataInfo)
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});
    const [agencyData, setAgencyData] = useState([]);
    const [customerData, setCustomerData] = useState([]);



    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        if (!info['estimateRequestDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');
            copyData['replyDate'] = moment(info['replyDate']).format('YYYY-MM-DD');

            await getData.post('estimate/updateEstimateRequest', copyData).then(v => {
                if (v.data.code === 1) {
                    message.success('저장되었습니다.')
                    setInfo(rfqWriteInitial);
                    deleteList()
                    window.location.href = '/rfq_read'
                }else{
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
        copyData['estimateRequestDetailList'] = uncheckedData;
        console.log(copyData,'copyData::')
        setInfo(copyData);

    }


    function addRow() {
        let copyData = {...info};
        copyData['estimateRequestDetailList'].push({
            "model": "",           // MODEL
            "quantity": 1,              // 수량
            "unit": "ea",               // 단위
            "currency": "krw",          // CURR
            "net": 0,            // NET/P
            "deliveryDate": "",   // 납기
            "content": "미회신",         // 내용
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

    const downloadExcel = () => {

        if (!info['estimateRequestDetailList'].length) {
            return message.warn('출력할 데이터가 존재하지 않습니다.')
        }

        const worksheet = XLSX.utils.json_to_sheet(info['estimateRequestDetailList']);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', columnGap: 5}}>

                <SearchAgendaModal info={info} setInfo={setInfo} agencyData={agencyData} isModalOpen={isModalOpen}
                                   setIsModalOpen={setIsModalOpen}/>
                <SearchCustomerModal info={info} setInfo={setInfo} customerData={customerData} isModalOpen={isModalOpen}
                                     setIsModalOpen={setIsModalOpen}/>

                <Card title={'견적의뢰 수정'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <div style={{display : 'grid', gridTemplateColumns : '220px 320px 320px 1fr', columnGap : 10}}>
                        <Card size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>

                            <div>
                                <div style={{paddingBottom: 3}}>INQUIRY NO.</div>
                                <Input disabled={true} value={info['documentNumberFull']} size={'small'}/>
                            </div>
                            {/*<div>*/}
                            {/*    <div style={{paddingBottom: 3}}>작성일</div>*/}
                            {/*    <DatePicker value={info['writtenDate']}*/}
                            {/*                onChange={(date, dateString) => onChange({*/}
                            {/*                    target: {*/}
                            {/*                        id: 'writtenDate',*/}
                            {/*                        value: date*/}
                            {/*                    }*/}
                            {/*                })*/}
                            {/*                } id={'writtenDate'} size={'small'}/>*/}
                            {/*</div>*/}

                        </Card>

                        <Card title={'inpuiry 정보 및 supplier information'} size={'small'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                              }}>
                            <div>
                                <div style={{paddingBottom: 3}}>대리점코드</div>
                                <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange}
                                       size={'small'}
                                       onKeyDown={handleKeyPress}
                                       suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                           (e) => {
                                               e.stopPropagation();
                                               setIsModalOpen({event1: true, event2: false})
                                           }
                                       }/>}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>대리점명</div>
                                <Input id={'agencyName'} value={info['agencyName']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </Card>

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
                            <Button type={'danger'} size={'small'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>수정</Button>
                            <Button size={'small'}  type={'primary'} style={{marginRight: 8}}
                                    onClick={() => router?.push('/rfq_write')}><EditOutlined/>신규</Button>

                        </div>
                    </div>
                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    tableData={info['estimateRequestDetailList']}
                    listType={'estimateRequestId'}
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
            <MyComponent/>
        </LayoutComponent>
    </>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}


    const { query } = ctx;

    // 특정 쿼리 파라미터 가져오기
    const { estimateRequestId } = query; // 예: /page?id=123&name=example

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

    const result = await getData.post('estimate/getEstimateRequestDetail', {
        "estimateRequestId": estimateRequestId
    });


    return {
        props: {dataInfo: result?.data?.entity?.estimateRequestDetail}
    }
})