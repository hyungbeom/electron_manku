// @ts-nocheck

import React, {useMemo, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {useRouter} from "next/router";
import {tableTheme} from "@/utils/common";

import {commonFunc} from "@/utils/commonManage";
import useEventListener from "@/utils/common/function/UseEventListener";
import EstimateListModal from "@/component/EstimateListModal";
import {tableButtonList} from "@/utils/commonForm";
import {CopyOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import AgencyListModal from "@/component/AgencyListModal";

const TableGrid = ({
                       gridRef,
                       columns,
                       onGridReady = function () {
                       },
                       type = 'read',
                       funcButtons = [],
                       onCellEditingStopped = null,
                       deleteComp = <></>
                   }: any) => {


    const router = useRouter();

    const [dragging, setDragging] = useState(false);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);
    const [page, setPage] = useState({x: null, y: null, field: null, event: null})
    const [isModalOpen, setIsModalOpen] = useState({estimate : false, agency : false});
    const ref = useRef(null);


    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 80,
            filter: true,
            floatingFilter: true,
            checkboxSelection: false, // 기본적으로 체크박스 비활성화
        };
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


    const option = 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no'
    const openType = '_blank'
    const handleDoubleClicked = (e) => {

        if (type === 'read') {
            if (e.data.orderStatusId)

            window.open(`/store_update?orderStatusId=${e?.data?.orderStatusId}`, openType, option);
            if (e.data.projectId)
                window.open(`/project_update?projectId=${e?.data?.projectId}`, openType, option);
            if (e.data.deliveryId)
                window.open(`/delivery_update?deliveryId=${e?.data?.deliveryId}`, openType, option);
            if (e.data.remittanceId)
                window.open(`/remittance_domestic_update?remittanceId=${e?.data?.remittanceId}`, openType, option);
            if (e.data.estimateRequestId)
                window.open(`/rfq_update?estimateRequestId=${e?.data?.estimateRequestId}`, openType, option);
            if (e.data.estimateId)
                window.open(`/estimate_update?estimateId=${e?.data?.estimateId}`, openType, 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
            if (e.data.orderId)
                window.open(`/order_update?orderId=${e?.data?.orderId}`, openType, 'width=1200,height=900,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
            if (e.data.remainingQuantity)
                window.open(`/inventory_update?maker=${e?.data?.maker}&model=${e?.data?.model}`, openType, option);
            if (e.data.makerId)
                window.open(`/maker_update?makerName=${e?.data?.makerName}`, openType, option);
            if (e.data.agencyId)
                window.open(`/data/agency/domestic/agency_update?agencyCode=${e?.data?.agencyCode}`, openType, option);
            if (e.data.overseasAgencyId)
                window.open(`/data/agency/overseas/agency_update?agencyCode=${e?.data?.agencyCode}`, openType, option);
            if (e.data.customerId)
                window.open(`/data/customer/domestic/customer_update?customerCode=${e?.data?.customerCode}`, openType, option);
            if (e.data.overseasCustomerId)

                window.open(`/data/customer/overseas/customer_update?customerCode=${e?.data?.customerCode}`, openType, option);
            if (e.data.officialDocumentId)

                window.open(`/code_diploma_update?officialDocumentId=${e?.data?.officialDocumentId}`, openType, option);
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
        clickRowCheck(e.api);
        handleSelectionChanged();
    }


    const handleCellRightClick = (e) => {
        if (e.event) {
            e.event.preventDefault(); // 기본 컨텍스트 메뉴 막기
        }

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


    function
    getSelectedRows(ref) {
        if (ref.current) {
            const selectedRows = ref.current.getSelectedRows();

            if (selectedRows.length) {
                const list = selectedRows.map(v => {
                    return {
                        ...v,
                        connectInquiryNo: v.documentNumberFull,
                        currencyUnit: v.currency,
                        spec: v.unit,
                        agencyManagerPhone: v.agencyManagerPhoneNumber
                    }
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


    function getAgencyInfo(data){

        if(page.event.node){
            let selectedRow = page.event.node.data;
            selectedRow['agencyName'] = data.agencyName
            selectedRow['agencyManagerName'] = data.managerName
            selectedRow['agencyManagerPhone'] = data.phoneNumber
            selectedRow['agencyManagerEmail'] = data.email
            page.event.api.applyTransaction({
                update: [selectedRow],
            });
        }
        // page.event.api.applyTransaction({update : [data]})
        // 그리드 업데이트

        // e.api.applyTransaction({
        //     update: [updatedData],
        // });
    }

    return (
        <>
            <EstimateListModal isModalOpen={isModalOpen['estimate']} setIsModalOpen={setIsModalOpen} getRows={getSelectedRows}/>
            <AgencyListModal isModalOpen={isModalOpen['agency']} setIsModalOpen={setIsModalOpen} getRows={getAgencyInfo}/>
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
                    setIsModalOpen(v=>{return {...v, estimate : true} });
                }} id={'right'} style={{backgroundColor: 'lightgray', padding: 3}}>견적 Inquiry조회
                </div> : <></>}
                {page.field.includes('agency') ? <div onClick={() => {
                    setPage(v => {
                        return {...v, x: null, y: null}
                    });
                    setIsModalOpen(v=>{return {...v, agency : true} });
                }} id={'right'} style={{backgroundColor: 'lightgray', padding: 3}}>매입처 조회
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

            <div>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                    <div style={{fontWeight: 500}}>LIST</div>

                    <div style={{display: 'flex', alignItems: 'end', gap: 7}}>
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                onClick={()=>{
                                    gridRef?.current?.setFilterModel(null)
                                }}>
                            <CopyOutlined/>필터 초기화
                        </Button>
                        {deleteComp}
                        {funcButtons?.map(v => tableButtonList(v, gridRef))}
                    </div>

                </div>

                <AgGridReact
                    onGridReady={onGridReady}
                    theme={tableTheme} ref={gridRef}
                    //@ts-ignore
                    onRowDoubleClicked={handleDoubleClicked}
                    rowSelection="multiple"
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
                        getRowStyle: (params) => {
                            // 짝수 행에만 스타일 적용
                            if (params.node.rowIndex % 2 === 1) {
                                return {backgroundColor: "#f5f5f5"}; // 옅은 갈색
                            }
                            return null; // 기본 스타일 유지
                        },
                    }}
                    rowDragManaged={true}
                    rowDragMultiRow={true}
                    suppressRowClickSelection={true}
                />
            </div>
        </>
    );
};
export default React.memo(TableGrid);