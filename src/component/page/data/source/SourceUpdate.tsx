import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {CopyOutlined, DeleteOutlined, ExclamationCircleOutlined, FormOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {sourceWriteInitial,} from "@/utils/initialList";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import _ from "lodash";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableSourceColumns} from "@/utils/columnList";

function SourceUpdate({updateKey, getCopyPage, getPropertyId}: any) {
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

    const processData = (list) => {
        let sum = 0;
        return list
            .map(item => {
            sum += item.receivedQuantity || 0;
            return {...item, totalQuantity: sum, remainingQuantity: item.receivedQuantity, shippedQuantity: 0}
        });
    }

    const onGridReady = async (params) => {
        gridRef.current = params.api;

        await getData.post('inventory/getInventoryDetail', updateKey['source_update']).then(v => {
            if (v?.data?.code === 1) {
                const {inventoryItemList = []} = v?.data?.entity;
                const processList = processData(inventoryItemList);
                setInfo(processList?.[0] || {});
                params.api.applyTransaction({add: processData(processList)});
                setTotalRow(inventoryItemList.length);
            }
        })
    };


    async function searchInfo(e) {
        if (e) {
            setLoading(true)
            await getData.post('inventory/getInventoryDetail', updateKey['source_update']).then(v => {
                if (v?.data?.code === 1) {
                    const {inventoryItemList = []} = v?.data?.entity;
                    setInfo(inventoryItemList?.[0] || {});
                    gridManage.resetData(gridRef, inventoryItemList);
                    setTotalRow(inventoryItemList.length);
                }
                setLoading(false)
            })
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        setLoading(true);
        await getData.post('inventory/updateInventory', info).then(v => {
            if (v?.data?.code === 1) {
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
            setLoading(false)
        });
    }

    /**
     * @description 수정 페이지 > 복제
     * 데이터 관리 > 재고관리
     */
    function copyPage() {
        getCopyPage('source_write', {...info, _meta: {updateKey: Date.now()}});
    }

    function deleteList() {

    }

    return <div ref={infoRef}>
        <PanelSizeUtil groupRef={groupRef} storage={'source_update'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '375px' : '65px'} calc(100vh - ${mini ? 505 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'재고관리 수정'} list={[
                {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: saveFunc, type: 'delete'},
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
                                {inputForm({
                                    title: '수입단가',
                                    id: 'importUnitPrice',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '화폐단위',
                                    id: 'currencyUnit',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '입고수량',
                                    id: 'receivedQuantity',
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
                columns={tableSourceColumns}
                onGridReady={onGridReady}
                getPropertyId={getPropertyId}
                funcButtons={['agPrint']}
            />
        </div>
    </div>
}

export default memo(SourceUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});