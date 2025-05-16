import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
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
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import _ from "lodash";
import Spin from "antd/lib/spin";
import TableGrid from "@/component/tableGrid";
import {tableSourceUpdateColumns} from "@/utils/columnList";
import {sourceInfo} from "@/utils/column/ProjectInfo";
import {ModalInitList} from "@/utils/initialList";
import SearchInfoModal from "@/component/SearchAgencyModal";
import message from "antd/lib/message";
import {loadWebpackHook} from "next/dist/server/config-utils";

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
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [mini, setMini] = useState(true);

    const getSourceInit = () => _.cloneDeep(sourceInfo['defaultInfo']);
    const [info, setInfo] = useState(getSourceInit());
    const getSourceValidateInit = () => _.cloneDeep(sourceInfo['write']['validate']);
    const [validate, setValidate] = useState(getSourceValidateInit());

    const [tableData, setTableData] = useState([]);
    const [totalRow, setTotalRow] = useState(0);

    useEffect(() => {
        setLoading(true);

        setValidate(getSourceValidateInit());
        setInfo(getSourceInit());

        setTableData([]);

        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            // setTableData(commonFunc.repeatObject(sourceInfo['write']['defaultData'], 1000));
        } else {
            setInfo({
                ...getSourceInit(),
                ..._.cloneDeep(copyPageInfo)
            });
            // setTableData(copyPageInfo);
        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        // gridManage.resetData(gridRef, []);
        params.api.applyTransaction({add: []});
        setTotalRow(0);
        // setIsGrid(true);
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 등록 페이지 > 저장 버튼
     * 데이터관리 > 재고관리 > 재고관리 등록
     */
    async function saveFunc() {
        console.log(info, 'info:::');
        if (!commonManage.checkValidate(info, sourceInfo['write']['validationList'], setValidate)) return;

        console.log(tableData)
        if (tableData?.length > 0) {
            if (info.unit !== tableData?.[0].unit) {
                return message.warn('기존 재고와 단위가 일치하지 않습니다.');
            }
        }
        const copyInfo = {
            ...info,
            importUnitPrice: Number(info?.importUnitPrice),
            receivedQuantity: Number(info?.receivedQuantity)
        }
        setLoading(true);
        await getData.post('inventory/addInventory', copyInfo).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'source_read'}, window.location.origin);
                notificationAlert('success', '💾 재고 등록완료',
                    <>
                        <div>Maker : {info['maker']}</div>
                        <div>Model : {info['model']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                // clearAll();
                // getPropertyId('source_update', v?.data?.entity?.inventoryId);
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
     * 데이터관리 > 재고 관리 > 재고관리 등록
     */
    function clearAll() {
        setLoading(true);

        setValidate(getSourceValidateInit());
        setInfo(getSourceInit());

        gridManage.resetData(gridRef, []);
        setTableData([]);
        setTotalRow(0);

        setLoading(false);
    }

    /**
     * @description 등록 페이지 > Inquiry No. 검색 버튼 > 발주서 조회 Modal
     * 데이터 관리 > 재고관리 > 재고관리 등록
     * 발주서 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    /**
     * @description 등록 페이지 > 발주서 조회 Modal
     * 데이터 관리 > 재고관리 > 재고관리 등록
     * Return Function
     * 발주서 조회 Modal 에서 선택한 항목 가져오기)
     * @param list
     */
    function modalSelected(orderDetailList) {
        // 매입 총액 계산
        const total = (Number(String(orderDetailList[0]?.quantity).replace(/,/g, '')) || 0) * (Number(String(orderDetailList[0]?.unitPrice ).replace(/,/g, '')) || 0);
        const orderInfo = {
            documentNumber: orderDetailList[0]?.documentNumberFull ?? '',
            maker: orderDetailList[0]?.maker ?? '',
            model: orderDetailList[0]?.model ?? '',
            item: orderDetailList[0]?.item ?? '',
            unitPrice: orderDetailList[0]?.unitPrice || '',
            total: total || '',
            currencyUnit: orderDetailList[0]?.currency ?? '',
            totalReceivedQuantity: orderDetailList[0]?.quantity || '',
            unit: orderDetailList[0]?.unit ?? '',
        }
        setInfo(prev => ({
            ...prev,
            ...orderInfo
        }));
        void searchSource(orderInfo);
    }

    /**
     * @description 등록 페이지 > 메이커,모델로 내역 조회
     * 데이터 관리 > 재고관리 > 재고관리 등록
     * 발주서 Modal로 항목 가져올때
     * Maker, Model Input에서 Enter
     */
    async function searchSource (orderInfo?: any) {
        try {
            const res = await getData.post('inventory/getInventoryHistory', orderInfo ?? info);
            if (res?.data?.code !== 1) {
                console.error(res?.data?.message);
                message.error('해당 조건에 맞는 재고가 존재하지 않습니다.');
                setInfo(prev => ({
                    ...prev,
                    inventoryId: '',
                    inventoryDetailId: ''
                }));
                return;
            }
            const inventoryItemList = res?.data?.entity ?? [];
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

            setInfo(prev => ({
                ...prev,
                inventoryId: sourceHistoryList?.[0]?.inventoryId ?? '',
                maker: '',
                model: ''
            }))
            setTableData(sourceHistoryList);
            setTotalRow(sourceHistoryList.length);
            gridManage.resetData(gridRef, sourceHistoryList);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'source_write'}/>
        <SearchInfoModal open={isModalOpen} setIsModalOpen={setIsModalOpen}
                         info={info} setInfo={setInfo}
                         returnFunc={modalSelected}/>
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
                {mini ? <div>
                        <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                    style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'기본 정보'}>
                                    {datePickerForm({title: '등록일', id: 'receiptDate', onChange: onChange, data: info})}
                                    {inputForm({
                                        title: '만쿠발주서 No.',
                                        id: 'documentNumber',
                                        onChange: onChange,
                                        data: info,
                                        suffix: <span style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('connectInquiryNoForSource');
                                            }
                                        }>🔍</span>,
                                    })}
                                    {inputForm({
                                        title: 'Maker',
                                        id: 'maker',
                                        data: info,
                                        onChange: onChange,
                                        handleKeyPress: (e) => {
                                            if (e.key === 'Enter') void searchSource();
                                        },
                                        validate: validate['maker'],
                                        key: validate['maker']
                                    })}
                                    {inputForm({
                                        title: 'Model',
                                        id: 'model',
                                        data: info,
                                        onChange: onChange,
                                        handleKeyPress: (e) => {
                                            if (e.key === 'Enter') void searchSource();
                                        },
                                        validate: validate['model'],
                                        key: validate['model']
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'재고 정보'} tooltip={tooltipInfo('etc')}>
                                    {inputForm({
                                        title: '매입 총액',
                                        id: 'total',
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
                                        // validate: validate['receivedQuantity'],
                                        // key: validate['receivedQuantity']
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
                    </div>
                    : <></>}
            </MainCard>
            {/*@ts-ignored*/}
            <TableGrid
                totalRow={totalRow}
                gridRef={gridRef}
                columns={tableSourceUpdateColumns}
                onGridReady={onGridReady}
                getPropertyId={getPropertyId}
                customType={'SourceWrite'}
                setInfo={setInfo}
                funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

export default memo(SourceWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});