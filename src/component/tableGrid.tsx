// @ts-nocheck

import React, {useEffect, useMemo, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {useRouter} from "next/router";
import {tableTheme} from "@/utils/common";
import moment from "moment";
import * as XLSX from "xlsx";
import message from "antd/lib/message";
import Upload from "antd/lib/upload";
import Dragger from "antd/lib/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
import {numberFormat} from "@/utils/columnList";
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import {commonFunc} from "@/utils/commonManage";

const TableGrid = ({
                       columns, tableData,
                       setSelectedRows,
                       setInfo,
                       modalComponent,
                       funcButtons,
                       listType = 'estimateRequestId',
                       listDetailType = 'estimateRequestDetailList',
                       type='read',
                       gridRef,
                   }: any) => {


    const router = useRouter();

    const [data, setData] = useState(tableData);
    const [dragging, setDragging] = useState(false);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);


    // useEffect(()=>{
    //     setData(tableData)
    // },[tableData])



    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 80,
            filter: true,
            floatingFilter: true,
            valueGetter: (params) => {

                let sendData = params.data[params.column.colId];

                if (!!params.node.rowIndex && type === 'read') { // 첫 번째 행이 아닌 경우에만 이전 행 참조
                    const previousRowData = params.context?.data?.[params.node.rowIndex - 1];

                    if (previousRowData && params.data[listType] === previousRowData[listType]) {
                        if (params.column.colId === 'writtenDate' || params.column.colId === 'documentNumberFull') {
                            sendData = '';
                        }
                    }
                }


                return sendData;
            },
        };
    }, []);

    let selectedRows = []


    const rowSelection = useMemo((e) => {

        return {mode: "multiRow", };
    }, []);

    const handleSelectionChange = (e) => {
        setSelectedRows(e.api.getSelectedRows())

    }

    const handleRowValueChange = (e) => {
        console.log(e.api)
        console.log(e.api.getEdit)
    }


    let estimate = {
        documentNumberFull: "",
        maker: "",
        item: "",
        models: []
    };


    let isUpdatingSelection = false; // 중복 선택 이벤트 발생 방지 플래그

    const handleRowSelected = (event) => {
        if(type === 'write'){
            return false;
        }

        const selectedNode = event.node; // 현재 선택된 노드
        const selectedData = selectedNode.data; // 선택된 데이터
        const groupValue = selectedData.documentNumberFull; // 현재 행의 `documentNumberFull` 값


        // 현재 선택된 행의 인덱스를 확인
        const rowIndex = selectedNode.rowIndex;

        // 같은 그룹의 첫 번째 행인지 확인
        const previousData = event.api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.documentNumberFull;

        // 첫 번째 행인 경우 그룹 체크 동작 수행
        if (!previousData || previousData !== groupValue) {
            const isSelected = selectedNode.isSelected(); // 현재 행의 선택 상태

            // 동일한 `documentNumberFull` 값을 가진 모든 노드를 순회하며 선택 상태 변경
            event.api.forEachNode((node) => {
                if (node.data.documentNumberFull === groupValue) {
                    node.setSelected(isSelected); // 같은 그룹을 선택/해제
                }
            });
        }
    };

    const handleDoubleClicked = (e) => {

        if (type==='read'){
            if (e.data.estimateRequestId)
                router.push(`/rfq_update?estimateRequestId=${e?.data?.estimateRequestId}`)
            if (e.data.estimateId)
                router.push(`/estimate_update?estimateId=${e?.data?.estimateId}`)
            if (e.data.orderId)
                router.push(`/order_update?orderId=${e?.data?.orderId}`)
            if (e.data.inventoryId)
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

        if (type==='hsCode'){
            console.log(e.data, 'hsCode')
            setInfo(e.data)
        }
    };


    // 체크된 행의 데이터 가져오기 함수 수정
    const getCheckedRowsData = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes(); // gridOptions 대신 gridRef 사용
        const selectedData = selectedNodes.map(node => node.data);
        console.log(selectedData, 'selectedData')

        return selectedData;
    };


// 버튼 클릭 시 체크된 데이터 출력
    const handleButtonClick = () => {
        const checkedData = getCheckedRowsData();
        console.log("체크된 행의 데이터:", checkedData);
    };


    function dataChange(e) {
        const updatedData = [...data]; // 기존 데이터 복사
        const rowIndex = e.node.rowIndex; // 변경된 행의 인덱스

        // 수정된 행 업데이트
        updatedData[rowIndex] = {
            ...e.data,
            unreceivedQuantity: parseFloat(e.data.quantity || 0) - parseFloat(e.data.receivedQuantity || 0),
            amount: parseFloat(e.data.quantity || 0) * parseFloat(e.data.unitPrice || 0),
        };

        // 데이터 상태 업데이트
        setData(updatedData);
    }

    const handleFile = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            // 첫 번째 시트 읽기
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // 데이터를 JSON 형식으로 변환 (첫 번째 행을 컬럼 키로 사용)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // 데이터 첫 번째 행을 컬럼 이름으로 사용
            const headers = jsonData[0];
            const dataRows = jsonData.slice(1);

            // 테이블 데이터 변환
            const tableData = dataRows.map((row) => {
                const rowData = {};
                row?.forEach((cell, cellIndex) => {
                    const header = headers[cellIndex];
                    if (header !== undefined) {
                        rowData[header] = cell ?? ''; // 값이 없으면 기본값으로 빈 문자열 설정
                    }
                });
                return rowData;
            });

            // console.log(tableData, 'tableData~~~')
            setData(tableData);
            // setData((v) => {
            //     const copyData = { ...v };
            //     copyData[listType] = Array.isArray(tableData) ? tableData : []; // 배열인지 확인 후 설정
            //     return copyData;
            // });

        };

        reader.readAsBinaryString(file);
    };

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

            handleFile(file);
        }
    };


    useEffect(() => {
        setPinnedBottomRowData([commonFunc.sumCalc(data)]);
    }, [data]);

    return (
        <div className={`ag-theme-quartz ${dragging ? 'dragging' : ''}`}
             style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflowX: 'auto',
                 border: dragging ? '2px dashed #1890ff' : 'none', position:'relative'}}
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
                    <InboxOutlined style={{color:'blue', fontSize:50, margin:'10% 50% 0 45%'}}/><br/>
                    Drag & drop
                </div>
            )}

            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                <div>LIST</div>
                {funcButtons}
            </div>
            {modalComponent}

            <AgGridReact theme={tableTheme} ref={gridRef} containerStyle={{width: '100%', height: '78%'}}
                        //@ts-ignore
                         onRowDoubleClicked={handleDoubleClicked}
                        //@ts-ignore
                         rowSelection={rowSelection}
                         defaultColDef={defaultColDef}
                         columnDefs={columns}
                         rowData={[...data]}
                         // rowData={data}
                         paginationPageSize={1000}
                         paginationPageSizeSelector={[100, 500, 1000]}
                         context={data}
                         pagination={true}
                         onRowSelected={handleRowSelected}
                         onCellValueChanged={dataChange}
                         pinnedBottomRowData={pinnedBottomRowData}
                         gridOptions={{
                             loadThemeGoogleFonts: true,
                         }}
            />
            <div>adkfjaskl</div>
        </div>
    );
};
export default TableGrid;