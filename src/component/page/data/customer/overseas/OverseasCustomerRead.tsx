import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";

import {tableCodeDomesticSalesColumns, tableCodeOverseasSalesColumns,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial, estimateDetailUnit, tableCodeDomesticSalesInitial,} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";
import message from "antd/lib/message";
import * as XLSX from "xlsx";
import Button from "antd/lib/button";
import {CopyOutlined, EditOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import {inputForm, MainCard, radioForm} from "@/utils/commonForm";
import {commonFunc, gridManage} from "@/utils/commonManage";
import {searchDomesticCustomer, searchOverseasCustomer} from "@/utils/api/mainApi";

export default function OverseasCustomerRead({getPropertyId, getCopyPage}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(codeDomesticPurchaseInitial);
    const [totalRow, setTotalRow] = useState(0);
    const [mini, setMini] = useState(true);


    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchOverseasCustomer({
            data: {
                "searchType": "1",      // 1: 코드, 2: 상호명, 3: Maker
                "searchText": "",
                "page": 1,
                "limit": -1
            }
        }).then(v => {
            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
        })
    };



    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }



    async function searchInfo(e) {

        if (e) {
            setLoading(true)


            await searchOverseasCustomer({
                data: {
                    "searchType": info['searchType'],      // 1: 코드, 2: 상호명, 3: Maker
                    "searchText": info['searchText'],
                    "page": 1,
                    "limit": -1
                }
            }).then(v => {
                console.log(info,'v.data:')
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
        setLoading(false)
    }

    function clearAll() {

    }

    function moveRouter() {
        getCopyPage('overseas_customer_write', {estimateDetailList : []})

    }
    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }
    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 250 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'해외 고객사 조회'}
                      list={[{name: '조회', func: searchInfo, type: 'primary'},
                          {name: '초기화', func: clearAll, type: 'danger'},
                          {name: '신규생성', func: moveRouter}]}
                      mini={mini} setMini={setMini}>


                {mini ? <div style={{display: 'flex', alignItems: 'center', padding: 10}}>
                    {radioForm({
                        title: '',
                        id: 'searchType',
                        onChange: onChange,
                        data: info,
                        list: [{value: 1, title: '코드'},
                            {value: 2, title: '상호명'},
                            {value: 3, title: 'item'},
                            {value: 4, title: '국가'}]
                    })}

                    <div style={{width: 500, marginLeft: 20}}>
                        {inputForm({
                            title: '',
                            id: 'searchText',
                            onChange: onChange,
                            handleKeyPress: handleKeyPress,
                            data: info,
                            size: 'middle'
                        })}
                    </div>

                </div> : <></>}
            </MainCard>
            <TableGrid
                totalRow={totalRow}
                getPropertyId={getPropertyId}
                gridRef={gridRef}
                onGridReady={onGridReady}
                columns={tableCodeOverseasSalesColumns}
                funcButtons={['print']}
            />
            overseasCustomerList
        </div>
    </>
}
