// @ts-nocheck

import React, {useMemo, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {useRouter} from "next/router";
import {tableTheme} from "@/utils/common";

import {commonFunc, gridManage} from "@/utils/commonManage";
import useEventListener from "@/utils/common/function/UseEventListener";
import EstimateListModal from "@/component/EstimateListModal";
import {tableButtonList} from "@/utils/commonForm";
import {CopyOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import AgencyListModal from "@/component/AgencyListModal";
import HsCodeListModal from "@/component/HsCodeListModal";
import _ from "lodash";
import moment from "moment";

const TableGrid = ({
                       gridRef,
                       columns,
                       getRowInfo = null,
                       onGridReady = function () {
                       },
                       tempFunc = function () {
                       },
                       updateFunc = function () {
                       },
                       type = 'read',
                       customType = '',
                       funcButtons = [],
                       onCellEditingStopped = function () {
                           let isEditingCell = false;
                       },
                       deleteComp = <></>,
                       setInfo = null,
                       getPropertyId = null,
                       totalRow = 0,
                       reply = false
                   }: any) => {


    const router = useRouter();
    let isEditingCell = false;

    const [dragging, setDragging] = useState(false);
    const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);
    const [page, setPage] = useState({x: null, y: null, field: null, event: null})
    const [isModalOpen, setIsModalOpen] = useState({estimate: false, agency: false});
    const [exQuantity, setExQuantity] = useState([]);

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
        if (type === 'write' && !customType) {
            return false; // 'write' 타입일 경우 아무 작업도 하지 않음
        }

        const selectedNode = event.node; // 현재 선택된 노드
        const selectedData = selectedNode.data; // 선택된 데이터

        const includeKeys = ['Remittance', 'TaxRead', 'Tax', 'TaxUpdate', 'SourceWrite', 'SourceUpdate'];
        // documentNumberFull 필드가 없고 커스텀타입이 없거나 커스텀 제외 목록이 아니면 패스
        if (!selectedData?.documentNumberFull && !customType || includeKeys.includes(customType)) {
            return;
        }


        let groupValueKey = 'documentNumberFull';

        if(customType === 'storeRead'){
            groupValueKey = 'inboundId'
        }


        if (customType === 'DRRead' || customType === 'ORRead') groupValueKey = 'remittanceId';

        const groupValue = selectedData?.[groupValueKey];
        const rowIndex = selectedNode.rowIndex;
        const previousData = event.api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.[groupValueKey];

        // 이전 데이터와 그룹 값이 다를 때만 처리
        if (!previousData || previousData !== groupValue) {
            const isSelected = selectedNode.isSelected();

            // 동일한 groupValue를 가진 행들만 선택 상태 변경
            event.api.forEachNode((node) => {
                if (node.data?.[groupValueKey] === groupValue) {
                    node.setSelected(isSelected);
                }
            });
        }
    };


    const handleDoubleClicked = (e) => {
        console.log(type,'::type::')
        console.log(customType,'::customType::')
        console.log(e.data,'::data::')
        if (type === 'read') {

            if (customType === 'Remittance' ) {
                tempFunc(e.data);
                return;
            }
            if (e.data.projectId) { // 프로젝트 수정
                getPropertyId('project_update', e.data.projectId)
            }
            if (e.data.estimateRequestId) { // 견적의뢰 수정
                getPropertyId('rfq_update', e.data.estimateRequestId)
            }
            if (e.data.estimateId) { // 견적서 수정
                getPropertyId('estimate_update', e.data.estimateId)
            }
            if (customType === 'order') { // 발주서 수정
               return getPropertyId('order_update', e.data.orderId)
            }
            if (e.data.orderStatusId) { // 입고 수정
                getPropertyId('store_update', e.data.orderStatusId)
            }
            if (e.data.deliveryId) { // 배송 수정
                getPropertyId('delivery_update', e.data.deliveryId)
            }
            if (e.data.remittanceId) { // 송금 수정
                switch (customType) {
                    case 'DRRead': getPropertyId('domestic_remittance_update', e.data.remittanceId)
                        break;
                    case 'ORRead': getPropertyId('overseas_remittance_update', e.data.remittanceId)
                        break;
                }
            }
            if (e.data.invoiceId) { // 세금계산서 발행 수정
                getPropertyId('tax_invoice_update', e.data.invoiceId)
            }
            if (e.data.inboundId) { // 세금계산서 발행 수정
                getPropertyId('store_update', e.data.inboundId)
            }
            if (e.data.agencyId) { // 국내 매입처 수정
                getPropertyId('domestic_agency_update', e.data.agencyId)
            }
            if (e.data.overseasAgencyId) // 해외 매입처 수정
                getPropertyId('overseas_agency_update', e.data.overseasAgencyId)
            if (e.data.customerId) // 국내 고객사 수정
                getPropertyId('domestic_customer_update', e.data.customerId)
            if (e.data.overseasCustomerId) { // 해외 고객사 수정
                getPropertyId('overseas_customer_update', e.data.overseasCustomerId)
            }
            if (e.data.makerId){ // 메이커 수정
                getPropertyId('maker_update', e.data.makerId)
            }
            if (e.data.companyAccountId) { // 회사 계정 수정
                getPropertyId('company_account_update', e.data.companyAccountId)
            }
            if (e.data.inventoryId) { // 재고 수정
                switch (customType) {
                    case 'SourceWrite':
                        break;
                    case 'SourceUpdate': tempFunc(e.data);
                        break;
                    default:
                        getPropertyId('source_update', e.data.inventoryId);
                        break;
                }
            }
            if (e.data.officialDocumentId) {
                getPropertyId('code_diploma_update', e.data.officialDocumentId)
            }
        }
        if (type === 'hsCode') {
            setInfo(e.data);
            tempFunc(true);
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

        // updateFunc
        const { data, colDef, newValue } = e;

        if(customType === 'inbound'){
            if (colDef.field === 'saleAmount' ) {
                data.saleTaxAmount = parseFloat(data.saleAmount) * 1.1;
            }

            if (colDef.field === 'amount' || colDef.field === 'exchange' ) {
                data.krw = parseFloat(data.amount) * parseFloat(data.exchange);
            }

            e.api.applyTransaction({ update: [data] });
            updateFunc();
        }

        if(customType === 'Tax' ){

            updateFunc(e.data)
        }

        if (e.column.colId === 'actualQuantity' || e.column.colId === 'expectQuantity') {
            const {orderDetailId, actualQuantity, expectQuantity} = e.data;

            const copyData = _.cloneDeep(exQuantity);
            const findObj = copyData.find(v => v.orderDetailId === orderDetailId)

            let result = []
            if (findObj) {
                result = copyData.map(src => {
                    if (src.orderDetailId === orderDetailId) {
                        return {
                            "orderDetailId": orderDetailId,
                            "expectedQuantity": expectQuantity ? expectQuantity : 0,
                            "actualQuantity": actualQuantity ? actualQuantity : 0
                        }
                    } else {
                        return src
                    }
                });
            } else {

                result = [...copyData, {
                    "orderDetailId": orderDetailId,
                    "expectQuantity": expectQuantity ? expectQuantity : 0,
                    "actualQuantity": actualQuantity ? actualQuantity : 0
                }]

            }
            setExQuantity(result)
            tempFunc(result)
        }

        handleSelectionChanged();
        if (setInfo) {
            setInfo(v => {
                return {...v, count: v.count + 1}
            })
        }
    }


    const handleCellRightClick = (e) => {
        if (e.event) {
            e.event.preventDefault(); // 기본 컨텍스트 메뉴 막기
        }

        const {clientX, clientY} = e.event;
        e.event.preventDefault();
        setPage({x: clientX, y: clientY, field: e.column.getId(), event: e})
    }


    /**
     * total 행이 필요 없는 컴포넌트에 적용하려고 추가
     * 선택된 row의 해당 key가 있으면 total 행 추가
     * (사용처: 견적의뢰, 견적서, 발주서 등)
     */
    const includeKeys = ['estimateRequestId', 'estimateId', 'orderId', 'orderStatusId'];
    const excludedTypes = ['delivery', 'Remittance', 'SourceWrite', 'SourceUpdate'];
    const containsIncludeKey = (list) => {
        const firstRow = list?.[0];
        if (!firstRow) return false;
        return includeKeys.some(key => key in firstRow);
    };
    const handleSelectionChanged = () => {
        if (excludedTypes.includes(customType)) return;

        const selectedRows = gridRef.current.getSelectedRows(); // 체크된 행 가져오기

        if (!selectedRows.length || !containsIncludeKey(selectedRows)) {
            setPinnedBottomRowData([]);
            return;
        }
        const totals = commonFunc.sumCalc(selectedRows);
        console.log(selectedRows,'selectedRows:')
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


    function getSelectedRows(ref) {
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

    function getAgencyInfo(data) {
        if (page.event.node) {
            let selectedRow = page.event.node.data;
            selectedRow['agencyName'] = data.agencyName
            selectedRow['agencyManagerName'] = data.managerName
            selectedRow['agencyManagerPhone'] = data.phoneNumber
            selectedRow['agencyManagerEmail'] = data.email
            page.event.api.applyTransaction({
                update: [selectedRow],
            });
        }
    }

    function selectHsCode(info) {
        let selectedRow = page.event.node.data;
        selectedRow['hsCode'] = info.hsCode

        page.event.api.applyTransaction({
            update: [selectedRow],
        });
    }

    const onCellClicked = (event) => {
        const headerName = event.column.getColDef().headerName || ''; // 🔍 현재 셀의 헤더 가져오기
        const rowNode = event.node; // 🔍 현재 선택된 행 가져오기

        if (headerName === '') {


            // 🔄 현재 체크박스 상태 반전 (on/off)
            const isSelected = rowNode.isSelected();
            rowNode.setSelected(!isSelected);
        }
    };

    function cellDoubleClick(event){
        const field = event.colDef.field;
        if(type === 'write'){

            // 송금, 세금계산서 등록/수정시 하단에 선택한 발주서 항목 더블클릭
            if ( customType === 'Tax') {
                if(field === 'quantity'|| field === 'unitPrice' || field === 'net'){

                }else{
                    tempFunc(event.data);
                }

                return;
            }


            if(event.column.getId() === 'content'){

                const rowNode = event.node;

                if (rowNode) {
                    gridRef.current.stopEditing();

                    // 직접 cellEditor 값을 설정
                    rowNode.setDataValue(field, "회신");
                    rowNode.setDataValue('replyDate', moment().format('YYYY-MM-DD'));


                    gridRef.current.startEditingCell({
                        rowIndex: event.rowIndex,
                        colKey: field
                    });
                }
            }
        }
    }

    function isRowSelectable(rowNode){
        return rowNode.displayed;
    }

    function onRowClicked(params){
        const isSelected = params.node.isSelected(); // 현재 선택 상태 확인
        params.node.setSelected(!isSelected); // 선택 상태 변경 (토글)

        if(getRowInfo){
            getRowInfo(params?.data)
        }
    }

    return (
        <>
            <HsCodeListModal isModalOpen={isModalOpen['hsCode']} setIsModalOpen={setIsModalOpen}
                             getRows={selectHsCode}/>
            <EstimateListModal isModalOpen={isModalOpen['estimate']} setIsModalOpen={setIsModalOpen}
                               getRows={getSelectedRows} />
            <AgencyListModal isModalOpen={isModalOpen['agency']} setIsModalOpen={setIsModalOpen}
                             getRows={getAgencyInfo}/>
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
                {page.field === 'hsCode' ? <div onClick={() => {
                    setPage(v => {
                        return {...v, x: null, y: null}
                    });
                    setIsModalOpen(v => {
                        return {...v, hsCode: true}
                    });
                }} id={'right'} style={{backgroundColor: 'lightgray', padding: 3}}>HS-CODE 조회
                </div> : <></>}
                {page.field === 'connectInquiryNo' ? <div onClick={() => {
                    setPage(v => {
                        return {...v, x: null, y: null}
                    });
                    setIsModalOpen(v => {
                        return {...v, estimate: true}
                    });
                }} id={'right'} style={{backgroundColor: 'lightgray', padding: 3}}>견적 Inquiry조회
                </div> : <></>}
                {page.field.includes('agency') ? <div onClick={() => {
                    setPage(v => {
                        return {...v, x: null, y: null}
                    });
                    setIsModalOpen(v => {
                        return {...v, agency: true}
                    });
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

            <div style={{height: '100%'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', padding : '15px 0px 5px 0px'}}>
                    {/*<div style={{fontWeight: 500, paddingLeft : 3}}>{type === 'read' ?<span style={{fontSize: 12}}>검색결과 (<span*/}
                    {/*    style={{color: 'orangered'}}>{totalRow}</span> 건)</span> : <></>}</div>*/}
                    <div style={{fontWeight: 500, paddingLeft : 3}}><span style={{fontSize: 12}}>검색결과 (<span
                        style={{color: 'orangered'}}>{totalRow}</span> 건)</span></div>

                    <div style={{display: 'flex', alignItems: 'end', gap: 7}}>
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                onClick={() => {
                                    gridRef?.current?.setFilterModel(null)
                                }}>
                            <CopyOutlined/>필터 초기화
                        </Button>
                        {deleteComp}
                        {funcButtons?.map(v => tableButtonList(v, gridRef))}
                    </div>

                </div>

                <AgGridReact
                    style={{height: '100%'}}
                    domLayout="normal"  // 🔥 이게 핵심!
                    onRowClicked={onRowClicked}
                    onGridReady={onGridReady}
                    theme={tableTheme} ref={gridRef}
                    //@ts-ignore
                    onRowDoubleClicked={handleDoubleClicked}
                    onCellDoubleClicked={cellDoubleClick}
                    rowSelection="multiple"
                    onCellEditingStopped={onCellEditingStopped}
                    defaultColDef={defaultColDef}
                    columnDefs={columns}
                    onCellContextMenu={handleCellRightClick}
                    isRowSelectable={isRowSelectable}
                    // paginationPageSize={1000}
                    // paginationPageSizeSelector={[100, 500, 1000]}
                    // pagination={true}
                    onRowSelected={handleRowSelected}
                    onCellValueChanged={dataChange}
                    pinnedBottomRowData={pinnedBottomRowData}
                    onSelectionChanged={handleSelectionChanged} // 선택된 행 변경 이벤트
                    onModelUpdated={(params) => { // 데이터 변경시
                        if (customType === 'Remittance' || customType === 'Tax') {
                            const allData = [];
                            params.api.forEachNode(node => allData.push(node.data));
                            if (allData?.length) setPinnedBottomRowData([commonFunc.sumCalc(allData)]);
                        }
                    }}
                    // getRowStyle={(params) => {
                    //     if (params.data?.replyStatus === 1 && reply) {
                    //         return { color: 'blue'}; // 글씨 색상 변경
                    //     }
                    //     return null;
                    // }}
                    gridOptions={{
                        loadThemeGoogleFonts: true,
                        onCellClicked: onCellClicked,
                        onCellValueChanged: (event) => {
                            if (setInfo) {
                                setInfo(v => {
                                    return {...v, count: v.count + 1}
                                })
                            }
                        },
                        onRowDataUpdated: () => {

                            if (setInfo) {
                                setInfo(v => {
                                    return {...v, count: v.count + 1}
                                })
                            }
                        },
                        onRowDataChanged: () => {
                            console.log("Row Data Changed");
                        },

                        onCellKeyDown: (event) => {
                            const isEditingCell = event.api.getEditingCells().length > 0;
                            const selectedNodes = event.node;
                            const headerName = event.column.getColDef().headerName || ''; // 🔍 헤더 이름 가져오기

                            if (!isEditingCell) {
                                if (event.event.key === 'Backspace' || event.event.key === 'Delete') {
                                    // 🔥 조건: 헤더가 빈 문자열(`''`)일 때만 삭제 실행
                                    if (headerName !== '') {
                                        return; // 삭제 중단
                                    }
                                    event.api.applyTransaction({remove: [selectedNodes.data]});
                                }
                            }
                        }
                    }}
                    rowDragManaged={true}
                    rowDragMultiRow={true}
                    suppressDragLeaveHidesColumns={true} // ✅ 컬럼이 드래그로 삭제되지 않도록 방지
                    suppressColumnMoveOutOfContainer={true} // ✅ 컬럼이 밖으로 나가지 않도록 방지
                    suppressRowClickSelection={true}
                />
            </div>
        </>
    );
};
export default React.memo(TableGrid);