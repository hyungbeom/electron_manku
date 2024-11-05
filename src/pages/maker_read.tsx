import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {subRfqReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";

const {RangePicker} = DatePicker


export default function MakerRead({dataList}) {
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const {estimateRequestList, pageInfo} = dataList;
    const [info, setInfo] = useState(subRfqReadInitial);
    const [tableData, setTableData] = useState(estimateRequestList);


    // console.log(selectedRows, 'selectedRows')


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
        // setTableInfo(transformData(estimateRequestList, 'estimateRequestId', 'estimateRequestDetailList'));
        // setTableData(estimateRequestList);
        // console.log(tableData, 'setTableData')
    }, [])


    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        console.log(copyData,'copyData:')
        const result = await getData.post('estimate/getEstimateRequestList', {...copyData,   "page": 1,
            "limit": -1});
        // setTableInfo(transformData(result?.data?.entity?.estimateRequestList, 'estimateRequestId', 'estimateRequestDetailList'));
        console.log(result?.data?.entity?.estimateRequestList,'result?.data?.entity?.estimateRequestList:')
        setTableData(result?.data?.entity?.estimateRequestList);
    }


    function deleteList(checkList) {
        const api = gridRef.current.api;
        console.log(api.getSelectedRows(),':::')
    }



    async function getDetailData(params) {
        const result = await getData.post('estimate/getEstimateRequestDetail', {
            estimateRequestId:params
        });
        setTableData(result?.data?.entity?.estimateRequestList)
    }

    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            selectedRows = selectedRowKeys
        },
        onDoubleClick: (src) => {
            console.log(src, ':::')
        },
        getCheckboxProps: (record) => ({
            disabled: record?.name === 'Disabled User',
            // Column configuration not to be checked
            name: record?.name,
        }),
    };

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'의뢰 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        ㄴㅇㄹ
                    </Card>
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    columns={rfqReadColumns}
                    tableData={tableData}
                    setSelectedRows={setSelectedRows}
                    // dataInfo={tableOrderReadInfo}
                    // setDatabase={setInfo}
                    // setTableInfo={setTableData}
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

    const result = await getData.post('estimate/getEstimateRequestList', {
        "searchEstimateRequestId": "",      // 견적의뢰 Id
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
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


    return {
        props: {dataList: result?.data?.entity}
    }
})