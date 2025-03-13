import React, {useEffect, useRef, useState} from "react";
import {CopyOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import {estimateRequestDetailUnit, subRfqReadInitial} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard, inputForm, MainCard, rangePickerForm} from "@/utils/commonForm";
import _ from "lodash";
import {deleteRfq, searchRfq} from "@/utils/api/mainApi";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";


export default function RfqRead({getPropertyId, getCopyPage, }:any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)

    const router = useRouter();
    const countRef = useRef(1);
    const infoRef = useRef(null);
    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(subRfqReadInitial)
    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState(copyInit);
    const [loading, setLoading] = useState(false);
    const [totalRow, setTotalRow] = useState(0);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchRfq({data: subRfqReadInitial}).then(v => {
            const {data, pageInfo} = v;
            setTotalRow(pageInfo.totalRow)

            params.api.applyTransaction({add: data});
        })
    };

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('rfq_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    useEffect(() => {
        infoRef.current = info
    }, [info]);


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
        setLoading(true)
        await searchRfq({
            data: copyData
        }).then(v => {
            countRef.current = 1;
            const {data, pageInfo} = v;
            setTotalRow(pageInfo.totalRow)
            gridManage.resetData(gridRef, data);
            setLoading(false)
            gridRef.current.ensureIndexVisible(0)
        })

    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            estimateRequestId: 'estimateRequestId',
            estimateRequestDetailId: 'estimateRequestDetailId'
        });
        const selectedRows = gridRef.current.getSelectedRows();

        await deleteRfq({data: {deleteList: deleteList}}).then((v:any)=>{

            if(v.code === 1){
                searchInfo();
                notificationAlert('success', '🗑️견적의뢰 삭제완료',
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

    function moveRegist() {
        getCopyPage('rfq_write', {estimateRequestDetailList: commonFunc.repeatObject(estimateRequestDetailUnit, 10)})
    }


    return <>

        <Spin spinning={loading} tip={'견적의뢰 조회중...'}>
            <PanelSizeUtil groupRef={groupRef} storage={'rfq_read'}/>
            <>
                <div style={{
                    display: 'grid',
                    gridTemplateRows: `${mini ? 270 : 65}px calc(100vh - ${mini ? 400 : 195}px)`,
                   // rowGap : 10
                }}>
                    <MainCard title={'견적의뢰 조회'} list={[
                        {name: '조회', func: searchInfo, type: 'primary'},
                        {name: '초기화', func: clearAll, type: 'danger'},
                        {name: '신규작성', func: moveRegist, type: 'default'}
                    ]} mini={mini} setMini={setMini}>
                        {mini ? <div>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard>
                                {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info})}
                            </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                            <BoxCard>
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
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard>
                                {inputForm({
                                    title: 'Maker', id: 'searchMaker',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Model', id: 'searchModel',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Item', id: 'searchItem',
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
                        </div> : <></>}
                    </MainCard>

                    {/*@ts-ignored*/}
                    <TableGrid deleteComp={       <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={deleteList}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>

                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                    </Popconfirm>}
                               totalRow={totalRow}
                               getPropertyId={getPropertyId}
                               gridRef={gridRef}
                               columns={rfqReadColumns}
                               onGridReady={onGridReady}
                               type={'read'}
                               funcButtons={['agPrint']}/>
                </div>
            </>
        </Spin>
    </>
}