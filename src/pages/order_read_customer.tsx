import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {tableOrderCustomerColumns,
} from "@/utils/columnList";
import {orderCustomerReadInitial,
} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import Input from "antd/lib/input/Input";
import DatePicker from "antd/lib/date-picker";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";

const {RangePicker} = DatePicker

export default function orderReadCustomer({dataList}) {
    const gridRef = useRef(null);

    const {orderList, pageInfo} = dataList;
    const [info, setInfo] = useState(orderCustomerReadInitial);
    const [tableData, setTableData] = useState(orderList);


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
        const result = await getData.post('settlement/getOrderListByCustomer',
            {...copyData,   "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.orderList)
    }

    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };




    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', gridColumnGap: 5}}>
            <Card size={'small'} title={'거래처 별 주문 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                <Card size={'small'} style={{
                    fontSize: 13,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                }}>
                    <div style={{display: 'grid', gridTemplateColumns: '300px 300px 1fr ', gap: 20}}>
                        <div>
                            <div style={{marginBottom: 3}}>발주일자</div>
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
                        <div>
                            <div style={{marginBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} value={info['searchDocumentNumber']}
                                   onChange={onChange}
                                   size={'small'}/>
                        </div>


                        {/*<div>*/}
                        {/*    <Radio.Group onChange={e=> setInfo(v=>{return {...v, searchType: e.target.value}})} defaultValue={2} id={'searchType'}*/}
                        {/*                 value={info['searchType']}>*/}
                        {/*        <Radio value={1}>코드</Radio>*/}
                        {/*        <Radio value={2}>상호명</Radio>*/}
                        {/*        <Radio value={3}>지역</Radio>*/}
                        {/*        <Radio value={4}>전화번호</Radio>*/}
                        {/*    </Radio.Group>*/}
                        {/*</div>*/}

                        <div style={{marginTop: 14}}>
                            <Button type={'primary'} onClick={searchInfo}><SearchOutlined/>조회</Button>
                        </div>
                    </div>


                </Card>
            </Card>

            <TableGrid
                gridRef={gridRef}
                columns={tableOrderCustomerColumns}
                tableData={tableData}
                type={'read'}
                excel={true}
                funcButtons={
                    <Button type={'default'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                        <FileExcelOutlined/>출력
                    </Button>}
            />

        </div>
    </LayoutComponent>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('settlement/getOrderListByCustomer', {
        "searchType": "1",      // 1: 코드, 2: 상호명, 3: MAKER
        "searchText": "",
        "page": 1,
        "limit": -1
    });

    console.log(result?.data?.entity,'result?.data?.entity:')

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