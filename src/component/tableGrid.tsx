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
                        columns, data,
                        // tableData,
                        // setTableData,
                        setDatabase,
                        modalComponent,
                        funcButtons,
                        listType,
                        excel = false,
                        pageInfo=null,
                        setPaginationInfo,
                        setTableInfo,
                        handlePageChange,
                        visible = false,
                        setIsModalOpen = undefined,
                        setItemId = undefined,
                    }: any) => {

    const gridRef = useRef(null);
    const [tableData, setInfo] = useState();

    useEffect(() => {
        setInfo(data)
        console.log(data, '~!~DSDSAFSDGFDS')
    }, [data]);


    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 80,
            filter: true,
            floatingFilter: true,
            editable: true,
        };
    }, []);


    const rowSelection = useMemo(() => {
        return { mode: "multiRow"};
    }, []);

    const handleSelectionChange = (e) => {
        console.log(e)
    }

    const handleRowValueChange = (e) => {
        console.log(e.api.getEdit)

    }


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
                         onRowValueChanged={handleRowValueChange}
                         //@ts-ignore
                         rowSelection={rowSelection}
                         defaultColDef={defaultColDef}
                         columnDefs={columns}
                         tableData={tableData}
                         pagination={!!pageInfo}
                         paginationPageSize={pageInfo?.rowperPge}
                         cacheBlockSize={10}
            />

        </div>
    );
};

export default TableGrid;