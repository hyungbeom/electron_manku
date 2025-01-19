// @ts-nocheck

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {useRouter} from "next/router";
import {tableTheme} from "@/utils/common";
import * as XLSX from "xlsx";
import message from "antd/lib/message";
import Upload from "antd/lib/upload";
import {InboxOutlined} from "@ant-design/icons";

import {commonFunc, commonManage} from "@/utils/commonManage";
import useEventListener from "@/utils/common/function/UseEventListener";
import {searchEstimate} from "@/utils/api/mainApi";
import OrderListModal from "@/component/OrderListModal";
import _ from "lodash";
import {storeDetailUnit} from "@/utils/initialList";
import EstimateListModal from "@/component/EstimateListModal";

const TableGrid = ({
                       gridRef,
                       columns,
                       onGridReady = function () {
                       },
                       type = 'read',
                       funcButtons,
                       onCellEditingStopped = null

                   }: any) => {


    const router = useRouter();

    const [dragging, setDragging] = useState(false);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);
    const [page, setPage] = useState({x: null, y: null, field: null, event: null})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ref = useRef(null);


    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 80,
            filter: true,
            floatingFilter: true
        };
    }, []);


    const rowSelection = useMemo((e) => {
        return {mode: "multiRow",};
    }, []);

    const handleSelectionChange = (e) => {
        setSelectedRows(e.api.getSelectedRows())

    }


    /**
     * @description row를 선택할때 documentNumberFull 을 기준으로 같은 문서번호 row들은 동시 체크되게 하는 로직
     * @param event
     */
    const handleRowSelected = (event) => {
        if (type === 'write') {
            return false; // 'write' 타입일 경우 아무 작업도 하지 않음
        }

        const selectedNode = event.node; // 현재 선택된 노드
        const selectedData = selectedNode.data; // 선택된 데이터

        // documentNumberFull 필드가 없거나 값이 없으면 아무 작업도 하지 않음
        if (!selectedData?.documentNumberFull) {
            return;
        }

        const groupValue = selectedData.documentNumberFull; // 현재 행의 `documentNumberFull` 값
        const rowIndex = selectedNode.rowIndex;
        const previousData = event.api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.documentNumberFull;

        // 이전 데이터와 그룹 값이 다를 때만 처리
        if (!previousData || previousData !== groupValue) {
            const isSelected = selectedNode.isSelected();

            // 동일한 groupValue를 가진 행들만 선택 상태 변경
            event.api.forEachNode((node) => {
                if (node.data?.documentNumberFull === groupValue) {
                    node.setSelected(isSelected);
                }
            });
        }
    };


    const handleDoubleClicked = (e) => {

        if (type === 'read') {
            if (e.data.orderStatusId)
                router.push(`/store_update?orderStatusId=${e?.data?.orderStatusId}`)
            if (e.data.projectId)
                router.push(`/project_update?projectId=${e?.data?.projectId}`)
            if (e.data.deliveryId)
                router.push(`/delivery_update?deliveryId=${e?.data?.deliveryId}`)
            if (e.data.remittanceId)
                router.push(`/remittance_domestic_update?remittanceId=${e?.data?.remittanceId}`)
            if (e.data.estimateRequestId)
                router.push(`/rfq_update?estimateRequestId=${e?.data?.estimateRequestId}`)
            if (e.data.estimateId)
                router.push(`/estimate_update?estimateId=${e?.data?.estimateId}`)
            if (e.data.orderId)
                router.push(`/order_update?orderId=${e?.data?.orderId}`)
            if (e.data.remainingQuantity)
                router.push(`/inventory_update?maker=${e?.data?.maker}&model=${e?.data?.model}`)
            if (e.data.makerId)
                router.push(`/maker_update?makerName=${e?.data?.makerName}`)
            if (e.data.agencyId)
                router.push(`/code_domestic_agency_update?agencyCode=${e?.data?.agencyCode}`)
            if (e.data.overseasAgencyId)
                router.push(`/code_overseas_agency_update?agencyCode=${e?.data?.agencyCode}`)
            if (e.data.customerId)
                router.push(`/code_domestic_customer_update?customerCode=${e?.data?.customerCode}`)
            if (e.data.overseasCustomerId)
                router.push(`/code_overseas_customer_update?customerCode=${e?.data?.customerCode}`)
            if (e.data.officialDocumentId)
                router.push(`/code_diploma_update?officialDocumentId=${e?.data?.officialDocumentId}`)
        }

        if (type === 'hsCode') {
            // setInfo(e.data)
        }
    };


    function clickRowCheck(api) {

        let checkedData = [];

        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const rowNode = api.getDisplayedRowAtIndex(i);
            if (rowNode.isSelected()) {
                checkedData.push(rowNode.data);
            }
        }
    }


    function dataChange(e) {
        // const updatedData = [...data];
        // const rowIndex = e.node.rowIndex;
        console.log(e, '???')
        clickRowCheck(e.api);
        handleSelectionChanged();
    }


    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];

            const isExcel =
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel' ||
                file.name.toLowerCase().endsWith('.xlsx') ||
                file.name.toLowerCase().endsWith('.xls');

            if (!isExcel) {
                message.error('엑셀 파일만 업로드 가능합니다.');
                return Upload.LIST_IGNORE;
            }

            commonManage.excelFileRead(file).then(v => {

                gridRef.current.applyTransaction({add: v});

            })

            // handleFile(file);
        }
    };


    const handleCellRightClick = (e) => {
        if (e.event) {
            e.event.preventDefault(); // 기본 컨텍스트 메뉴 막기
        }


        // if(e.column.getId() === 'connectInquiryNo'){
        //     const rowNode = gridRef.current.getDisplayedRowAtIndex(e.node.rowIndex);
        //     rowNode.setDataValue(e.column.getId(), "11114");
        // }


        const {clientX, clientY} = e.event;
        e.event.preventDefault();
        setPage({x: clientX, y: clientY, field: e.column.getId(), event: e})
    }


    const handleSelectionChanged = () => {
        const selectedRows = gridRef.current.getSelectedRows(); // 체크된 행 가져오기

        const totals = commonFunc.sumCalc(selectedRows);
        setPinnedBottomRowData([totals]);
    };


    useEventListener('contextmenu', (e: any) => {
        e.preventDefault()
    }, typeof window !== 'undefined' ? document : null)

    useEventListener('click', (e: any) => {
        setPage(v => {
            return {...v, x: null, y: null}
        });
    }, typeof window !== 'undefined' ? document : null)


    // async function getProjectDetail(e) {
    //     if (e.column.colId === 'connectInquiryNo') { // 특정 칼럼 조건
    //         console.log('Editing stopped in Name column:', e.value);
    //         const result = await getEstimateInfo(e.value)
    //
    //         const rowNode = e.node;
    //         const updatedData = {};
    //
    //         if (result.length && !!e.value) {
    //             const updatedData = result.map((item) => {
    //                 const {a, c, ...rest} = item; // 기존 키를 구조 분해
    //                 return {
    //                     ...rest,      // 나머지 키를 유지
    //                     // aa: a,        // a를 aa로 변경
    //                     connectInquiryNo: item['documentNumberFull']
    //                 };
    //             });
    //
    //             rowNode.setData(updatedData[0]);
    //
    //             if (result.length > 1) {
    //                 updatedData.shift();
    //
    //
    //                 gridRef.current.applyTransaction({
    //                     add: updatedData, // 결과 배열의 각 객체가 새로운 행으로 추가됨
    //                 });
    //
    //             }
    //         }
    //
    //     }
    // }


    function getSelectedRows(ref) {
        if (ref.current) {
            const selectedRows = ref.current.getSelectedRows();

            if (selectedRows.length) {
                const list = selectedRows.map(v => {
                    return {...v, connectInquiryNo: v.documentNumberFull, currencyUnit: v.currency, spec: v.unit, agencyManagerPhone : v.agencyManagerPhoneNumber}
                })
                gridRef.current.applyTransaction({
                    remove: [page.event.node.data], // 삭제할 데이터
                    add: list
                });
            }
        } else {
            console.warn('Grid API is not available.');
            return [];
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <EstimateListModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} getRows={getSelectedRows}/>
            {page.x ? <div style={{
                position: 'fixed',
                top: page.y,
                left: page.x,
                zIndex: 10000,
                fontSize: 11,
                backgroundColor: 'white',
                border: '1px solid lightGray',
                width: 90,
                cursor: 'pointer'
            }} ref={ref} id={'right'}>
                {page.field === 'connectInquiryNo' ? <div onClick={() => {
                    setPage(v => {
                        return {...v, x: null, y: null}
                    });
                    showModal();
                }} id={'right'} style={{backgroundColor: 'lightgray', padding: 3}}>견적 Inquiry조회
                </div> : <></>}
                <div style={{paddingTop: 6, padding: 3}} onClick={() => {
                    setPage(v => {
                        return {...v, x: null, y: null}
                    });
                }} id={'right'}>통합
                </div>
                <div style={{padding: 3, backgroundColor: 'lightgray'}} onClick={() => {

                    setPage(v => {
                        return {...v, x: null, y: null}
                    });
                }}
                     id={'right'}
                     onClick={() => {
                         gridRef.current.applyTransaction({remove: [page.event.node.data]});
                     }}
                >삭제
                </div>
            </div> : <></>}

            <div className={`ag-theme-quartz ${dragging ? 'dragging' : ''}`}
                 style={{
                     height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflowX: 'auto',
                     border: dragging ? '2px dashed #1890ff' : 'none', position: 'relative'
                 }}
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}
            >
                {dragging && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)', // 반투명 흰색 배경
                            zIndex: 10,
                            pointerEvents: 'none', // 오버레이가 이벤트를 방해하지 않도록 설정
                        }}
                    >
                        <InboxOutlined style={{color: 'blue', fontSize: 50, margin: '10% 50% 0 45%'}}/><br/>
                        Drag & drop
                    </div>
                )}

                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                    <div>LIST</div>
                    {funcButtons}
                </div>

                <AgGridReact
                    onGridReady={onGridReady}
                    theme={tableTheme} ref={gridRef}
                    // containerStyle={{width: '100%', height: '100%'}}
                    //@ts-ignore
                    onRowDoubleClicked={handleDoubleClicked}
                    //@ts-ignore
                    rowSelection={rowSelection}
                    onCellEditingStopped={onCellEditingStopped}
                    defaultColDef={defaultColDef}
                    columnDefs={columns}
                    onCellContextMenu={handleCellRightClick}
                    paginationPageSize={1000}
                    paginationPageSizeSelector={[100, 500, 1000]}
                    pagination={true}
                    onRowSelected={handleRowSelected}
                    onCellValueChanged={dataChange}
                    pinnedBottomRowData={pinnedBottomRowData}
                    onSelectionChanged={handleSelectionChanged} // 선택된 행 변경 이벤트
                    gridOptions={{
                        loadThemeGoogleFonts: true,
                    }}
                    rowDragManaged={true}
                    rowDragMultiRow={true}

                />
            </div>
        </>
    );
};
export default React.memo(TableGrid);