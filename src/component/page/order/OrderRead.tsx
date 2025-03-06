import React, {useRef, useState} from "react";
import {CopyOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {tableOrderReadColumns} from "@/utils/columnList";
import {orderDetailUnit, orderReadInitial} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteOrder, searchOrder} from "@/utils/api/mainApi";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {BoxCard, inputForm, MainCard, rangePickerForm} from "@/utils/commonForm";
import {useRouter} from "next/router";
import ReceiveComponent from "@/component/ReceiveComponent";
import Spin from "antd/lib/spin";


export default function OrderRead({getPropertyId, getCopyPage}) {
    const router = useRouter();

    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(orderReadInitial)

    const [info, setInfo] = useState(copyInit);
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchOrder({data: orderReadInitial}).then(v => {
            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
        })
    };


    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function searchInfo(e) {
        const copyData: any = {...info}
        if (e) {
            setLoading(true);
            await searchOrder({data: {...copyData, "page": 1, "limit": -1}}).then(v => {
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })

        }
        setLoading(false)
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }


        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            orderId: 'orderId',
            orderDetailId: 'orderDetailId'
        });
        setLoading(true);
        await deleteOrder({data: {deleteList: deleteList}, returnFunc: searchInfo});

    }

    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    async function moveRouter() {
        getCopyPage('order_write', {orderDetailList: commonFunc.repeatObject(orderDetailUnit, 10)})
    }


    return <Spin spinning={loading} tip={'견적서 조회중...'}>
        <ReceiveComponent searchInfo={searchInfo}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '260px' : '65px'} calc(100vh - ${mini ? 390 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'발주서 조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'},
                              {name: '초기화', func: clearAll, type: 'danger'},
                              {name: '신규생성', func: moveRouter}]}
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
                                    title: 'Maker',
                                    id: 'searchMaker',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Model',
                                    id: 'searchModel',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Item',
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
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}

                           totalRow={totalRow}
                           getPropertyId={getPropertyId}
                           gridRef={gridRef}
                           onGridReady={onGridReady}
                           columns={tableOrderReadColumns}
                           funcButtons={['print']}
                />

            </div>
        </>
    </Spin>
}

