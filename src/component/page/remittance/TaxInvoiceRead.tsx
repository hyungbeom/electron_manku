import React, {useEffect, useRef, useState} from "react";
import {taxInvoiceSearchInitial} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import moment from "moment";
import {BoxCard, datePickerForm, inputForm, MainCard, radioForm} from "@/utils/commonForm";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    RadiusSettingOutlined,
    SaveOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {getRemittanceList} from "@/utils/api/mainApi";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableTaxInvoiceReadColumn} from "@/utils/columnList";
import {catchError} from "rxjs";

export default function TaxInvoiceRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const gridRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('tax_invoice_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const [isSearch, setIsSearch] = useState(false);

    const getTaxInvoiceSearchInit = () => _.cloneDeep(taxInvoiceSearchInitial);
    const [info, setInfo] = useState(getTaxInvoiceSearchInit());

    const [totalRow, setTotalRow] = useState(0);

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
    const onGridReady = async (params) => {
        gridRef.current = params.api;
        setLoading(true);
        try {
            const res = await getData.post('invoice/getInvoiceListInfo', info);
            console.log(res)
            const { invoiceList = [] } = res?.data?.entity ?? {};
            params.api.applyTransaction({add: invoiceList});
            setTotalRow(invoiceList?.length);
        } catch (err) {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        } finally {
            setLoading(false);
        }
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true);
        }
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 송금 > 세금계산서 요청 조회
     * @param e
     */
    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            try {
                const res = await getData.post('invoice/getInvoiceListInfo', info);
                console.log(res)
                const { invoiceList = [] } = res?.data?.entity ?? {};
                gridManage.resetData(gridRef, invoiceList);
                setTotalRow(invoiceList?.length);
            } catch (err) {
                notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
                console.error('에러:', err);
            } finally {
                setLoading(false);
            }
        }
    }

    /**
     * @description 조회 페이지 > 초기화 버튼
     * 송금 > 세금계산서 요청 조회
     */
    function clearAll() {
        setInfo(getTaxInvoiceSearchInit());
        gridRef.current.deselectAll();
        setIsSearch(true);
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 송금 > 세금계산서 요청 조회
     */
    async function moveRouter() {
        getCopyPage('tax_invoice_write', {})
    }

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 송금 > 세금계산서 요청 조회
     */
    async function confirm() {
        const list = gridRef.current.getSelectedRows();
        if (!list?.length) return message.warn('삭제할 세금계산서 요청 내역을 선택해주세요.');

        setLoading(true);

        const filterList = list.map(v => parseInt(v.invoiceId));
        await getData.post('invoice/deleteInvoice', filterList).then(v => {
            if (v.data.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑️ 세금계산서 요청 삭제완료',
                    <>
                        <div>Inquiry No. :
                            : {list[0].documentNumbers} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 세금계산서 요청 이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
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

    return <Spin spinning={loading} tip={'세금계산서 요청 조회중...'}>
        <ReceiveComponent componentName={'tax_invoice_read'} searchInfo={searchInfo}/>
        <PanelSizeUtil groupRef={groupRef} storage={'tax_invoice_read'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '215px' : '65px'} calc(100vh - ${mini ? 345 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'세금계산서 요청 조회'} list={[
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
                    <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard title={''}>
                                {datePickerForm({
                                    title: '발행지정일자',
                                    id: 'invoiceDueDate',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자',
                                    id: 'customerManagerName',
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
                                    title: 'Inquiry No.',
                                    id: 'documentNumberFull',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '고객사명',
                                    id: 'customerName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard title={''}>
                                {radioForm({
                                    title: '계산서 발행여부',
                                    id: 'invoiceStatus',
                                    onChange: onChange,
                                    data: info,
                                    list: [
                                        {value: '', title: '전체'},
                                        {value: 'O', title: 'O'},
                                        {value: 'X', title: 'X'}
                                    ]
                                })}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[3]} minSize={0}></Panel>
                    </PanelGroup>
                </div> : <></>}
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
               columns={tableTaxInvoiceReadColumn}
               onGridReady={onGridReady}
               funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

