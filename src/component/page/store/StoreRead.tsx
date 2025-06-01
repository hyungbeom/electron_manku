import React, {memo, useRef, useState} from "react";
import {storeRealInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import {CopyOutlined, RadiusSettingOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import {deleteOrderStatusDetails, getOrderStatusList} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, radioForm, rangePickerForm} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {storeReadColumn} from "@/utils/columnList";
import {useRouter} from "next/router";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {getData} from "@/manage/function/api";
import * as XLSX from "xlsx";
import moment from "moment";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";


function StoreRead({getPropertyId, getCopyPage}: any) {
    const router = useRouter();

    const gridRef = useRef(null);
    const groupRef = useRef(null);

    const copyInit = _.cloneDeep(storeRealInitial)

    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await getData.post('inbound/getInboundListInfo', info).then(v => {
            console.log(v, ':::')
            const {code, entity} = v?.data;
            if (code === 1) {
                params.api.applyTransaction({add: entity?.inboundList});
                setTotalRow(entity?.inboundList?.length)
            }
        })

    };

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('rfq_store');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 25]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            // 체크된 행 데이터 가져오기
            const selectedRows = gridRef.current.getSelectedRows();
            searchInfo(e)
        }
    }

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }


    async function moveRouter() {
        getCopyPage('store_write', {orderStatusDetailList: []})
    }

    /**
     * @description 배송 등록리스트 출력 함수입니다.
     */
    async function searchInfo(e) {
        if (e) {
            setLoading(true)
            await getData.post('inbound/getInboundListInfo', info).then(v => {
                const {code, entity} = v?.data;
                if (code === 1) {
                    gridManage.resetData(gridRef, entity?.inboundList);
                    setTotalRow(v.data?.length)
                    setLoading(false)
                }
            })
        }
        setLoading(false)
    }



    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            orderStatusId: "orderStatusId",
            orderStatusDetailId: "orderStatusDetailId",
        });
        setLoading(true)
        deleteOrderStatusDetails({data: {deleteList: deleteList}, returnFunc: searchInfo})
    }


    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    function exportExcel() {
        const columns = storeReadColumn;
        const rows = gridRef.current.getSelectedRows();

        // 날짜 기준 정렬
        const sortedRows = [...rows].sort(
            (a, b) => new Date(a.writtenDate).getTime() - new Date(b.writtenDate).getTime()
        );

        // 표시할 컬럼 필터링
        const exportableColumns = columns.filter(col => col.headerName && col.field);
        const headers = exportableColumns.map(col => col.headerName);

        // headerName ↔ field 매핑
        const fieldMap = {};
        exportableColumns.forEach(col => {
            fieldMap[col.headerName] = col.field;
        });

        // inboundId별 운수사명 중복 빈값 처리용 맵
        const inboundCarrierMap = new Map();
        sortedRows.forEach(row => {
            if (!inboundCarrierMap.has(row.inboundId)) {
                inboundCarrierMap.set(row.inboundId, row[fieldMap["운수사명"]] ?? "");
            }
        });

        // 엑셀 데이터 생성 (valueGetter 계산 로직 직접 적용)
        const excelData = sortedRows.map(row => {
            const newRow = {};

            headers.forEach(header => {
                let value = row[fieldMap[header]];

                // 날짜 포맷팅
                if (typeof value === "string" && moment(value, "YYYY-MM-DD", true).isValid()) {
                    value = moment(value).format("YYYY-MM-DD");
                }

                // 운수사명은 inboundId 기준으로 중복 빈값 처리
                if (header === "운수사명") {
                    value = inboundCarrierMap.get(row.inboundId) ?? "";
                }

                newRow[header] = value ?? "";
            });

            // valueGetter 계산 컬럼 직접 계산해서 넣기

            // 합계 (VAT 포함)
            const total = Number(row.total);
            newRow["합계 (VAT 포함)"] = !isNaN(total) ? (total * 1.1).toFixed(2) : "";

            // 판매금액 (VAT 포함)
            const saleAmount = Number(row.saleAmount);
            newRow["판매금액 (VAT 포함)"] = !isNaN(saleAmount) ? (saleAmount * 1.1).toFixed(2) : "";

            // 영업이익금 (영업이익)
            const saleTotal = Number(row.saleTotal);
            newRow["영업이익금"] =
                !isNaN(total) && !isNaN(saleTotal) ? (saleTotal - total).toFixed(2) : "";

            return newRow;
        });

        // finalHeaders는 storeReadColumn 기준 헤더 + 계산 컬럼 (중복 제외)
        const calcHeaders = ["합계 (VAT 포함)", "판매금액 (VAT 포함)", "영업이익금"];
        const finalHeaders = [...headers];
        calcHeaders.forEach(h => {
            if (!finalHeaders.includes(h)) finalHeaders.push(h);
        });

        // 워크시트 생성
        const worksheet = XLSX.utils.json_to_sheet(excelData, {header: finalHeaders});
        worksheet["!cols"] = finalHeaders.map(() => ({wch: 15}));

        // 병합할 컬럼 인덱스 (판매금액 (VAT 포함) 제외)
        const mergeCols = [
            "운수사명",
            "부가세",
            "관세",
            "운임비",
            "합계",
            "합계 (VAT 포함)",
            "영업이익금",
        ]
            .map(h => finalHeaders.indexOf(h))
            .filter(i => i >= 0);

        // 병합 처리
        const merges = [];
        mergeCols.forEach(colIndex => {
            let mergeStart = 0;
            let prevInboundId = sortedRows[0]?.inboundId;

            for (let i = 1; i <= sortedRows.length; i++) {
                const currentInboundId = i < sortedRows.length ? sortedRows[i].inboundId : null;

                if (currentInboundId !== prevInboundId) {
                    if (i - mergeStart > 1) {
                        merges.push({
                            s: {r: mergeStart + 1, c: colIndex}, // 데이터는 헤더 다음 행부터 시작
                            e: {r: i, c: colIndex},
                        });
                    }
                    mergeStart = i;
                    prevInboundId = currentInboundId;
                }
            }
        });

        worksheet["!merges"] = merges;
// 병합된 셀 중앙 정렬 스타일 적용
        merges.forEach(({s, e}) => {
            const cellAddress = XLSX.utils.encode_cell({r: s.r, c: s.c});
            if (!worksheet[cellAddress]) return;

            worksheet[cellAddress].s = worksheet[cellAddress].s || {};
            worksheet[cellAddress].s.alignment = {
                vertical: "center",
                horizontal: "center",
            };
        });
        // 워크북 생성 및 저장
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "입고관리");

        const fileName = `입고관리_${moment().format("YYYYMMDD_HHmm")}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }

    function moveRegist() {

    }

    return <Spin spinning={loading} tip={'입고 조회중...'}>
        <ReceiveComponent componentName={'store_read'} searchInfo={searchInfo}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 270 : 65}px calc(100vh - ${mini ? 400 : 195}px)`,
                // rowGap : 10
            }}>
                <MainCard title={'견적의뢰 조회'} list={[
                    {
                        name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>,
                        func: searchInfo,
                        type: 'primary'
                    },
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    },
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>, func: moveRegist, type: ''},
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard>

                                    {inputForm({
                                        title: '문서번호', id: 'searchDocumentNumberFull',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}

                                    {inputForm({
                                        title: 'Project No.', id: 'searchRfqNo',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '고객사명', id: 'searchCustomerName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard>
                                    {inputForm({
                                        title: 'B/L No.', id: 'searchBlNo',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 25px 25px 25px',
                                        gap: 3
                                    }}>
                                        {rangePickerForm({
                                            title: '입고일자',
                                            id: 'searchInboundDate',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchInboundDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartDate": moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>T</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchInboundDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartInboundDate": moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndInbound0.Date": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>M</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchInboundDate: [moment().subtract(1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartInboundDate": moment().subtract(1, 'year').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndInboundDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>Y</Button>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 25px 25px 25px',
                                        gap: 3
                                    }}>
                                        {rangePickerForm({
                                            title: '출고일자',
                                            id: 'searchOutboundDate',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchOutboundDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartOutboundDate": moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndOutboundDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>T</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchOutboundDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartOutboundDate": moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndOutboundDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>M</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchOutboundDate: [moment().subtract(1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartOutboundDate": moment().subtract(1, 'year').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndOutboundDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>Y</Button>
                                    </div>
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 25px 25px 25px',
                                        gap: 3
                                    }}>
                                        {rangePickerForm({
                                            title: '계산서발행일자',
                                            id: 'searchInvoiceDate',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchInvoiceDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartInvoiceDate": moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndInvoiceDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>T</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchInboundDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartInvoiceDate": moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndInvoiceDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>M</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchInboundDate: [moment().subtract(1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchStartInvoiceDate": moment().subtract(1, 'year').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchEndInvoiceDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>Y</Button>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 25px 25px 25px',
                                        gap: 3
                                    }}>
                                        {rangePickerForm({
                                            title: '송금일자',
                                            id: 'searchRequestDate',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchRequestDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchRequestStartDate": moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchRequestEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>T</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchRequestDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchRequestStartDate": moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchRequestEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>M</Button>
                                        <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                onClick={() => {
                                                    setInfo(v => {
                                                        return {
                                                            ...v,
                                                            searchRequestDate: [moment().subtract(1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                            "searchRequestStartDate": moment().subtract(1, 'year').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                            "searchRequestEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                        }
                                                    })
                                                }}>Y</Button>
                                    </div>

                                    {radioForm({
                                        title: '결제여부',
                                        id: 'searchPaymentStatus',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: '', title: '전체'},
                                            {value: '완료', title: '완료'},
                                            {value: '부분완료', title: '부분완료'},
                                            {value: '미완료', title: '미완료'}
                                        ]
                                    })}
                                </BoxCard>
                            </Panel>
                        </PanelGroup>
                    </div> : <></>}
                </MainCard>

                {/*@ts-ignored*/}


                <TableGrid deleteComp={<>
                    <Button type={'primary'} size={'small'} style={{fontSize: 10}} onClick={exportExcel}>송장출력</Button>
                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'}
                            style={{fontSize: 11, marginLeft: 5}}
                            onClick={deleteList}>
                        <CopyOutlined/>삭제
                    </Button></>}
                           totalRow={totalRow}
                           type={'read'}
                           getPropertyId={getPropertyId}
                           gridRef={gridRef}
                           columns={storeReadColumn}
                           onGridReady={onGridReady}
                           funcButtons={['print']}
                />
            </div>
        </>
    </Spin>
}


export default memo(StoreRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});