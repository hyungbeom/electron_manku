// @ts-nocheck

import React, {useEffect, useMemo, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {iconSetMaterial, themeQuartz} from '@ag-grid-community/theming';
import {useRouter} from "next/router";
import {tableTheme} from "@/utils/common";
import moment from "moment";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {codeDomesticAgencyWriteInitial} from "@/utils/initialList";


const TableGrid = ({
                       columns, tableData,
                       setSelectedRows,
                       setInfo,
                       modalComponent,
                       funcButtons,
                       listType = 'estimateRequestId',
                       listDetailType = 'estimateRequestDetailList',
                       type='read',
                       setIsModalOpen = undefined,
                       setItemId = undefined,
                       gridRef
                   }: any) => {


    const router = useRouter();

    const [data, setData] = useState(tableData);


    useEffect(()=>{
        setData(tableData)
    },[tableData])


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


                    // console.log(params.data[listType],'params.data[listType]:')
                    // console.log(previousRowData,'params.data[listType]22:')

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
        return {mode: "multiRow",};
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

    const handleRowSelected = (e) => {
        if(type === 'write'){
            return false;
        }
        if (isUpdatingSelection) return; // 중복 선택 이벤트 발생 시 종료
        isUpdatingSelection = true;

        // console.log(e, 'handleSelectionChange')
        const currentRowData = e.node.data;
        const currentDocumentNumber = currentRowData.documentNumberFull;
        const isCurrentlySelected = e.node.isSelected();
        const api = e.api;


        isUpdatingSelection = false; // 선택 업데이트 종료

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
                router.push(`/maker_update?makerId=${e?.data?.makerId}`)
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

            <AgGridReact theme={tableTheme} ref={gridRef} containerStyle={{width: '100%', height: '84%'}}
                        //@ts-ignore
                         onRowDoubleClicked={handleDoubleClicked}
                        //@ts-ignore
                         rowSelection={rowSelection}
                         defaultColDef={defaultColDef}
                         columnDefs={columns}
                         rowData={[...data]}
                         context={{data}}
                         pagination={true}
                         onRowSelected={handleRowSelected}
                         onCellValueChanged={dataChange}
                         gridOptions={{
                             loadThemeGoogleFonts: true,
                         }}
            />
        </div>
    );
};
export default TableGrid;