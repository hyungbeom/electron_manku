import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
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
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import _ from "lodash";
import Spin from "antd/lib/spin";
import TableGrid from "@/component/tableGrid";
import {tableSourceColumns} from "@/utils/columnList";

function SourceWrite({copyPageInfo, getPropertyId}: any) {
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
    const [info, setInfo] = useState(getSourceInit());
    const [isGrid, setIsGrid] = useState(false);

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            setInfo(getSourceInit())
        } else {
            setInfo(_.cloneDeep(copyPageInfo));
        }
    }, [copyPageInfo?._meta?.updateKey]);

    const fetchData = async () => {
        setLoading(true);
        const v = await getData.post('inventory/getInventoryList', {page: 1, limit: -1});
        if (v?.data?.code === 1) {
            const {pageInfo = {} ,inventoryList = []} = v?.data?.entity;
            gridManage.resetData(gridRef, inventoryList);
            setTotalRow(pageInfo?.totalRow);
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
    }, [isGrid]);

    function onChange(e) {
        commonManage.onChange(e, setInfo)
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
     * @description 등록 페이지 > 저장
     * 데이터관리 > 재고관리
     */
    async function saveFunc() {
        if (!checkValidate(info)) return;

        setLoading(true)
        await getData.post('inventory/addInventory', info).then(v => {
            if (v.data.code === 1) {
                fetchData();
                notificationAlert('success', '💾 재고 등록완료',
                    <>
                        <div>Maker : {info['maker']}</div>
                        <div>Model : {info['model']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('source_update', info)
                    },
                    {cursor: 'pointer'}
                )
            } else {
                message.error(v?.data?.message)
            }
            setLoading(false)
        });
    }

    /**
     * @description 등록 페이지 > 초기화
     * 데이터관리 > 재고 관리
     */
    function clearAll() {
        setInfo(getSourceInit());
    }

    return <Spin spinning={loading}>
        <div ref={infoRef}>
            <PanelSizeUtil groupRef={groupRef} storage={'source_write'}/>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '375px' : '65px'} calc(100vh - ${mini ? 505 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'재고관리 등록'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    },
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
                    totalRow={totalRow}
                    gridRef={gridRef}
                    columns={tableSourceColumns}
                    onGridReady={onGridReady}
                    getPropertyId={getPropertyId}
                    type={'sourceWrite'}
                    // setInfo={setInfo}
                    funcButtons={['agPrint']}
                />
            </div>
        </div>
    </Spin>
}

export default memo(SourceWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});