import React, {useRef, useState} from "react";
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
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteOrder, searchOrder} from "@/utils/api/mainApi";
import {commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {BoxCard} from "@/utils/commonForm";

const {RangePicker} = DatePicker


export default function OrderRead({data}) {

    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(orderReadInitial)

    // copyInit = copyUnitInit;

    const [info, setInfo] = useState({
        ...copyInit,
        searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    })
    const [tableData, setTableData] = useState(data)


    const inputForm = ({title, id, disabled = false, suffix = null}) => {
        let bowl = info;


        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   suffix={suffix}
            />
        </div>
    }


    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo()
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('order/getOrderList',
            {...copyData, "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.orderList)
    }

    async function deleteList() {
        const api = gridRef.current.api;

        let bowl = {
            deleteList: []
        }
        if (api.getSelectedRows().length < 1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const {orderId, orderDetailId} = item;
                bowl['deleteList'].push({
                    "orderId": orderId,
                    "orderDetailId": orderDetailId
                })
            }
            await deleteOrder({data: bowl, returnFunc: searchInfo});
        }
    }

    const downloadExcel = () => {
        commonManage.excelDownload(tableData)
    };


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
        <CopyOutlined/>복사
    </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                onClick={downloadExcel}>
            <FileExcelOutlined/>출력
        </Button></div>

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>발주 조회</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{fontSize: 12, border: '1px solid lightGray'}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <BoxCard title={''}>
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
                            {inputForm({title: '문서번호', id: 'searchDocumentNumber'})}
                        </BoxCard>
                        <BoxCard title={''}>
                            {inputForm({title: '견적서 담당자', id: 'searchEstimateManager'})}
                            {inputForm({title: '고객사명', id: 'searchCustomerName'})}
                        </BoxCard>
                        <BoxCard title={''}>


                            {inputForm({title: 'MAKER', id: 'searchMaker'})}
                            {inputForm({title: 'MODEL', id: 'searchModel'})}
                            {inputForm({title: 'ITEM', id: 'searchItem'})}
                        </BoxCard>

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
                    funcButtons={subTableUtil}
                />

            </div>
        </LayoutComponent>
    </>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo === -90009) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));
        const data = await searchOrder({data: {}})
        return {
            props: {data: data}
        }
    }
})