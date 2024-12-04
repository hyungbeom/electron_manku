import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {tableOrderReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {orderReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import is from "@sindresorhus/is";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";

const {RangePicker} = DatePicker


export default function OrderRead({data}) {

    const gridRef = useRef(null);

    // const {orderList} = dataList;
    const [info, setInfo] = useState(orderReadInitial)
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
        const result = await getData.post('order/getOrderList',
            {...copyData,   "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.orderList)
    }

    async function deleteList() {
        const api = gridRef.current.api;
        console.log(api.getSelectedRows(),':::')

        if (api.getSelectedRows().length<1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('order/deleteOrder', {
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

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>발주 조회</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{fontSize: 12, border: '1px solid lightGray'}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
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
                                <div style={{marginTop: 8}}>
                                    <div style={{marginBottom: 3}}>문서번호</div>
                                    <Input id={'searchDocumentNumber'} value={info['searchDocumentNumber']}
                                           onChange={onChange}
                                           size={'small'}/>
                                </div>
                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>

                            <div>
                                <div style={{marginBottom: 3}}>견적서 담당자</div>
                                <Input id={'searchEstimateManager'} value={info['searchEstimateManager']}
                                       onChange={onChange} size={'small'}/>
                            </div>

                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>고객사명</div>
                                <Input id={'searchCustomerName'} value={info['searchCustomerName']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{marginBottom: 3}}>MAKER</div>
                                <Input id={'searchMaker'} value={info['searchMaker']} onChange={onChange}
                                           size={'small'}/>
                                </div>
                                <div style={{marginTop: 8}}>
                                    <div style={{marginBottom: 3}}>MODEL</div>
                                    <Input id={'searchModel'} value={info['searchModel']} onChange={onChange}
                                           size={'small'}/>
                                </div>
                                <div style={{marginTop: 8}}>
                                    <div style={{marginBottom: 3}}>ITEM</div>
                                    <Input id={'searchItem'} value={info['searchItem']} onChange={onChange}
                                           size={'small'}/>
                                </div>

                            </Card>

                    </div>

                <div style={{paddingTop: 8, textAlign: 'right'}}>
                    <Button type={'primary'} onClick={searchInfo}><SearchOutlined/>조회</Button>
                </div>
            </Card>

            <TableGrid
                gridRef={gridRef}
                listType={'orderId'}
                columns={tableOrderReadColumns}
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
        "searchCustomerName": "",       // 고객사명
        "searchMaker": "",              // MAKER
        "searchModel": "",              // MODEL
        "searchItem": "",               // ITEM
        "searchEstimateManager": "",    // 견적서담당자명
        "page": 1,
        "limit": -1
    });

    let copyData = result?.data?.entity?.orderList
    copyData.forEach((v)=>{
        v.unreceivedQuantity=v.quantity-v.receivedQuantity
        // console.log(v.amount, 'v.amount')
    })


    return {
        props: {data:copyData}
    }
})