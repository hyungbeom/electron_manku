import React, {useEffect, useRef, useState} from "react";
import moment from "moment/moment";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Input from "antd/lib/input/Input";

import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined, SearchOutlined,} from "@ant-design/icons";
import * as XLSX from "xlsx";
import message from "antd/lib/message";

import {
    rfqReadColumns,
    tableCodeDomesticPurchaseColumns,
    tableCodeDomesticSalesColumns,
    tableCodeOverseasPurchaseColumns,
} from "@/utils/columnList";
import {
    codeDomesticPurchaseInitial,
    tableCodeDomesticSalesInitial,
    tableCodeOverseasSalesInitial,
} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";


const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}
export default function codeOverseasSales({dataList}) {
    const gridRef = useRef(null);
    let checkList = []

    const {overseasCustomerList, pageInfo} = dataList;
    const [saveInfo, setSaveInfo] = useState(tableCodeOverseasSalesInitial);
    const [info, setInfo] = useState(tableCodeOverseasSalesInitial);
    const [tableData, setTableData] = useState(overseasCustomerList);

    const [paginationInfo, setPaginationInfo] = useState(pageInfo);



    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function onSearch() {
        const result = await getData.post('customer/getOverseasCustomerList', info);
        console.log(result?.data?.entity?.customerList,'result:')
        if(result?.data?.code === 1){
            setTableData(result?.data?.entity?.customerList)
        }
    }

    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateRows: '120px 1fr', height: '100%', gridColumnGap: 5}}>
            <Card size={'small'} title={'국내대리점관리(매입)'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                <Card size={'small'} style={{
                    fontSize: 13,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                }}>
                    <div style={{display: 'grid', gridTemplateColumns: '300px 1fr'}}>
                        <div>
                            <Radio.Group onChange={e=> setInfo(v=>{return {...v, searchType: e.target.value}})} defaultValue={2} id={'searchType'}
                                         value={info['searchType']}>
                                <Radio value={1}>코드</Radio>
                                <Radio value={2}>상호명</Radio>
                                <Radio value={3}>지역</Radio>
                                <Radio value={4}>전화번호</Radio>
                            </Radio.Group>
                        </div>

                        <Search
                            onSearch={onSearch}
                            onChange={onChange}
                            id={'searchText'}
                            placeholder="input search text"
                            allowClear
                            enterButton="검색"
                            size="small"
                            // onSearch={onSearch}
                        />

                    </div>

                </Card>
            </Card>

            <TableGrid
                gridRef={gridRef}
                columns={tableCodeDomesticSalesColumns}
                tableData={tableData}
                type={'read'}
                excel={true}
                // funcButtons={<div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                //     <CopyOutlined/>복사
                // </Button>
                //     {/*@ts-ignored*/}
                //     <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={deleteList}>
                //         <CopyOutlined/>삭제
                //     </Button>
                //     <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                //         <FileExcelOutlined/>출력
                //     </Button></div>}
            />

        </div>
    </LayoutComponent>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('customer/getOverseasCustomerList', {
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