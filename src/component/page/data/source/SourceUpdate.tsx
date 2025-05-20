import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {CopyOutlined, DeleteOutlined, ExclamationCircleOutlined, FormOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, datePickerForm, inputForm, MainCard, SelectForm, textAreaForm, tooltipInfo} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import _ from "lodash";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableSourceUpdateColumns} from "@/utils/columnList";
import {Actions} from "flexlayout-react";
import Spin from "antd/lib/spin";
import {estimateInfo, sourceInfo} from "@/utils/column/ProjectInfo";

function SourceUpdate({updateKey, getCopyPage, getPropertyId, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const gridRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('source_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getSourceInit = () => _.cloneDeep(sourceInfo['defaultInfo']);
    const [info, setInfo] = useState(getSourceInit());
    const getSourceValidateInit = () => _.cloneDeep(sourceInfo['write']['validate']);
    const [validate, setValidate] = useState(getSourceValidateInit());

    const [tableData, setTableData] = useState([]);
    const [totalRow, setTotalRow] = useState(0);

    const [isGridLoad, setIsGridLoad] = useState(false);

    useEffect(() => {
        if (!isGridLoad) return;

        setValidate(getSourceValidateInit());
        setInfo(getSourceInit());

        setTableData([]);
        setTotalRow(0);

        void getDataInfo();
    }, [updateKey['source_update'], isGridLoad])

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: []});
        setTotalRow(0);
        setIsGridLoad(true);
    };

    async function getDataInfo(type?: any) {
        setLoading(true);
        try {
            const res= await getData.post('inventory/getInventoryDetail', { inventoryId: updateKey['source_update'] })
            if (res?.data?.code !== 1) return;

            const inventoryItemList = res?.data?.entity ?? [];
            // History 리스트에서 잔량 계산
            let sum = 0;
            const sourceHistoryList = [...inventoryItemList]
                .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
                .map(item => {
                    const isOutBound = String(item?.documentNumber || '').toUpperCase().startsWith('STO');
                    const quantity = Number(String(isOutBound ? item.outBound : item.receivedQuantity).replace(/,/g, '')) || 0;
                    const formula = isOutBound ? -quantity : quantity;
                    sum += formula;
                    return {...item, stock: sum}
                }).sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

            const total = (Number(String(sourceHistoryList?.[0]?.receivedQuantity).replace(/,/g, '')) || 0) * (Number(String(sourceHistoryList?.[0]?.importUnitPrice ).replace(/,/g, '')) || 0);
            setInfo(
                type !== 'reset'
                ? {...sourceHistoryList[0], total: total? total.toLocaleString() : ''}
                : getSourceInit()
            );
            setTableData(sourceHistoryList);
            setTotalRow(sourceHistoryList.length);
            gridManage.resetData(gridRef, sourceHistoryList);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 수정 페이지 > 견적서 등록
     * 데이터 관리 > 재고관리 > 재고관리 수정
     * 재고 정보 가지고 견적서 STO 생성하러 이동
     */
    function copyPageForEstimate() {
        if (!info?.['inventoryId'] || !info?.['inventoryDetailId']) {
            return message.warn('견적서로 등록할 재고 내역을 선택해주세요.');
        }
        const copyInfo = {
            info: {
                agencyCode: "STO",
                maker: info?.['maker'],
                item: info?.['item'],
            },
        }
        const unitPrice = info?.['currencyUnit'] === 'KRW' ? String(info?.['importUnitPrice'])?.split?.('.')?.[0] ?? '' : info?.['importUnitPrice'];
        const totalList = [
            {
                estimateDetailId: '',
                model: info?.['model'],
                quantity: info?.['receivedQuantity'],
                unit: info?.['unit'],
                currencyUnit: info?.['currencyUnit'],
                unitPrice: unitPrice,
                net: '',
                marginRate: '',
            }
        ]
        copyInfo['estimateDetailList'] = [...totalList, ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000 - totalList.length)];

        getCopyPage('estimate_write', {...copyInfo, _meta: {updateKey: Date.now()}});
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 데이터 관리 > 재고관리 > 재고관리 수정
     */
    async function saveFunc() {
        if (!info?.['inventoryId'] || !info?.['inventoryDetailId']) {
            return message.warn('수정할 재고 내역을 선택해주세요.');
        }
        if (!commonManage.checkValidate(info, sourceInfo['write']['validationList'], setValidate)) return;

        const copyInfo = {
            ...info,
            importUnitPrice: Number(String(info?.importUnitPrice).replace(/,/g, '')),
            total: Number(String(info?.total).replace(/,/g, '')),
            receivedQuantity: Number(String(info?.receivedQuantity).replace(/,/g, ''))
        }
        setLoading(true);
        await getData.post('inventory/addInventory', copyInfo).then(v => {
            if (v?.data?.code === 1) {
                getDataInfo('reset');
                window.postMessage({message: 'reload', target: 'source_read'}, window.location.origin);
                notificationAlert('success', '💾 재고 수정완료',
                    <>
                        <div>Maker : {info['maker']}</div>
                        <div>Model : {info['model']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
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
     * @description 수정 페이지 > 삭제 버튼
     * 데이터 관리 > 재고관리 > 재고관리 수정
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('inventory/deleteInventory', [ info['inventoryId'] ]).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'source_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 재고 삭제완료',
                    <>
                        <div>Maker : {info['maker']}</div>
                        <div>Model : {info['model']}</div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'source_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
                getCopyPage('source_read', {})
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
     * @description 수정 페이지 > 복제 버튼
     * 데이터 관리 > 재고관리 > 재고관리 수정
     */
    function copyPage() {
        const copyInfo = {
            info: _.cloneDeep(info)
        }
        getCopyPage('source_write', {...copyInfo, _meta: {updateKey: Date.now()}});
    }

    /**
     * @description 조회 테이블 > 삭제
     * 데이터 관리 > 재고관리 > 재고관리 수정
     */
    async function deleteList() {
        const list = gridRef.current.getSelectedRows()
        if (!list?.length) return message.warn('삭제할 재고 내역을 선택해주세요.');

        setLoading(true);
        const filterList = list
            .filter(v => !String(v.documentNumber || '').toUpperCase().startsWith('STO'))
            .map(v => v.inventoryDetailId);
        await getData.post('inventory/deleteDetailInventories', filterList).then(v => {
            if (v?.data?.code === 1) {
                // 전체 삭제 여부 (조회한 초기 리스트에 삭제 id 리스트가 전부 포함됬는지)
                const isAllDeleted = tableData
                    .filter(v => !String(v.documentNumber || '').toUpperCase().startsWith('STO'))
                    .every(item => filterList.includes(item.inventoryDetailId));
                if (!isAllDeleted) {
                    getDataInfo('reset');
                    notificationAlert('success', '🗑 재고 내역 삭제완료',
                        <>
                            <div>Maker : {info['maker']}</div>
                            <div>Model : {info['model']}</div>
                            <div>의 재고 내역이(가) 삭제되었습니다.</div>
                            <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                        </>
                        , null, null, 2
                    )
                } else { // History 전체 삭제면 탭 닫기
                    window.postMessage({message: 'reload', target: 'source_read'}, window.location.origin);
                    const {model} = layoutRef.current.props;
                    const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                        .find((node: any) => node.getType() === "tab" && node.getComponent() === 'source_update');
                    if (targetNode) {
                        model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                    }
                    getCopyPage('source_read', {})
                }
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
     * @description 조회 테이블 > 더블 클릭
     * 데이터 관리 > 재고관리 > 재고관리 수정
     * 테이블에서 재고 History 항목 더블 클릭시 수정 가능하게 set
     * @param inventoryDetail
     */
    function tableDoubleClickSetInfo (inventoryDetail?: any) {
        const total = (Number(String(inventoryDetail?.receivedQuantity).replace(/,/g, '')) || 0) * (Number(String(inventoryDetail?.importUnitPrice ).replace(/,/g, '')) || 0);
        const clickInfo = {
            ...inventoryDetail,
            total: total ? total.toLocaleString() : ''
        }
        setInfo(clickInfo);
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'source_update'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '370px' : '65px'} calc(100vh - ${mini ? 505 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'재고관리 수정'}
                      list={[
                          {name: <div><CopyOutlined style={{paddingRight: 8}}/>견적서 등록</div>, func: copyPageForEstimate, type: 'default'},
                          {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                          {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                          {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ?
                    <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard title={'기본 정보'}>
                                {datePickerForm({title: '입고일자', id: 'receiptDate', onChange: onChange, data: info, disabled: true})}
                                {inputForm({
                                    title: '문서번호',
                                    id: 'documentNumber',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Maker',
                                    id: 'maker',
                                    disabled: true,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Model',
                                    id: 'model',
                                    disabled: true,
                                    data: info
                                })}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[1]} minSize={5}>
                            <BoxCard title={'재고 정보'} tooltip={tooltipInfo('customer')}>
                                {inputForm({
                                    title: '매입 총액',
                                    id: 'total',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true
                                })}
                                {/*{inputForm({*/}
                                {/*    title: '화폐단위',*/}
                                {/*    id: 'currencyUnit',*/}
                                {/*    onChange: onChange,*/}
                                {/*    data: info*/}
                                {/*})}*/}
                                <div style={{paddingBottom: 10}}>
                                    <SelectForm id={'currencyUnit'}
                                                list={
                                                    ['KRW', 'USD', 'EUR', 'JPY', 'GBP']
                                                }
                                                title={'화폐단위'}
                                                onChange={onChange}
                                                data={info}
                                    />
                                </div>
                                <div style={{fontSize: 12, paddingBottom: 10}} key={validate['receivedQuantity']}>
                                    <div style={{paddingBottom: 12 / 2, fontWeight: 700}}>입고수량</div>
                                    <div style={{display: 'flex'}}>
                                        <input placeholder={''}
                                               id={'receivedQuantity'}
                                               value={info ? info['receivedQuantity'] : null}
                                               onKeyDown={(e) => { if(e.key === 'Enter') e.currentTarget.blur(); }}
                                               onChange={onChange}
                                               onFocus={(e) => { setInfo(prev => {
                                                   const receivedQuantity = Number((e.target.value || '0').toString().replace(/,/g, ''));
                                                   return {...prev, receivedQuantity: receivedQuantity ? receivedQuantity : ''}
                                               })}}
                                               onBlur={(e) => { setInfo(prev => {
                                                   const receivedQuantity = Number((e.target.value || '0').toString().replace(/,/g, ''));
                                                   return {...prev, receivedQuantity: receivedQuantity ? receivedQuantity.toLocaleString() : ''}
                                               })}}
                                               style={{fontSize: 12, border: `1px solid ${validate['receivedQuantity'] ? 'lightGray' : 'red'}`}}
                                        />
                                        <span style={{marginLeft: -22, paddingTop: 1.5}}></span>
                                    </div>
                                </div>
                                {inputForm({
                                    title: '단위',
                                    id: 'unit',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true
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
                deleteComp={
                    <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={deleteList}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                            <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                        </Button>
                    </Popconfirm>
                }
                totalRow={totalRow}
                gridRef={gridRef}
                columns={tableSourceUpdateColumns}
                onGridReady={onGridReady}
                getPropertyId={getPropertyId}
                customType={'SourceUpdate'}
                tempFunc={tableDoubleClickSetInfo}
                funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

export default memo(SourceUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});