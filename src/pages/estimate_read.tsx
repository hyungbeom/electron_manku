import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {rfqReadColumns, tableEstimateReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateReadInitial, tableEstimateReadInitial, tableOrderReadInitial} from "@/utils/initialList";
import {tableEstimateReadInfo, tableOrderReadInfo} from "@/utils/modalDataList";
import Select from "antd/lib/select";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {getData} from "@/manage/function/api";
import {setUserInfo} from "@/store/user/userSlice";
import moment from "moment/moment";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";

const {RangePicker} = DatePicker


export default function EstimateRead({data}) {

    const gridRef = useRef(null);

    const [info, setInfo] = useState(estimateReadInitial)
    const [tableData, setTableData] = useState(data)


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
    }, [])

    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateList',
            {...copyData,   "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.estimateList)
    }

    async function deleteList() {
        const api = gridRef.current.api;
        console.log(api.getSelectedRows(),':::')

        if (api.getSelectedRows().length<1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('estimate/deleteEstimate', {
                    estimateId:item.estimateId
                });
                console.log(response)
                if (response.data.code===1) {
                    message.success('삭제되었습니다.')
                    window.location.reload();
                } else {
                    message.error('오류가 발생하였습니다. 다시 시도해주세요.')
                }
            }
        }
    }

    const downloadExcel = () => {

        const headers = [];
        const fields = [];

        const extractHeaders = (columns) => {
            columns.forEach((col) => {
                if (col.children) {
                    extractHeaders(col.children); // 자식 컬럼 재귀적으로 처리
                } else {
                    headers.push(col.headerName); // headerName 추출
                    fields.push(col.field); // field 추출
                }
            });
        };

        extractHeaders(tableEstimateReadColumns);

        const worksheetData = tableData.map((row) =>
            fields.map((field) => row[field] || "") // field에 해당하는 데이터 추출
        );

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...worksheetData]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "estimate_list.xlsx");
    };

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>견적서 조회</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{fontSize: 12, border: '1px solid lightGray'}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                                <div>
                                    <div style={{paddingBottom: 3}}>작성일자</div>
                                    <RangePicker
                                        value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
                                        id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                        onChange({
                                            target: {
                                                id: 'searchDate',
                                                value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                            }
                                        })
                                    }
                                    } style={{width: '100%',}}/>
                                </div>

                                <div>
                                    <div style={{paddingBottom: 3}}>주문 여부</div>
                                    <Select onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                        id={'searchType'} size={'small'} value={info['searchType']} defaultValue={0}
                                            options={[
                                                {value: 0, label: '전체'},
                                                {value: 1, label: '주문'},
                                                {value: 2, label: '미주문'}
                                            ]} style={{width: '100%'}}>
                                    </Select>
                                </div>
                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                                <div>
                                    <div style={{paddingBottom: 3}}>문서번호</div>
                                    <Input id={'searchDocumentNumber'} value={info['searchDocumentNumber']}
                                           size={'small'}
                                           onChange={onChange}/>
                                </div>
                                <div>
                                    <div style={{paddingBottom: 3}}>등록직원명</div>
                                    <Input id={'searchCreatedBy'} value={info['searchCreatedBy']} size={'small'}
                                           onChange={onChange}/>
                                </div>
                            <div>
                                <div style={{marginTop: 8, paddingBottom: 3}}>거래처명</div>
                                <Input id={'searchCustomerName'} value={info['searchCustomerName']} size={'small'}
                                       onChange={onChange}/>
                            </div>
                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>MAKER</div>
                                <Input id={'searchMaker'} value={info['searchMaker']} size={'small'}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>MODEL</div>
                                <Input id={'searchModel'} value={info['searchModel']} size={'small'}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>ITEM</div>
                                <Input id={'searchItem'} value={info['searchItem']} size={'small'} onChange={onChange}/>
                            </div>

                        </Card>
                    </div>
                    <div style={{marginTop: 8, textAlign: 'right'}}>
                        <Button onClick={searchInfo} type={'primary'}><SearchOutlined/>조회</Button>
                    </div>
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    listType={'estimateId'}
                    columns={tableEstimateReadColumns}
                    tableData={tableData}
                    type={'read'}
                    excel={true}
                    funcButtons={<div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                        <CopyOutlined/>복사
                    </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                            <FileExcelOutlined/>출력
                        </Button></div>}
                />

            </div>
        </LayoutComponent>
    </>
}



// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('estimate/getEstimateList', {
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
        "searchCustomerName": "",           // 거래처명
        "searchMaker": "",                  // MAKER
        "searchModel": "",                  // MODEL
        "searchItem": "",                   // ITEM
        "searchCreatedBy": "",              // 등록직원명
        "page": 1,
        "limit": -1,
    });


    let copyData = result?.data?.entity?.estimateList
    copyData.forEach((v)=>{
        v.amount=v.quantity*v.unitPrice
        // console.log(v.amount, 'v.amount')
    })


    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }
    if (codeInfo !== 1) {
        param = {
            redirect: {
                destination: '/', // 리다이렉트할 대상 페이지
                permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
            },
        };
    } else {
        // result?.data?.entity?.estimateRequestList
        param = {
            // props: {dataList:result?.data?.entity?.estimateList}
            props: {data:copyData}
        }
    }


    return param
})