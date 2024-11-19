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

                if(copyData['estimateRequestDetailList']) {
                    copyData['estimateRequestDetailList'] = copyData['estimateRequestDetailList'].map(v => ({
                        ...v,
                        replyDate: moment(item.replyDate).format('YYYY-MM-DD')}))
                }

                if(copyData['estimateDetailList']) {
                    copyData['estimateDetailList'][e.node.rowIndex].amount =
                        copyData['estimateDetailList'][e.node.rowIndex].quantity*copyData['estimateDetailList'][e.node.rowIndex].unitPrice
                }

                if(copyData['estimateDetailList']) {
                    copyData['estimateDetailList'][e.node.rowIndex].amount =
                        copyData['estimateDetailList'][e.node.rowIndex].quantity*copyData['estimateDetailList'][e.node.rowIndex].unitPrice
                }

                if(copyData['orderDetailList']) {
                    copyData['orderDetailList'][e.node.rowIndex].unreceivedQuantity =
                        copyData['orderDetailList'][e.node.rowIndex].quantity-copyData['orderDetailList'][e.node.rowIndex].receivedQuantity
                }

                return copyData
            })
            console.log("업데이트된 데이터:", updatedData);
        }
    }

    const handleFile = (file) => {

        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, {type: 'binary'});

            // 첫 번째 시트 선택
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // 데이터를 JSON 형식으로 변환 (첫 번째 행을 컬럼 키로 사용)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

            // 데이터 첫 번째 행을 컬럼 이름으로 사용
            const headers = jsonData[0];
            const dataRows = jsonData.slice(1);


            // 테이블 데이터 설정 (컬럼 키를 사용)
            const tableData = dataRows.map((row, index): any => {
                const rowData = {};
                // @ts-ignored
                row?.forEach((cell, cellIndex) => {
                    rowData[headers[cellIndex]] = cell; // 컬럼 키를 사용하여 데이터 설정
                });
                return {key: index, ...rowData};
            });

            setInfo(v => {
                const copyData = {...v};
                copyData[listType] = tableData;
                return copyData
            })

        };

        reader.readAsBinaryString(file);
    };

    const uploadProps = {
        name: 'file',
        accept: '.xlsx, .xls',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';

            if (!isExcel) {
                message.error('엑셀 파일만 업로드 가능합니다.');
                return Upload.LIST_IGNORE;
            }

            // 파일 읽기
            handleFile(file);

            // false를 반환하여 업로드 방지 (자동 업로드 차단)
            return false;
        },
    };


    return (
        <div className="ag-theme-quartz"
             style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflowX: 'auto'}}>

            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                <div>LIST</div>
                <div style={{float:'right'}}>
                    <Dragger {...uploadProps}>
                        <div>
                            <InboxOutlined style={{ width: 20, color: 'blue' }} />
                            <span className="ant-upload-text"> 클릭 또는 드래그하여 업로드</span>
                        </div>
                    </Dragger>
                {funcButtons}
                </div>
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