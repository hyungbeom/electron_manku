import React, {memo, useEffect, useRef, useState} from "react";
import {deliverySearchInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import {
    CopyOutlined, DeleteOutlined,
    ExclamationCircleOutlined,
    RadiusSettingOutlined,
    SaveOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {deleteDelivery, getDeliveryList} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {deliveryReadColumn} from "@/utils/columnList";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";


function DeliveryRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const gridRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('delivery_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getDeliverySearchInit = () => _.cloneDeep(deliverySearchInitial)
    const [info, setInfo] = useState(getDeliverySearchInit());

    const [totalRow, setTotalRow] = useState(0);

    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        if (isSearch) {
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = (params) => {
        setLoading(true);
        gridRef.current = params.api;
        getDeliveryList({data: info}).then(v => {
            params.api.applyTransaction({add: v});
            setTotalRow(v?.pageInfo?.totalRow ?? v?.length ?? 0);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true);
        }
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 송금 > 국내송금 조회
     * @param e
     */
    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            await getDeliveryList({data: info}).then(v => {
                gridManage.resetData(gridRef, v);
                setTotalRow(v?.length ?? 0);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }

    /**
     * @description 조회 페이지 > 초기화 버튼
     * 배송 > 배송 조회
     */
    function clearAll() {
        setInfo(getDeliverySearchInit());
        gridRef.current.deselectAll();
        setIsSearch(true);
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 배송 > 배송 조회
     */
    async function moveRouter() {
        getCopyPage('delivery_write', {})
    }

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 배송 > 배송 조회
     */
    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 배송정보를 선택해주세요.');
        }

        setLoading(true);

        const deleteIdList = gridManage.getFieldValue(gridRef, 'deliveryId')
        await deleteDelivery({data: {deleteIdList: deleteIdList}}).then(v => {
            if (v?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑️ 배송 삭제완료',
                    <>
                        <div>선택한 배송정보가 삭제되었습니다.</div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                console.warn(v?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>

                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
            }
        })
        .catch((err) => {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return <Spin spinning={loading} tip={'배송 조회중...'}>
        <ReceiveComponent componentName={'delivery_read'} searchInfo={searchInfo}/>
        <PanelSizeUtil groupRef={groupRef} storage={'delivery_read'}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '310px' : '65px'} calc(100vh - ${mini ? 440 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'배송 조회'} list={[
                    {name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>, func: searchInfo, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    },
                    {
                        name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>,
                        func: moveRouter,
                        type: ''
                    }
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'기본 정보'}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 25px 25px 25px',
                                        gap: 3
                                    }}>
                                        {rangePickerForm({title: '출고일자', id: 'searchDate', onChange: onChange, data: info})}
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            searchStartDate: moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            searchEndDate: moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>T</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchDate: [moment().format('YYYY-MM-DD'), moment().add(1, 'week').format('YYYY-MM-DD')],
                                                            searchStartDate: moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            searchEndDate: moment().add(1, 'week').format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>W</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchDate: [moment().format('YYYY-MM-DD'), moment().add(1, 'month').format('YYYY-MM-DD')],
                                                            searchStartDate: moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            searchEndDate: moment().add(1, 'month').format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>M</Button>
                                    </div>
                                    {inputForm({
                                        title: '문서번호',
                                        id: 'searchConnectInquiryNo',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: 'Project No.',
                                        id: 'searchRfqNo',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'받는분 정보'}>
                                    {inputForm({
                                        title: '고객사명',
                                        id: 'searchCustomerName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '받는분 성명',
                                        id: 'searchRecipientName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '받는분 연락처',
                                        id: 'searchRecipientPhone',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'운송정보'} tooltip={''}>
                                    <div style={{paddingBottom: 9}}>
                                        {inputForm({
                                            title: '운송장번호',
                                            id: 'searchTrackingNumber',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {selectBoxForm({
                                            title: '확인여부', id: 'searchIsConfirm', list: [
                                                {value: '', label: '전체'},
                                                {value: 'O', label: 'O'},
                                                {value: 'X', label: 'X'},
                                            ],
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </div>
                                    <div style={{paddingBottom: 0}}>
                                        {selectBoxForm({
                                            title: '출고완료여부', id: 'searchIsOutBound', list: [
                                                {value: '', label: '전체'},
                                                {value: 'O', label: 'O'},
                                                {value: 'X', label: 'X'},
                                            ],
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </div>
                                </BoxCard>
                            </Panel>
                        </PanelGroup>
                            </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid
                    deleteComp={
                        <Popconfirm
                            title="삭제하시겠습니까?"
                            onConfirm={confirm}
                            icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                            <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                                <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                            </Button>
                        </Popconfirm>
                    }
                    totalRow={totalRow}
                    getPropertyId={getPropertyId}
                    gridRef={gridRef}
                    columns={deliveryReadColumn}
                    onGridReady={onGridReady}
                    // funcButtons={['agPrint']}
                />
            </div>
        </>
    </Spin>
}

export default memo(DeliveryRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});