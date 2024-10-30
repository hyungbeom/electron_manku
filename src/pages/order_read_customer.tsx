import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {tableOrderCustomerColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {orderCustomerReadInitial, tableOrderCustomerInitial} from "@/utils/initialList";
import {tableOrderCustomerInfo} from "@/utils/modalDataList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import {transformData} from "@/utils/common/common";

const {RangePicker} = DatePicker

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function OrderReadCustomer({dataList}) {
    let checkList = []

    const {orderList, pageInfo} = dataList;
    const [info, setInfo] = useState(orderCustomerReadInitial)
    const [tableInfo, setTableInfo] = useState(orderList)
    const [paginationInfo, setPaginationInfo] = useState(pageInfo)

    // console.log(pageInfo,'pageInfo:')
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
        // setTableInfo(transformData(orderList, 'customerName', 'orderList'));
    }, [])



    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        console.log(searchDate, 'searchDate')

        const result = await getData.post('settlement/getOrderListByCustomer', copyData);
        console.log(result?.data?.entity, 'result')
        // setTableInfo(transformData(result?.data?.entity?.inventoryList, 'inventoryId', 'inventoryList'));
        setTableInfo(result?.data?.entity?.orderList);
        setPaginationInfo(result?.data?.entity?.pageInfo)
    }

    async function deleteList() {
        const copyData: any = {...tableInfo}
        // @ts-ignore
        const deleteItemList= Object.values(copyData).filter(v=>checkList.includes(v.key))

        console.log(checkList,  "checkList")
        console.log(deleteItemList,  "deleteItemList")

        if (deleteItemList.length < 1)
            alert('하나 이상의 항목을 선택해주세요.')
        else {
            // @ts-ignore
            for (const v of deleteItemList) {await getData.post(`inventory/deleteInventory?inventoryId=${v.inventoryId}`).then(r=>{
                if(r.data.code === 1)
                    alert('삭제되었습니다.')
            });
            }
        }
        await searchInfo();
    }

    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableInfo);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {

            checkList  = selectedRowKeys

        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'거래처 별 주문 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div>
                            <div style={{paddingBottom: 3}}>조회일자</div>
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
                        <div style={{marginTop:8}}>
                                <div style={{paddingBottom: 3}}>거래처명</div>
                                <Input id={'searchCustomerName'} value={info['searchCustomerName']} onChange={onChange} size={'small'}/>
                        </div>


                    </Card>
                    <div style={{paddingTop: 20, textAlign: 'right'}}>
                        <Button type={'primary'} style={{marginRight: 8}}
                                onClick={searchInfo}><SearchOutlined/>조회</Button>
                    </div>
                </Card>

                <CustomTable columns={tableOrderCustomerColumns}
                             initial={tableOrderCustomerInitial}
                             dataInfo={tableOrderCustomerInfo}
                             info={tableInfo}
                             setDatabase={setInfo}
                             setTableInfo={setTableInfo}
                             rowSelection={rowSelection}
                             pageInfo={paginationInfo}
                             setPaginationInfo={setPaginationInfo}

                             subContent={<>
                                 <Button type={'dashed'} size={'small'} style={{fontSize: 11, margin:'0 0 0 auto'}} onClick={downloadExcel}>
                                     <FileExcelOutlined/>출력
                                 </Button></>}
                />

            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('settlement/getOrderListByCustomer', {
        "searchStartDate": "",      // 조회일자 시작일
        "searchEndDate": "",        // 조회일자 종료일
        "searchCustomerName": "",   // 거래처명
        "page": 1,
        "limit": 10
    });


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
            props: {dataList: result?.data?.entity}
        }
    }

    return param
})