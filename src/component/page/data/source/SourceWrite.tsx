import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {sourceSearchInitial,} from "@/utils/initialList";
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
import {sourceInfo} from "@/utils/column/ProjectInfo";

function SourceWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const gridRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('source_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getSourceInit = () => _.cloneDeep(sourceInfo['defaultInfo']);
    const [info, setInfo] = useState(getSourceInit());
    const getSourceValidateInit = () => _.cloneDeep(sourceInfo['write']['validate']);
    const [validate, setValidate] = useState(getSourceValidateInit());

    const [totalRow, setTotalRow] = useState(0);

    useEffect(() => {
        setLoading(true);
        setValidate(getSourceValidateInit());
        setInfo(getSourceInit());
        if (isEmptyObj(copyPageInfo)) {
            setInfo({
                ...getSourceInit(),
                ..._.cloneDeep(copyPageInfo)
            });
        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);

    const onGridReady = async (params) => {
        setLoading(true);
        gridRef.current = params.api;
        getData.post('inventory/getInventoryList', sourceSearchInitial).then(v => {
            if (v?.data?.code === 1) {
                const {pageInfo = {}, inventoryList = []} = v?.data?.entity;
                params.api.applyTransaction({add: inventoryList});
                setTotalRow(pageInfo?.totalRow ?? 0)
            } else {
                message.warn(v?.data?.message);
            }
        })
        .finally(() => {
            setLoading(false);
        });
    };

    /**
     * @description 등록 페이지 > 하단의 재고 조회
     * 데이터 관리 > 재고관리
     * 재고관리 조회 페이지 조회랑 같은 API
     */
    const fetchData = async () => {
        setLoading(true);
        getData.post('inventory/getInventoryList', sourceSearchInitial).then(v => {
            if (v?.data?.code === 1) {
                const {pageInfo = {}, inventoryList = []} = v?.data?.entity;
                gridManage.resetData(gridRef, inventoryList);
                setTotalRow(pageInfo?.totalRow ?? 0);
            } else {
                message.warn(v?.data?.message);
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 등록 페이지 > 저장 버튼
     * 데이터관리 > 재고관리
     */
    async function saveFunc() {
        console.log(info, 'info:::');
        if (!commonManage.checkValidate(info, sourceInfo['write']['validationList'], setValidate)) return;

        setLoading(true);
        await getData.post('inventory/addInventory', info).then(v => {
            if (v.data.code === 1) {
                fetchData();
                window.postMessage({message: 'reload', target: 'source_read'}, window.location.origin);
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
                clearAll();
                getPropertyId('source_update', info)
            } else {
                console.warn(v?.data?.message);
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

    /**
     * @description 등록 페이지 > 초기화
     * 데이터관리 > 재고 관리
     */
    function clearAll() {
        setValidate(getSourceValidateInit());
        setInfo(getSourceInit());
        fetchData();
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'source_write'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '370px' : '65px'} calc(100vh - ${mini ? 505 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'재고관리 등록'}
                      list={[
                          {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                          {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ?
                    <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard title={'기본 정보'}>
                                {datePickerForm({title: '입고일자', id: 'receiptDate', onChange: onChange, data: info})}
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
                                    data: info,
                                    validate: validate['maker'],
                                    key: validate['maker']
                                })}
                                {inputForm({
                                    title: 'Model',
                                    id: 'model',
                                    onChange: onChange,
                                    data: info,
                                    validate: validate['model'],
                                    key: validate['model']
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
                                    data: info,
                                    validate: validate['receivedQuantity'],
                                    key: validate['receivedQuantity']
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
    </Spin>
}

export default memo(SourceWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});