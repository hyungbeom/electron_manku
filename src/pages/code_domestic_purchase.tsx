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

import {rfqReadColumns, tableCodeDomesticPurchaseColumns,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial,} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";


export default function codeDomesticPurchase({dataList}) {
    const gridRef = useRef(null);
    let checkList = []

    const {agencyList, pageInfo} = dataList;
    // const [saveInfo, setSaveInfo] = useState(codeDomesticPurchaseInitial);
    const [info, setInfo] = useState(codeDomesticPurchaseInitial);
    const [tableData, setTableData] = useState(agencyList);


    // console.log(saveInfo,'saveInfo:')


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function onSearch() {
        const result = await getData.post('agency/getAgencyList', info);
        if(result?.data?.code === 1){
            setTableData(result?.data?.entity?.agencyList)
        }
    }

    async function deleteList() {
        const api = gridRef.current.api;
        console.log(api.getSelectedRows(),':::')

        if (api.getSelectedRows().length<1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('inventory/deleteInventory', {
                    inventoryId:item.inventoryId
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


    async function copyRow() {
        const api = gridRef.current.api;

        if (api.getSelectedRows().length<1) {
            message.error('복사할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {

                let newItem={...item}

                delete newItem.inventoryId;
                delete newItem.createdBy;
                delete newItem.createdDate;
                delete newItem.modifiedBy;
                delete newItem.modifiedDate;

                const response = await getData.post('inventory/addInventory', newItem);
                console.log(response)
                if (response.data.code===1) {
                    message.success('복사되었습니다.')
                    window.location.reload();
                } else {
                    message.error('오류가 발생하였습니다. 다시 시도해주세요.')
                }
            }
        }
    }


    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "inventory_list.xlsx");
    };

    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateRows: '120px 1fr', height: '100%', gridColumnGap: 5}}>
            <Card size={'small'} title={'국내 매입처 관리'} style={{fontSize: 12, border: '1px solid lightGray'}}>
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
                                <Radio value={3}>MAKER</Radio>
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
                columns={tableCodeDomesticPurchaseColumns}
                tableData={tableData}
                type={'read'}
                excel={true}
                funcButtons={<div><Button type={'primary'} size={'small'} style={{fontSize: 11}} onClick={copyRow}>
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
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('agency/getAgencyList', {
        "searchType": "1",      // 1: 코드, 2: 상호명, 3: MAKER
        "searchText": "",
        "page": 1,
        "limit": -1
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