import React, {useEffect, useRef, useState} from "react";
import {tableEstimateReadColumns} from "@/utils/columnList";
import {estimateDetailUnit, estimateReadInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import {CopyOutlined, ExclamationCircleOutlined, FileExcelOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteEstimate, searchEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import Spin from "antd/lib/spin";
import {useRouter} from "next/router";
import PrintIntegratedEstimate from "@/component/printIntegratedEstimate";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";


export default function EstimateRead({getPropertyId, getCopyPage, notificationAlert = null}:any) {
    const groupRef = useRef<any>(null)
    const router = useRouter();
    const countRef = useRef(1);
    const infoRef = useRef(null);
    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(estimateReadInitial)
    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRow, setTotalRow] = useState(0);

    const userInfo = useAppSelector((state) => state.user);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchEstimate({data: estimateReadInitial}).then(v => {

            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
        })
    };

    useEffect(() => {
        // infoRef.current = info
    }, [info]);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('estimate_read');
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
            setLoading(true)
            await searchEstimate({data: copyData}).then(v => {
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
        setLoading(false)

    }

    async function moveRouter() {
        getCopyPage('estimate_write', {estimateDetailList: commonFunc.repeatObject(estimateDetailUnit, 10)})

    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            estimateId: 'estimateId',
            estimateDetailId: 'estimateDetailId'
        });
        setLoading(true);
        const selectedRows = gridRef.current.getSelectedRows();
        await deleteEstimate({data: {deleteList: deleteList}}).then(v=>{
            if(v.code === 1){
                searchInfo(true);
                notificationAlert('error', '프로젝트 삭제완료',
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

    async function printEstimate() {

        const checkedData = gridRef.current.getSelectedRows();

        setSelectedRow(checkedData)
        // console.log(selectedRow, 'setSelectedRow')
        setIsModalOpen(true)
    }

    return <Spin spinning={loading} tip={'견적서 조회중...'}>
        <PanelSizeUtil groupRef={groupRef} storage={'estimate_read'}/>
        {selectedRow.length > 0 &&
            <PrintIntegratedEstimate data={selectedRow} isModalOpen={isModalOpen} userInfo={userInfo}
                                     setIsModalOpen={setIsModalOpen}/>
        }
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '270px' : '65px'} calc(100vh - ${mini ? 400 : 195}px)`,
                // columnGap: 5
            }}>
                <MainCard title={'견적서 조회'}
                          list={[
                              {name: '조회', func: searchInfo, type: 'primary'},
                              {name: '초기화', func: clearAll, type: 'danger'},
                              {name: '신규생성', func: moveRouter}
                          ]}
                          mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
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
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
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

                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={''}>

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
                           columns={tableEstimateReadColumns}
                           funcButtons={['agPrint']}/>


            </div>
        </>
    </Spin>
}

