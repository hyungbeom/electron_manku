// @ts-nocheck

import React, {useMemo, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {iconSetMaterial, themeQuartz} from '@ag-grid-community/theming';
import {useRouter} from "next/router";

const tableTheme = themeQuartz
    .withPart(iconSetMaterial)
    .withParams({
        browserColorScheme: "light",
        cellHorizontalPaddingScale: 0.5,
        columnBorder: true,
        fontSize: "10px",
        headerBackgroundColor: "#FDFDFD",
        headerFontSize: "12px",
        headerFontWeight: 550,
        headerVerticalPaddingScale: 0.8,
        iconSize: "11px",
        rowBorder: true,
        rowVerticalPaddingScale: 0.8,
        sidePanelBorder: true,
        spacing: "5px",
        wrapperBorder: true,
        wrapperBorderRadius: "6px",
    });


const TableGrid = ({
                       columns, tableData,
                       setSelectedRows,
                       setInfo,
                       setDatabase,
                       modalComponent,
                       funcButtons,
                       listType = 'estimateRequestId',
                       listDetailType = 'estimateRequestDetailList',
                       excel = false,
                       pageInfo = null,
                       setPaginationInfo,
                       setTableData,
                       handlePageChange,
                       type='read',
                       setIsModalOpen = undefined,
                       setItemId = undefined,
                       gridRef
                   }: any) => {


    const router = useRouter();

    const [data, setData] = useState(tableData);


    // useEffect(() => {
    //
    //     setData([...tableData || []]); // 새로운 배열로 설정
    //     // console.log(tableData, '~!~table grid');
    // }, [tableData || [].length]);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 80,
            filter: true,
            floatingFilter: true,
            // editable: true,
            valueGetter: (params) => {


                let sendData = params.data[params.column.colId];


                if (!!params.node.rowIndex && type === 'read') { // 첫 번째 행이 아닌 경우에만 이전 행 참조
                    const previousRowData = params.context?.data?.[params.node.rowIndex - 1];

                    console.log(previousRowData,'previousRowData:')


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


    const rowSelection = useMemo(() => {
        return {mode: "multiRow"};
    }, []);

    const handleSelectionChange = (e) => {
        setSelectedRows(e.api.getSelectedRows())

    }

    const handleRowValueChange = (e) => {
        // console.log(e.api)
        // console.log(e.api.getEdit)
    }

    const [estimateList, setEtimateList] = useState([])

    let estimate = {
        documentNumberFull: "",
        maker: "",
        item: "",
        models: []
    };


    let isUpdatingSelection = false; // 중복 선택 이벤트 발생 방지 플래그

    const handleRowSelected = (e) => {
        if(type === 'write'){
            return false;
        }
        if (isUpdatingSelection) return; // 중복 선택 이벤트 발생 시 종료
        isUpdatingSelection = true;

        const currentRowData = e.node.data;
        const currentDocumentNumber = currentRowData.documentNumberFull;
        const isCurrentlySelected = e.node.isSelected();
        const api = e.api;

        // 부모 행인지 확인하는 함수 (연속된 `documentNumberFull` 값이 다르면 부모로 간주)
        const isParent = (nodeIndex) => {
            if (nodeIndex === 0) return true;
            const previousRowData = api.getDisplayedRowAtIndex(nodeIndex - 1).data;
            return previousRowData.documentNumberFull !== currentDocumentNumber;
        };

        if (isParent(e.node.rowIndex)) {
            // 부모가 선택된 경우 자식들만 선택/해제하고, 중복 이벤트 발생 방지
            const selectedId = currentRowData.estimateRequestId;
            api.forEachNode((node) => {
                if (node.data.estimateRequestId === selectedId && node !== e.node) {
                    node.setSelected(isCurrentlySelected, false); // 자식만 선택/해제
                }
            });
        } else {
            // 자식 행이 선택/해제되었을 때 부모 상태 동기화
            const selectedId = currentRowData.estimateRequestId;
            let allChildrenSelected = true;
            let parentNode = null;

            api.forEachNode((node) => {
                if (node.data.estimateRequestId === selectedId) {
                    if (isParent(node.rowIndex)) {
                        parentNode = node; // 부모 노드를 추적
                    } else if (!node.isSelected()) {
                        allChildrenSelected = false; // 자식 중 하나라도 선택 해제 시
                    }
                }
            });

            // 자식이 모두 선택되었을 때만 부모 선택, 자식 중 하나라도 해제되면 부모 해제
            if (parentNode) {
                parentNode.setSelected(allChildrenSelected, false);
            }
        }



        console.log(estimateList, 'estimateList~~~~');


        isUpdatingSelection = false; // 선택 업데이트 종료

    };


    const handleDoubleClicked = (e) => {
        if (e.data.estimateRequestId)
            router.push(`/rfq_write?estimateRequestId=${e?.data?.estimateRequestId}`)
        if (e.data.estimateId)
            router.push(`/estimate_write?estimateId=${e?.data?.estimateId}`)
        if (e.data.orderId)
            router.push(`/order_write?orderId=${e?.data?.orderId}`)
        if (e.data.inventoryId) {
            let itemId = e.data.inventoryId;
            setIsModalOpen(true);
            setItemId(itemId);
            // console.log(itemId, 'itemId')

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


    function dataChange(e){
        const updatedData = e.data; // 수정된 행의 전체 데이터
        const updatedField = e.colDef.field; // 수정된 컬럼의 필드명
        const newValue = e.newValue; // 새로운 값
        const oldValue = e.oldValue; // 이전 값


        // 변경 사항이 있을 때만 처리
        if (newValue !== oldValue) {

            setInfo(v=>{
                let copyData = {...v}
                copyData[listDetailType][e.node.rowIndex] = updatedData
                return copyData
            })
            console.log("업데이트된 데이터:", updatedData);
        }
    }

    return (
        <div className="ag-theme-quartz"
             style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflowX: 'auto'}}>

            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                <span>LIST</span>
                {funcButtons}
            </div>
            {modalComponent}

            <AgGridReact theme={tableTheme} ref={gridRef}
                //@ts-ignore
                         style={{width: '100%', height: '90%'}}
                // onSelectionChanged={handleSelectionChange}
                         onRowDoubleClicked={handleDoubleClicked}
                         onRowValueChanged={handleRowValueChange}
                //@ts-ignore
                         rowSelection={rowSelection}
                         defaultColDef={defaultColDef}
                         columnDefs={columns}
                         rowData={data}
                         context={{data}}
                         pagination={true}
                         onRowSelected={handleRowSelected}
                         onCellValueChanged={dataChange}
            />

        </div>
    );
};

export default TableGrid;