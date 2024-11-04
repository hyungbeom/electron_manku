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
                        modalComponent,
                        funcButtons,
                        pageInfo=null
                    }: any) => {

    const gridRef = useRef(null);
    const [data, setData] = useState(tableData);

    useEffect(() => {
        setData([...tableData || []]); // 새로운 배열로 설정
    }, [tableData.length]);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 80,
            filter: 'agNumberColumnFilter',
            floatingFilter: true,
            editable: true,
            valueGetter: (params) => {

                const previousRowData = params?.context?.rowData[params?.node?.rowIndex - 1];
                console.log(previousRowData,':::')
                // return previousRowData ? myCustomFunction(params.data, previousRowData) : params.data.exampleField;
            },

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
                         rowData={data}
                         context={{ data }}
                         pagination={true}/>

        </div>
    );
};

export default TableGrid;