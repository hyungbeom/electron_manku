import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {tableOrderReadColumns} from "@/utils/columnList";
import {orderReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteOrder, searchOrder} from "@/utils/api/mainApi";
import {commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {BoxCard, inputForm, MainCard, rangePickerForm} from "@/utils/commonForm";
import {useRouter} from "next/router";


export default function OrderRead({dataInfo}) {
    const router = useRouter();

    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(orderReadInitial)

    const [info, setInfo] = useState(copyInit);
    const [mini, setMini] = useState(true);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo ? dataInfo : []});
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

    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const fieldMappings = {
            orderId: 'orderId',
            orderDetailId: 'orderDetailId'
        };

        const deleteList = gridManage.getFieldDeleteList(gridRef, fieldMappings);
        await deleteOrder({data: {deleteList: deleteList}, returnFunc: searchInfo});

    }

    const downloadExcel = async () => {
        gridManage.exportSelectedRowsToExcel(gridRef, '발주서_목록')
    };

    async function moveRouter() {
        router.push('/order_write')
    }

    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div>
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
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '250px' : '65px'} calc(100vh - ${mini ? 345 : 160}px)`,
                columnGap: 5
            }}>
                <MainCard title={'발주서 조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'}, {name: '신규생성', func: moveRouter}]}
                          mini={mini} setMini={setMini}>

                    {mini ? <div
                            style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                            <BoxCard title={''}>
                                {rangePickerForm({title: '발주일자', id: 'searchDate', onChange: onChange, data: info})}
                                {inputForm({
                                    title: '문서번호',
                                    id: 'searchDocumentNumber',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>
                            <BoxCard title={''}>
                                {inputForm({
                                    title: '견적서 담당자',
                                    id: 'searchEstimateManager',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '고객사명',
                                    id: 'searchCustomerName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>
                            <BoxCard title={''}>


                                {inputForm({
                                    title: 'MAKER',
                                    id: 'searchMaker',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'MODEL',
                                    id: 'searchModel',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'ITEM',
                                    id: 'searchItem',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>

                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}} onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                    gridRef={gridRef}
                    onGridReady={onGridReady}
                    columns={tableOrderReadColumns}
                    funcButtons={['print']}
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
    } else {
        store.dispatch(setUserInfo(userInfo));
        const result = await searchOrder({data: orderReadInitial})
        return {
            props: {dataInfo: result ? result : null}
        }
    }
})