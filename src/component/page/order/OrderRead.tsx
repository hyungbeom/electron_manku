import React, {useRef, useState} from "react";
import {CopyOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
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
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";


export default function OrderRead({getPropertyId, getCopyPage}:any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)

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

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('order_read');
        console.log(JSON.parse(savedSizes),'JSON.parse(savedSizes)::')
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

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
        const selectedRows = gridRef.current.getSelectedRows();
        await deleteOrder({data: {deleteList: deleteList}}).then(v=>{
            if(v.code === 1){
                searchInfo(true);
                notificationAlert('success', '🗑️발주서 삭제완료',
                    <>
                        <div>Inquiry No.
                            - {selectedRows[0]?.documentNumberFull} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다
                        </div>
                        {/*<div>프로젝트 제목 - {selectedRows[0].projectTitle} `${selectedRows.length > 1 ? ('외' + (selectedRows.length - 1)) + '개' : ''}`가 삭제되었습니다 </div>*/}
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
            }else{
                message.error(v.message)
            }
        })

    }

    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    async function moveRouter() {
        getCopyPage('order_write', {orderDetailList: commonFunc.repeatObject(orderDetailUnit, 10)})
    }


    return <Spin spinning={loading} tip={'견적서 조회중...'}>
        <PanelSizeUtil groupRef={groupRef} storage={'order_read'}/>
        <ReceiveComponent searchInfo={searchInfo}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '270px' : '65px'} calc(100vh - ${mini ? 400 : 195}px)`,
            }}>
                <MainCard title={'발주서 조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'},
                              {name: '초기화', func: clearAll, type: 'danger'},
                              {name: '신규생성', func: moveRouter}]}
                          mini={mini} setMini={setMini}>

                    {mini ? <div>
                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
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
                            </Panel>
                            <PanelResizeHandle/>

                            <Panel defaultSize={sizes[1]} minSize={5}>
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
                            </Panel>

                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
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
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                            </Panel>
                        </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={ <Popconfirm
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
                           columns={tableOrderReadColumns}
                           funcButtons={['agPrint']}/>


            </div>
        </>
    </Spin>
}

