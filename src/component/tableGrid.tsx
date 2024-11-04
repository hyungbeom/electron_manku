// @ts-nocheck

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz, iconSetMaterial } from '@ag-grid-community/theming';

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


const TableGrid  = ({
                        columns, tableData,
                        setSelectedRows,
                        // tableData,
                        // setTableData,
                        setDatabase,
                        modalComponent,
                        funcButtons,
                        listType,
                        excel = false,
                        pageInfo=null,
                        setPaginationInfo,
                        setTableData,
                        handlePageChange,
                        visible = false,
                        setIsModalOpen = undefined,
                        setItemId = undefined,
                    }: any) => {

    const gridRef = useRef(null);
    const [data, setData] = useState(tableData);

    useEffect(() => {

        setData([...tableData || []]); // 새로운 배열로 설정
        // console.log(tableData, '~!~table grid');
    }, [tableData.length]);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 80,
            filter: true,
            floatingFilter: true,
            // editable: true,
        };
    }, []);

    let selectedRows=[]

    const rowSelection = useMemo(() => {
        return { mode: "multiRow"};
    }, []);

    const handleSelectionChange = (e) => {
        setSelectedRows(e.api.getSelectedRows())
    }

    const handleRowValueChange = (e) => {
        // console.log(e.api)
        // console.log(e.api.getEdit)
    }

    const handleDoubleClicked = (e) =>{
        // console.log(e.data.estimateId, "handleDoubleClicked")

        if(e.data.estimateRequestId)
            router.push(`/rfq_write?estimateRequestId=${e?.data?.estimateRequestId}`)
        if(e.data.estimateId)
            router.push(`/estimate_write?estimateId=${e?.data?.estimateId}`)
        if(e.data.orderId)
            router.push(`/order_write?orderId=${e?.data?.orderId}`)
        if(e.data.inventoryId) {
            let itemId = e.data.inventoryId;
            setIsModalOpen(true)
            setItemId(itemId)
            // console.log(itemId, 'itemId')

        }



        // 여기에 더블 클릭 시 실행할 로직을 추가하세요.
    };


    return (
        <div className="ag-theme-quartz" style={{ height: '100%', width: '100%', display:'flex', flexDirection:'column', overflowX:'auto' }}>

            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                <span>LIST</span>
                {funcButtons}
            </div>
            {modalComponent}

            <AgGridReact theme={tableTheme} ref={gridRef}
                         //@ts-ignore
                         style={{ width: '100%', height: '90%' }}
                         onSelectionChanged={handleSelectionChange}
                         onRowDoubleClicked={handleDoubleClicked}
                         onRowValueChanged={handleRowValueChange}
                         //@ts-ignore
                         rowSelection={rowSelection}
                         defaultColDef={defaultColDef}
                         columnDefs={columns}
                         rowData={data}
                         pagination={!!pageInfo}
                         paginationPageSize={pageInfo?.rowperPge}
            />

        </div>
    );
};

export default TableGrid;