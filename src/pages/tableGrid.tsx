import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz, iconSetMaterial } from '@ag-grid-community/theming';
import {tableOrderReadColumns} from "@/utils/columnList";
import Card from "antd/lib/card/Card";
import {getData} from "@/manage/function/api";


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
                        setDatabase,
                        content,
                        funcButtons,
                        listType,
                        excel = false,
                        pageInfo,
                        setPaginationInfo,
                        setTableInfo,
                        handlePageChange,
                        visible = false,
                        setIsModalOpen = undefined,
                        setItemId = undefined,
                    }: any) => {

    const gridRef = useRef(null);
    const [rowData, setRowData] = useState();

    useEffect(() => {
        setRowData(data)
    }, [rowData]);


    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 80,
            filter: true,
            floatingFilter: true,
            editable: true,
        };
    }, []);


    const getDetailData = async (estimateRequestId) => {

        const result = await getData.post('estimate/getEstimateRequestDetail', {
            estimateRequestId:estimateRequestId
        });
        return result?.data?.entity?.estimateRequestDetail || [];
    }


    const detailCellRendererParams = useMemo(() => ({
        detailGridOptions: {
            columnDefs: [
                { field: "model" },
                { field: "quantity" },
                { field: "unit" },
                { field: "currency" },
                { field: "net" },
                { field: "deliveryDate", minWidth: 150 },
                { field: "content",},
                { field: "replyDate",},
                { field: "remarks",},
            ],
            defaultColDef: { flex: 1 },
        },
        getDetailRowData: async (params) => {
            const detailData = await getDetailData(params.data.estimateRequestId);
            params.successCallback(detailData);
            console.log(detailData);
        },
    }), []);

    //
    // const onGridReady = useCallback((params) => {
    //     fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
    //         .then((resp) => resp.json())
    //         .then((data) => {
    //             setRowData(data);
    //         });
    // }, []);

    const onFirstDataRendered = useCallback((params) => {
        setTimeout(() => {
            params.api.getDisplayedRowAtIndex(1).setExpanded(true);
        }, 0);
    }, []);


    const rowSelection = useMemo(() => {
        return { mode: "multiRow"};
    }, []);

    const statusBar = useMemo(() => {
        return {
            statusPanels: [
                { statusPanel: "agTotalAndFilteredRowCountComponent" },
                { statusPanel: "agTotalRowCountComponent" },
                { statusPanel: "agFilteredRowCountComponent" },
                { statusPanel: "agSelectedRowCountComponent" },
                { statusPanel: "agAggregationComponent" },
            ],
        };
    }, []);


    return (
        <div className="ag-theme-quartz" style={{ height: '100%', width: '100%', display:'flex', flexDirection:'column', overflowX:'auto' }}>

            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                <span>LIST</span>
                {funcButtons}
            </div>


            <AgGridReact theme={tableTheme} ref={gridRef}
                        //@ts-ignore
                        style={{ width: '100%', height: '90%' }}
                         masterDetail={true}
                         detailCellRendererParams={detailCellRendererParams}
                         // onGridReady={onGridReady}
                         onFirstDataRendered={onFirstDataRendered}
                        domLayout="autoHeight"
                        columnDefs={columns}
                        //@ts-ignore
                        rowSelection={rowSelection}
                        rowData={rowData} defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={pageInfo.rowperPge}
                        cacheBlockSize={10}
                         statusBar={statusBar}
            />

        </div>
    );
};

export default TableGrid;