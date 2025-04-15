import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {CopyOutlined, DeleteOutlined, ExclamationCircleOutlined, FormOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {sourceWriteInitial,} from "@/utils/initialList";
import {commonManage, gridManage} from "@/utils/commonManage";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    textAreaForm,
    tooltipInfo
} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import _ from "lodash";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableSourceColumns, tableSourceUpdateColumns} from "@/utils/columnList";
import {Actions} from "flexlayout-react";
import Spin from "antd/lib/spin";

function SourceUpdate({updateKey, getCopyPage, getPropertyId, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('source_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const getSourceInit = () => _.cloneDeep(sourceWriteInitial);
    const [info, setInfo] = useState(getSourceInit);
    const [inventoryList, setInventoryList] = useState([]);
    const [isGrid, setIsGrid] = useState(false);


    /**
     * @description 재고 리스트 정리
     * 데이터 관리 > 재고관리
     * 재고관리 조회 리스트와 상세 리스트의 키값이 달라서 정리
     * 출고/합계 없음, 잔량 키값 다름 (API 수정시 바뀔 수 있음)
     * @param list
     */
    const processData = (list) => {
        let sum = 0;
        const newList = list.map(item => {
            sum += item.receivedQuantity || 0;
            return {...item, totalQuantity: sum, remainingQuantity: item.receivedQuantity, shippedQuantity: 0}
        });
        return newList.sort((a, b) => b.inventoryId - a.inventoryId);
    }

    const fetchData = async () => {
        setLoading(true);
        const v = await getData.post('inventory/getInventoryDetail', updateKey['source_update']);
        if (v?.data?.code === 1) {
            const {inventoryItemList = []} = v?.data?.entity;
            const processList = processData(inventoryItemList);
            setInfo(processList?.[0] || {});
            setInventoryList(processList);
            gridManage.resetData(gridRef, processList);
            setTotalRow(inventoryItemList.length);
        } else {
            message.error(v?.data?.message);
        }
        setLoading(false);
    }

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        setIsGrid(true);
    };

    useEffect(() => {
        if (!isGrid) return;
        fetchData();
    }, [updateKey['source_update'], isGrid])

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            await getData.post('inventory/getInventoryDetail', updateKey['source_update']).then(v => {
                if (v?.data?.code === 1) {
                    const {inventoryItemList = []} = v?.data?.entity;
                    const processList = processData(inventoryItemList);
                    setInventoryList(processList);
                    gridManage.resetData(gridRef, processList);
                    setTotalRow(inventoryItemList.length);
                } else {
                    message.error(v?.data?.message);
                }
            })
            setLoading(false);
        }
    }

    /**
     * @description 재고관리 유효성 체크
     * @param info
     */
    function checkValidate(info) {
        if (!info.maker) {
            message.warning('Maker를 입력해주세요.');
            return false;
        }
        if (!info.model) {
            message.warning('Model을 입력해주세요.');
            return false;
        }
        if (!info.receivedQuantity) {
            message.warning('입고수량을 입력해주세요.');
            return false;
        }
        return true;
    }

    /**
     * @description 수정 페이지 > 수정
     * 데이터 관리 > 재고관리
     */
    async function saveFunc() {
        if (!checkValidate(info)) return;

        setLoading(true);
        await getData.post('inventory/updateInventory', info).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '💾 재고 수정완료',
                    <>
                        <div>Maker : {info['maker']}</div>
                        <div>Model : {info['model']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v?.data?.message)
            }
        })
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 삭제
     * 데이터 관리 > 재고관리
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('inventory/deleteInventory', {inventoryId: info['inventoryId']}).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '🗑️ 재고 삭제완료',
                    <>
                        <div>Model : {info['model']}</div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                // 삭제한 데이터가 마지막 데이터인지 여부
                const isLastData = inventoryList.length === 1 && inventoryList[0].inventoryId === info.inventoryId;
                if(!isLastData) {
                    setInfo(getSourceInit());
                    searchInfo(true);
                } else {
                    const {model} = layoutRef.current.props;
                    window.postMessage('delete', window.location.origin);
                    getCopyPage('source_read', {})
                    const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                        .find((node: any) => node.getType() === "tab" && node.getComponent() === 'source_update');
                    if (targetNode) {
                        model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                    }
                }
            } else {
                message.error(v?.data?.message)
            }
        })
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 복제
     * 데이터 관리 > 재고관리
     */
    function copyPage() {
        getCopyPage('source_write', {...info, _meta: {updateKey: Date.now()}});
    }

    /**
     * @description 조회 테이블 > 삭제
     * 데이터 관리 > 재고관리 > 재고관리 수정
     */
    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 재고를 선택해주세요.')
        }
        setLoading(true);

        const list = gridRef.current.getSelectedRows()
        const filterList = list.map(v => v.inventoryId);
        console.log(filterList,'filterList:::')

        await getData.post('inventory/deleteInventories', {inventoryIdList: filterList}).then(v => {
            if (v?.data?.code === 1) {

                // 전체 삭제 여부 (삭제 id 리스트에 조회한 초기 리스트의 id가 전부 포함됬는지)
                const isAllDeleted = inventoryList.every(item => filterList.includes(item.inventoryId));
                if (!isAllDeleted) {
                    // 삭제된 리스트에 현재 수정중인 id가 있는지 확인 (삭제됬으면 폼 초기화)
                    if (filterList.includes(info.inventoryId)) setInfo(getSourceInit());
                    searchInfo(true);
                    notificationAlert('success', '🗑 재고 삭제완료',
                        <>
                            <div>Model
                                : {list[0].model} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 재고이(가)
                                삭제되었습니다.
                            </div>
                            <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                        </>
                        , null, null, 2
                    )
                } else {
                    const {model} = layoutRef.current.props;
                    window.postMessage('delete', window.location.origin);
                    getCopyPage('source_read', {})
                    const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                        .find((node: any) => node.getType() === "tab" && node.getComponent() === 'source_update');
                    if (targetNode) {
                        model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                    }
                }
            } else {
                message.error(v?.data?.message)
            }
        })
        setLoading(false);
    }

    return <Spin spinning={loading}>
        <div ref={infoRef}>
            <PanelSizeUtil groupRef={groupRef} storage={'source_update'}/>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '375px' : '65px'} calc(100vh - ${mini ? 505 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'재고관리 수정'} list={[
                    {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                    {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                    {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>
                    {mini ?
                        <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                    style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'기본 정보'}>
                                    {datePickerForm({
                                        title: '입고일자', id: 'receiptDate', onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '문서번호',
                                        id: 'documentNumber',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: 'Maker',
                                        id: 'maker',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: 'Model',
                                        id: 'model',
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'재고 정보'} tooltip={tooltipInfo('customer')}>
                                    {inputNumberForm({
                                        title: '수입단가',
                                        id: 'importUnitPrice',
                                        min: 0,
                                        step: 0.01,
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '화폐단위',
                                        id: 'currencyUnit',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputNumberForm({
                                        title: '입고수량',
                                        id: 'receivedQuantity',
                                        min: 0,
                                        step: 0.01,
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '단위',
                                        id: 'unit',
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
                                    {inputForm({
                                        title: '위치',
                                        id: 'location',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {textAreaForm({
                                        title: '비고',
                                        rows: 7,
                                        id: 'remarks',
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={0}></Panel>
                        </PanelGroup>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid
                    deleteComp={<Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={deleteList}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                    </Popconfirm>
                    }
                    totalRow={totalRow}
                    gridRef={gridRef}
                    columns={tableSourceUpdateColumns}
                    onGridReady={onGridReady}
                    getPropertyId={getPropertyId}
                    type={'sourceUpdate'}
                    setInfo={setInfo}
                    funcButtons={['agPrint']}
                />
            </div>
        </div>
    </Spin>
}

export default memo(SourceUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});