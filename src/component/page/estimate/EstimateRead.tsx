import React, {memo, useRef, useState} from "react";
import {tableEstimateReadColumns} from "@/utils/columnList";
import {estimateDetailUnit, estimateReadInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    FileDoneOutlined,
    RadiusSettingOutlined,
    SaveOutlined,
    SearchOutlined
} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteEstimate, searchEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import Spin from "antd/lib/spin";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import Modal from "antd/lib/modal/Modal";
import NewEstimatePaper from "@/component/견적서/NewEstimatePaper";
import ReceiveComponent from "@/component/ReceiveComponent";


function EstimateRead({getPropertyId, getCopyPage,}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(estimateReadInitial)
    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);
    const [openEstimateModal, setOpenEstimateModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRow, setTotalRow] = useState(0);

    const userInfo = useAppSelector((state) => state.user.userInfo);

    const onGridReady = async (params) => {
        setLoading(true)
        gridRef.current = params.api;
        await searchEstimate({data: estimateReadInitial}).then(v => {

            params.api.applyTransaction({add: v?.data});
            setTotalRow(v.pageInfo.totalRow)
            setLoading(false)
        })
    };

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('estimate_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 5]; // 기본값 [50, 50, 50]
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
        copyData['searchDocumentNumber'] = copyData?.searchDocumentNumber.replace(/\s/g, "").toUpperCase();
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
        getCopyPage('estimate_write', {estimateDetailList: commonFunc.repeatObject(estimateDetailUnit, 1000)})

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
        await deleteEstimate({data: {deleteList: deleteList}}).then(v => {
            if (v.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑️프로젝트 삭제완료',
                    <>
                        <div>Inquiry No.
                            - {selectedRows[0]?.documentNumberFull} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다
                        </div>
                        {/*<div>프로젝트 제목 - {selectedRows[0].projectTitle} `${selectedRows.length > 1 ? ('외' + (selectedRows.length - 1)) + '개' : ''}`가 삭제되었습니다. </div>*/}
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
            } else {
                message.error(v.message)
            }
        })
    }


    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }


    function openEstimate(){
        setOpenEstimateModal(true)
    }

    return <Spin spinning={loading} tip={'견적서 조회중...'}>
        <ReceiveComponent componentName={'estimate_read'} searchInfo={searchInfo}/>
        <PanelSizeUtil groupRef={groupRef} storage={'estimate_read'}/>
        {openEstimateModal ? <Modal
            onCancel={() => setOpenEstimateModal(false)}
            open={openEstimateModal}
            width={1050}
            footer={null}
            onOk={() => setOpenEstimateModal(false)}>
            <div><NewEstimatePaper gridRef={gridRef} openEstimateModal={openEstimateModal}/></div>
        </Modal> : <></>}
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '270px' : '65px'} calc(100vh - ${mini ? 400 : 195}px)`,
                // columnGap: 5
            }}>
                <MainCard title={'견적서 조회'}
                          list={[
                              {
                                  name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>,
                                  func: searchInfo,
                                  type: 'primary'
                              },
                              {
                                  name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                                  func: clearAll,
                                  type: 'danger'
                              },
                              {
                                  name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>,
                                  func: moveRouter,
                                  type: ''
                              },
                          ]}
                          mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={''}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 25px 25px 25px',
                                            gap: 3
                                        }}>
                                            {rangePickerForm({
                                                title: '작성일자',
                                                id: 'searchDate',
                                                onChange: onChange,
                                                data: info
                                            })}
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>T</Button>
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().subtract(1, 'week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().subtract(1, 'week').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>W</Button>
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>M</Button>
                                        </div>
                                        <div style={{paddingBottom: 9}}>
                                            {selectBoxForm({
                                                title: '주문 여부', id: 'searchType', onChange: onChange, data: info, list: [
                                                    {value: 0, label: '전체'},
                                                    {value: 1, label: '주문'},
                                                    {value: 2, label: '미주문'}
                                                ]
                                            })}
                                        </div>
                                        {inputForm({
                                            title: '등록직원명', id: 'searchCreatedBy',
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
                                            title: '문서번호', id: 'searchDocumentNumber',
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
                                        {inputForm({
                                            title: '고객사담당자', id: 'searchManagerName',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info,
                                            placeHolder: '백엔드 연동 해야함'
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
                                            title: 'Item', id: 'searchItem',
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
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={0}>
                                </Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={
                    <>
                        <Button type={'primary'} size={'small'} style={{fontSize : 11}} onClick={openEstimate}>
                            <div><FileDoneOutlined style={{paddingRight: 8}}/>통합견적서 출력</div>
                        </Button>
                        <Popconfirm
                            title="삭제하시겠습니까?"
                            onConfirm={deleteList}
                            icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>

                            <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                                <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                            </Button>
                        </Popconfirm>
                    </>
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

export default memo(EstimateRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});