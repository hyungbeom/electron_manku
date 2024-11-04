import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {tableOrderReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {orderReadInitial, tableOrderReadInitial} from "@/utils/initialList";
import {tableOrderReadInfo} from "@/utils/modalDataList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";
import is from "@sindresorhus/is";
import set = is.set;
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";

const {RangePicker} = DatePicker

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function OrderRead({dataList}) {

    const [selectedRows, setSelectedRows] = useState([]);
    const {orderList, pageInfo} = dataList;
    const [info, setInfo] = useState(orderReadInitial)
    const [tableData, setTableData] = useState(orderList)
    const [paginationInfo, setPaginationInfo] = useState(pageInfo)


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
        // setTableInfo(transformData(orderList, 'orderId', 'orderDetailList'));
        // setTableInfo(orderList)
    }, [info])



    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('order/getOrderList', copyData);
        // setTableInfo(transformData(result?.data?.entity?.orderList, 'orderId', 'orderDetailList'));
        setTableData(result?.data?.entity?.orderList)
        setPaginationInfo(result?.data?.entity?.pageInfo)
    }



    async function deleteList() {

        let deleteIdList = [];
        selectedRows.forEach(v=>(
            deleteIdList.push(v.orderId)
        ))

        console.log(deleteIdList, 'deleteIdList')

        if (deleteIdList.length < 1)
            return alert('하나 이상의 항목을 선택해주세요.')
        else {
            // @ts-ignore
            for (const v of deleteIdList) {
                await getData.post('order/deleteOrder', {
                    orderId: v}).then(r=>{
                    if(r.data.code === 1)
                        console.log(v+'삭제완료')
                });
            }
            message.success('삭제되었습니다.')
            window.location.reload();
        }
    }

    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            selectedRows  = selectedRowKeys
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
                <Card title={'발주 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일자</div>
                            <RangePicker style={{width: '100%'}}
                                         value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
                                         id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                onChange({
                                    target: {
                                        id: 'searchDate',
                                        value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                    }
                                })
                            }
                            }/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} value={info['searchDocumentNumber']} onChange={onChange}
                                   size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>거래처명</div>
                            <Input id={'searchCustomerName'} value={info['searchCustomerName']} onChange={onChange}
                                   size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'searchMaker'} value={info['searchMaker']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>MODEL</div>
                            <Input id={'searchModel'} value={info['searchModel']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'searchItem'} value={info['searchItem']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>견적서담당자</div>
                            <Input id={'searchEstimateManager'} value={info['searchEstimateManager']}
                                   onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={searchInfo}><SearchOutlined/>조회</Button>
                        </div>

                    </Card>

                </Card>

                {/*<CustomTable columns={tableOrderReadColumns}*/}
                {/*             initial={tableOrderReadInitial}*/}
                {/*             dataInfo={tableOrderReadInfo}*/}
                {/*             info={tableInfo}*/}
                {/*             setDatabase={setInfo}*/}
                {/*             setTableInfo={setTableInfo}*/}
                {/*             rowSelection={rowSelection}*/}
                {/*             pageInfo={paginationInfo}*/}
                {/*             setPaginationInfo={setPaginationInfo}*/}
                {/*             visible={true}*/}
                {/*             handlePageChange={handlePageChange}*/}

                {/*             subContent={<><Button type={'primary'} size={'small'} style={{fontSize: 11}}>*/}
                {/*                 <CopyOutlined/>복사*/}
                {/*             </Button>*/}
                {/*                 /!*@ts-ignored*!/*/}
                {/*                 <Button type={'danger'} size={'small'} style={{fontSize: 11}} onClick={deleteList}>*/}
                {/*                     <CopyOutlined/>삭제*/}
                {/*                 </Button>*/}
                {/*                 <Button type={'dashed'} size={'small'} style={{fontSize: 11}} onClick={downloadExcel}>*/}
                {/*                     <FileExcelOutlined/>출력*/}
                {/*                 </Button></>}*/}
                {/*/>*/}

                <TableGrid
                    columns={tableOrderReadColumns}
                    tableData={tableData}
                    // setDatabase={setInfo}
                    // setTableData={setTableData}
                    // rowSelection={rowSelection}
                    pageInfo={paginationInfo}
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

    const result = await getData.post('order/getOrderList', {
        "searchStartDate": "",          // 발주일자 검색 시작일
        "searchEndDate": "",            // 발주일자 검색 종료일
        "searchDocumentNumber": "",     // 문서번호
        "searchCustomerName": "",       // 거래처명
        "searchMaker": "",              // MAKER
        "searchModel": "",              // MODEL
        "searchItem": "",               // ITEM
        "searchEstimateManager": "",    // 견적서담당자명
        "page": 1,
        "limit": 100
    });


    return {
        props: {dataList: result?.data?.entity}
    }
})