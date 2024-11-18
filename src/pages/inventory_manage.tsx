import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {CopyOutlined, DeleteOutlined, EditOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns, tableOrderInventory, tableOrderInventoryColumns,} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {inventoryReadInitial, subRfqReadInitial, tableOrderInventoryInitial,} from "@/utils/initialList";
import {tableOrderInventoryInfo,} from "@/utils/modalDataList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";
import TableModal from "@/utils/TableModal";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {useRouter} from "next/router";


export default function OrderInventoryRead({dataList}) {

    const router = useRouter();
    const gridRef = useRef(null);

    const {inventoryList} = dataList;
    const [info, setInfo] = useState(tableOrderInventoryInitial)
    const [tableData, setTableData] = useState(inventoryList);

    // console.log(inventoryList, 'inventoryList')

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

        const result = await getData.post('inventory/getInventoryList',
            {...copyData,   "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.inventoryList);
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

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', gridColumnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>재고 조회</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>

                    <Card size={'small'} style={{
                        fontSize: 11,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                            width: '100%',
                            columnGap: 20
                        }}>
                            {/*<div>*/}
                            {/*    <div style={{paddingBottom: 3}}>MAKER</div>*/}
                            {/*    <Input id={'searchMaker'} value={info['searchMaker']} onChange={onChange}*/}
                            {/*           size={'small'}/>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <div style={{paddingBottom: 3}}>MODEL</div>*/}
                            {/*    <Input id={'searchModel'} value={info['searchModel']} onChange={onChange}*/}
                            {/*           size={'small'}/>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <div style={{paddingBottom: 3}}>위치</div>*/}
                            {/*    <Input id={'searchLocation'} value={info['searchLocation']} onChange={onChange}*/}
                            {/*           size={'small'}/>*/}
                            {/*</div>*/}
                            <div>
                                <div style={{paddingBottom: 3}}>MAKER 또는 MODEL을 입력하세요</div>
                                <Input id={'searchText'} value={info['searchText']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div style={{width: '100%', textAlign: 'right', marginTop: 15}}>
                        <span style={{paddingTop: 8, textAlign: 'right',}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={searchInfo}><SearchOutlined/>조회</Button>
                        </span>
                                <span style={{paddingTop: 8, textAlign: 'right'}}>
                            <Button type={'ghost'} style={{marginRight: 8,}}
                                    onClick={() => router?.push('/inventory_write')}><EditOutlined/>신규작성</Button>
                        </span>
                            </div>

                        </div>

                    </Card>


                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={tableOrderInventory}
                    tableData={tableData}
                    type={'read'}
                    excel={true}
                    funcButtons={<div><Button type={'primary'} size={'small'} style={{fontSize: 11,}} onClick={copyRow}>
                        <CopyOutlined/>복사
                    </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                            <FileExcelOutlined/>엑셀
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

    const result = await getData.post('inventory/getInventoryListForAdd', {
        "searchText": "",   // 검색어
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
        param = {
            props: {dataList: result?.data?.entity}
        }
    }


    return param
})