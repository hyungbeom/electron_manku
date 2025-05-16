import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {CopyOutlined, DeleteOutlined, ExclamationCircleOutlined, FormOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
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

    const [inventoryList, setInventoryList] = useState([]);
    const [totalRow, setTotalRow] = useState(0);

    const [isGrid, setIsGrid] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const v = await getData.post('inventory/getInventoryDetail', updateKey['source_update']);
        if (v?.data?.code === 1) {
            const inventoryItemList = v?.data?.entity ?? [];
            // gridManage.resetData(gridRef, inventoryItemList ?? []);
            // setTotalRow(inventoryItemList?.length ?? 0);
            // setInfo(inventoryItemList?.[0] || {});
            // setInventoryList(inventoryItemList);

            let sum = 0;
            const sourceHistoryList = [...inventoryItemList]
                .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
                .map(item => {
                    const isOutBound = String(item?.documentNumber || '').toUpperCase().startsWith('STO');
                    const quantity = Number(String(isOutBound ? item.outBound : item.totalReceivedQuantity).replace(/,/g, '')) || 0;
                    const formula = isOutBound ? -quantity : quantity;
                    sum += formula;
                    return {...item, stock: sum}
                }).sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

            if (sourceHistoryList?.length) {
                gridManage.resetData(gridRef, sourceHistoryList);
                setTotalRow(sourceHistoryList?.length ?? 0);
            }
        } else {
            message.warn(v?.data?.message);
        }
        setLoading(false);
    }

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        setIsGrid(true);
    };

    useEffect(() => {
        if (!isGrid) return;
        setValidate(getSourceValidateInit());
        setInfo(getSourceInit());
        setTotalRow(0);
        setInventoryList([]);
        fetchData();
    }, [updateKey['source_update'], isGrid])

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            await getData.post('inventory/getInventoryDetail', updateKey['source_update']).then(v => {
                if (v?.data?.code === 1) {
                    const inventoryItemList = v?.data?.entity ?? [];
                    gridManage.resetData(gridRef, inventoryItemList ?? []);
                    setTotalRow(inventoryItemList?.length ?? 0);
                    setInventoryList(inventoryItemList);

                } else {
                    message.warn(v?.data?.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 데이터 관리 > 재고관리
     */
    async function saveFunc() {
        console.log(info, 'info:::');
        if (!commonManage.checkValidate(info, sourceInfo['write']['validationList'], setValidate)) return;

        setLoading(true);
        await getData.post('inventory/updateInventory', info).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
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
     * 데이터 관리 > 재고관리
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('inventory/deleteInventory', {inventoryId: info['inventoryId']}).then(v => {
            if (v?.data?.code === 1) {
                // 삭제한 데이터가 마지막 데이터인지 여부
                const isLastData = inventoryList.length === 1 && inventoryList[0].inventoryId === info.inventoryId;
                if(!isLastData) {
                    setInfo(getSourceInit());
                    searchInfo(true);
                    notificationAlert('success', '🗑️ 재고 삭제완료',
                        <>
                            <div>Maker : {info['maker']}</div>
                            <div>Model : {info['model']}</div>
                            <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                        </>
                        , null, null, 2
                    )
                } else {
                    window.postMessage({message: 'reload', target: 'source_read'}, window.location.origin);
                    getCopyPage('source_read', {})
                    const {model} = layoutRef.current.props;
                    const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                        .find((node: any) => node.getType() === "tab" && node.getComponent() === 'source_update');
                    if (targetNode) {
                        model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                    }
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
     * @description 수정 페이지 > 견적서 등록
     * 데이터 관리 > 재고관리
     */
    function copyPage() {
        const copyInfo = {
            info: {
                agencyCode: "STO",            // 대리점코드
                maker: info?.['maker'],      // Maker
                item: info?.['item'],      // Item
            },
        }
        const totalList = [
            {
                estimateDetailId: '',
                model: info?.['model'],
                quantity: info?.['totalReceivedQuantity'],
                unit: info?.['unit'],
                currencyUnit: info?.['currencyUnit'],
                unitPrice: info?.['unitPrice'],
                net: '',
                marginRate: '',
            }
        ]
        copyInfo['estimateDetailList'] = [...totalList, ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000 - totalList.length)];

        getCopyPage('estimate_write', {...copyInfo, _meta: {updateKey: Date.now()}});
    }

    /**
     * @description 조회 테이블 > 삭제
     * 데이터 관리 > 재고관리 > 재고관리 수정
     */
    async function deleteList() {
        const list = gridRef.current.getSelectedRows()
        if (!list?.length) return message.warn('삭제할 재고를 선택해주세요.');

        setLoading(true);
        const filterList = list.map(v=> v.inventoryDetailId)
        await getData.post('inventory/deleteDetailInventories', filterList).then(v => {
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
                                : {list[0].model} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 의 재고이(가)
                                삭제되었습니다.
                            </div>
                            <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                        </>
                        , null, null, 2
                    )
                } else {
                    window.postMessage({message: 'reload', target: 'source_read'}, window.location.origin);
                    getCopyPage('source_read', {})
                    const {model} = layoutRef.current.props;
                    const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                        .find((node: any) => node.getType() === "tab" && node.getComponent() === 'source_update');
                    if (targetNode) {
                        model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                    }
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
     * 조회 테이블에서 재고 History 항목 더블 클릭시 수정 가능하게 set
     * @param inventoryDetail
     */
    function tableDoubleClickSetInfo (inventoryDetail) {
        console.log('~~~~')
        const clickInfo = {
            ...inventoryDetail,
            totalNet: Number(inventoryDetail?.['totalReceivedQuantity'])
        }
        console.log(clickInfo)
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
                          {name: <div><CopyOutlined style={{paddingRight: 8}}/>견적서 등록</div>, func: copyPage, type: 'default'},
                          {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                          {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
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
                                    disabled: true,
                                    data: info,
                                    validate: validate['maker'],
                                    key: validate['maker']
                                })}
                                {inputForm({
                                    title: 'Model',
                                    id: 'model',
                                    disabled: true,
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
                                    title: '매입 총액',
                                    id: 'totalNet',
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
                                    id: 'totalReceivedQuantity',
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
                deleteComp={
                    <Popconfirm
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