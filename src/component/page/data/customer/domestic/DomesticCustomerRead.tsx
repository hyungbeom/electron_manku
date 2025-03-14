import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";

import {tableCodeDomesticSalesColumns,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial, tableCodeDomesticSalesInitial,} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";
import message from "antd/lib/message";
import * as XLSX from "xlsx";
import Button from "antd/lib/button";
import {
    CopyOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    FileExcelOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {useRouter} from "next/router";
import {inputForm, MainCard, radioForm} from "@/utils/commonForm";
import {searchDomesticAgency, searchDomesticCustomer} from "@/utils/api/mainApi";
import {gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import Popconfirm from "antd/lib/popconfirm";

export default function DomesticCustomerRead({ getPropertyId, getCopyPage}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(codeDomesticPurchaseInitial);
    const [totalRow, setTotalRow] = useState(0);
    const [mini, setMini] = useState(true);
    // console.log(customerList,'saveInfo:')

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchDomesticCustomer({
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


    async function deleteList() {
        const api = gridRef.current;


        if (api.getSelectedRows().length < 1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('customer/deleteCustomer', {
                    customerId: item.customerId
                }).then(v=>{
                    if (v.data.code === 1) {
                        message.success('삭제되었습니다.')

                    } else {
                        message.error(v.data.message)
                    }

                })

            }
        }
    }


    async function searchInfo(e) {

        if (e) {
            setLoading(true)


            await searchDomesticCustomer({
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

        getCopyPage('domestic_customer_write',{})
    }
    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }
    return <Spin spinning={loading} tip={'국내고객사 조회중...'}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 250 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'국내 고객사 조회'}
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

                deleteComp={<Popconfirm
                    title="삭제하시겠습니까?"
                    onConfirm={deleteList}
                    icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>

                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                </Popconfirm>
                }

                totalRow={totalRow}
                getPropertyId={getPropertyId}
                gridRef={gridRef}
                onGridReady={onGridReady}
                columns={tableCodeDomesticSalesColumns}
                funcButtons={['agPrint']}
            />

        </div>
    </Spin>
}
