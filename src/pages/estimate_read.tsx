import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {tableEstimateReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateReadInitial, subRfqReadInitial} from "@/utils/initialList";
import Select from "antd/lib/select";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {getData} from "@/manage/function/api";
import {setUserInfo} from "@/store/user/userSlice";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteEstimate, deleteOrder, deleteRfq, searchEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import {useRouter} from "next/router";

const {RangePicker} = DatePicker


export default function EstimateRead({dataInfo}) {
    const router = useRouter();

    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(estimateReadInitial)
    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);


    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo});
    };


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


        const result = await getData.post('order/getOrderList',
            {...copyData, "page": 1, "limit": -1});

        gridManage.resetData(gridRef, result?.data?.entity?.orderList);

    }

    async function moveRouter() {
        router.push('/estimate_write')
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const fieldMappings = {
            estimateId: 'estimateId',
            estimateDetailIdList: 'estimateDetailIdList'
        };

        const deleteList = gridManage.getFieldDeleteList(gridRef, fieldMappings);

        await deleteOrder({data: {deleteList: deleteList}, returnFunc: searchInfo});

    }


    const downloadExcel = async () => {
        gridManage.exportSelectedRowsToExcel(gridRef, '견적서_목록')
    };


    const subTableUtil = <div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
        <CopyOutlined/>복사
    </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}} onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5,}} onClick={downloadExcel}>
            <FileExcelOutlined/>출력
        </Button></div>

    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '260px' : '65px'} calc(100vh - ${mini ? 320 : 120}px)`,
                columnGap: 5
            }}>
                <MainCard title={'견적서 조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'}, {name: '신규생성', func: moveRouter}]}
                          mini={mini} setMini={setMini}>
                    {mini ? <div
                            style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>
                            <BoxCard title={''}>
                                {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info})}
                                {selectBoxForm({
                                    title: '주문 여부', id: 'searchType', onChange: onChange, data: info, list: [
                                        {value: 0, label: '전체'},
                                        {value: 1, label: '주문'},
                                        {value: 2, label: '미주문'}
                                    ]
                                })}

                            </BoxCard>
                            <BoxCard title={''}>

                                {inputForm({
                                    title: '문서번호', id: 'searchDocumentNumber',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '등록직원명', id: 'searchCreatedBy',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '고객사명', id: 'searchCustomerName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}

                            </BoxCard>
                            <BoxCard title={''}>

                                {inputForm({
                                    title: 'MAKER', id: 'searchMaker',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'MODEL', id: 'searchModel',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'ITEM', id: 'searchItem',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}

                            </BoxCard>
                        </div>
                        : <></>}
                </MainCard>
                <TableGrid
                    gridRef={gridRef}
                    onGridReady={onGridReady}
                    columns={tableEstimateReadColumns}
                    funcButtons={subTableUtil}
                />

            </div>
        </LayoutComponent>
    </>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));
    let result = await searchEstimate({data: estimateReadInitial});
    return {
        props: {dataInfo: result ? result : null}
    }

})