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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

    function exportExcel() {
        const wideColumns = ['주소', '받는분주소', 'Inquiry No', '도착지'];
        const selectedRows = gridRef.current.getSelectedRows();

        // 날짜 기준 오름차순 정렬
        const sortedRows = [...selectedRows].sort((a, b) =>
            // @ts-ignore
            new Date(a.deliveryDate) - new Date(b.deliveryDate)
        );

        const 대한통운Data = [];
        const 대신택배Data = [];
        const 기타Data = [];

        let prevDateCJ = '';
        let prevDateDS = '';
        let prevDateEtc = '';

        sortedRows.forEach(row => {
            const deliveryType = row.deliveryType?.toUpperCase();
            const date = row.deliveryDate;
            const isConfirm =row.isConfirm;
            const quantity = row.quantity || 1;

            if (deliveryType === 'CJ') {
                대한통운Data.push({
                    날짜: date !== prevDateCJ ? date : '',
                    받는분성명: row.recipientName,
                    받는분전화번호: row.recipientPhone,
                    받는분기타연락처: row.recipientAltPhone,
                    받는분우편번호: row.recipientPostalCode,
                    받는분주소: row.recipientAddress,
                    운송장번호: row.trackingNumber,
                    고객주문번호: row.customerOrderNo,
                    품목명: row.productName,
                    박스수량: quantity,
                    "Inquiry No": row.connectInquiryNo,
                    확인: isConfirm
                });
                prevDateCJ = date;
            } else if (deliveryType === 'DAESIN') {
                대신택배Data.push({
                    일자: date !== prevDateDS ? date : '',
                    도착지: row.destination,
                    전화번호: row.recipientPhone,
                    업체: '대신택배',
                    받는분: row.recipientName,
                    주소: row.recipientAddress,
                    품명: row.productName,
                    포장: row.packagingType,
                    수량: quantity,
                    "택배/화물": row.shippingType,
                    현불: row.paymentMethod === '현불' ? 'O' : '',
                    착불: row.paymentMethod === '착불' ? 'O' : '',
                    "Inquiry No": row.connectInquiryNo,
                    확인: isConfirm
                });
                prevDateDS = date;
            } else {
                기타Data.push({
                    일자: date !== prevDateEtc ? date : '',
                    주소: row.recipientAddress,
                    전화번호: row.recipientPhone,
                    업체: row.deliveryType || '기타',
                    받는분: row.recipientName,
                    현불: row.paymentMethod === '현불' ? 'O' : '',
                    착불: row.paymentMethod === '착불' ? 'O' : '',
                    "Inquiry No": row.connectInquiryNo,
                    구분: row.classification,
                    확인: isConfirm
                });
                prevDateEtc = date;
            }
        });

        const 대한통운Headers = [
            "날짜", "받는분성명", "받는분전화번호", "받는분기타연락처", "받는분우편번호",
            "받는분주소", "운송장번호", "고객주문번호", "품목명", "박스수량", "Inquiry No", "확인"
        ];
        const 대신택배Headers = [
            "일자", "도착지", "전화번호", "업체", "받는분", "주소", "품명", "포장", "수량",
            "택배/화물", "현불", "착불", "Inquiry No", "확인"
        ];
        const 기타Headers = [
            "일자", "주소", "전화번호", "업체", "받는분", "현불", "착불", "Inquiry No", "구분", "확인"
        ];

        const workbook = XLSX.utils.book_new();

        if (대한통운Data.length > 0) {
            const ws1 = XLSX.utils.json_to_sheet(대한통운Data, { header: 대한통운Headers });
            ws1['!cols'] =  [
                { wch: 10 }, // 날짜
                { wch: 15 }, // 받는분성명
                { wch: 15 }, // 받는분전화번호
                { wch: 15 }, // 받는분기타연락처
                { wch: 15 }, // 받는분우편번호
                { wch: 40 }, // 받는분주소
                { wch: 10 }, // 운송장번호
                { wch: 20 }, // 고객주문번호
                { wch: 10 }, // 품목명
                { wch: 8 }, // 박스수량
                { wch: 40 }, // Inquiry No (넉넉하게)
                { wch: 5 }  // 확인
            ];

            XLSX.utils.book_append_sheet(workbook, ws1, "대한통운");
        }
        if (대신택배Data.length > 0) {
            const ws2 = XLSX.utils.json_to_sheet(대신택배Data, { header: 대신택배Headers });
            ws2['!cols'] = [
                { wch: 12 },  // 일자
                { wch: 40 },  // 도착지 (길게)
                { wch: 15 },  // 전화번호
                { wch: 15 },  // 업체
                { wch: 20 },  // 받는분
                { wch: 50 },  // 주소 (길게)
                { wch: 15 },  // 품명
                { wch: 10 },  // 포장
                { wch: 10 },  // 수량
                { wch: 10 },  // 택배/화물
                { wch: 6 },   // 현불
                { wch: 6 },   // 착불
                { wch: 50 },  // Inquiry No (넉넉하게)
                { wch: 8 }    // 확인
            ];
            XLSX.utils.book_append_sheet(workbook, ws2, "대신택배");
        }
        if (기타Data.length > 0) {
            const ws3 = XLSX.utils.json_to_sheet(기타Data, { header: 기타Headers });
            ws3['!cols'] = [
                { wch: 12 },  // 일자
                { wch: 50 },  // 주소 (길게)
                { wch: 15 },  // 전화번호
                { wch: 20 },  // 업체
                { wch: 20 },  // 받는분
                { wch: 6 },   // 현불
                { wch: 6 },   // 착불
                { wch: 50 },  // Inquiry No (넉넉하게)
                { wch: 15 },  // 구분
                { wch: 8 }    // 확인
            ];
            XLSX.utils.book_append_sheet(workbook, ws3, "퀵,직납,기타");
        }
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "배송송장.xlsx");
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
                                            {rangePickerForm({
                                                title: '출고일자',
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
                        <>
                            <Button size={'small'} style={{fontSize : 10}} type={'primary'} onClick={exportExcel}>송장출력</Button>
                            <Popconfirm
                                title="삭제하시겠습니까?"
                                onConfirm={confirm}
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