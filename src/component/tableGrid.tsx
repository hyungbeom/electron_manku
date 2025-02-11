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

const TableGrid = ({
                       gridRef,
                       columns,
                       onGridReady = function () {
                       },
                       tempFunc = function () {
                       },
                       type = 'read',
                       funcButtons = [],
                       onCellEditingStopped = function () {
                           let isEditingCell = false;
                       },
                       deleteComp = <></>,
                       setInfo = null,
                       onRowClicked = null
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
                router.push(`/store_update?orderStatusId=${e?.data?.orderStatusId}`);
            if (e.data.projectId)
                router.push(`/project_update?projectId=${e?.data?.projectId}`);
            if (e.data.deliveryId)
                router.push(`/delivery_update?deliveryId=${e?.data?.deliveryId}`);
            if (e.data.remittanceId)
                router.push(`/remittance_domestic_update?remittanceId=${e?.data?.remittanceId}`);
            if (e.data.estimateRequestId)
                router.push(`/rfq_update?estimateRequestId=${e?.data?.estimateRequestId}`);
            if (e.data.estimateId)
                router.push(`/estimate_update?estimateId=${e?.data?.estimateId}`);
            if (e.data.orderId)
                router.push(`/order_update?orderId=${e?.data?.orderId}`);
            if (e.data.remainingQuantity)
                router.push(`/inventory_update?maker=${e?.data?.maker}&model=${e?.data?.model}`);
            if (e.data.makerId)
                router.push(`/maker_update?makerName=${e?.data?.makerName}`);
            if (e.data.agencyId)
                router.push(`/data/agency/domestic/agency_update?agencyCode=${e?.data?.agencyCode}`);
            if (e.data.overseasAgencyId)
                router.push(`/data/agency/overseas/agency_update?agencyCode=${e?.data?.agencyCode}`)
            if (e.data.customerId)
                router.push(`/data/customer/domestic/customer_update?customerCode=${e?.data?.customerCode}`)
            if (e.data.overseasCustomerId)
                router.push(`/data/customer/overseas/customer_update?customerCode=${e?.data?.customerCode}`)
            if (e.data.officialDocumentId)
                router.push(`/code_diploma_update?officialDocumentId=${e?.data?.officialDocumentId}`)
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

        if (e.column.colId === 'actualQuantity' || e.column.colId === 'expectQuantity') {
            const {orderDetailId, actualQuantity, expectQuantity} = e.data;
            console.log(expectQuantity,'expectQuantity:')
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
        // page.event.api.applyTransaction({update : [data]})
        // 그리드 업데이트

        // e.api.applyTransaction({
        //     update: [updatedData],
        // });
    }

    function selectHsCode(info) {
        console.log(info, '::')
        console.log(page, ':page:')

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
            console.log(`🔹 "${headerName}" 열 클릭됨 → 체크박스 토글`);

            // 🔄 현재 체크박스 상태 반전 (on/off)
            const isSelected = rowNode.isSelected();
            rowNode.setSelected(!isSelected);
        }
    };

    return (
        <>
            <HsCodeListModal isModalOpen={isModalOpen['hsCode']} setIsModalOpen={setIsModalOpen}
                             getRows={selectHsCode}/>
            <EstimateListModal isModalOpen={isModalOpen['estimate']} setIsModalOpen={setIsModalOpen}
                               getRows={getSelectedRows}/>
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

            <div>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                    <div style={{fontWeight: 500}}>LIST</div>

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
                    onRowClicked={onRowClicked}
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
                        onCellClicked: onCellClicked,
                        getRowStyle: (params) => {
                            // 짝수 행에만 스타일 적용
                            if (params.node.rowIndex % 2 === 1) {
                                return {backgroundColor: "#f5f5f5"}; // 옅은 갈색
                            }
                            return null; // 기본 스타일 유지
                        },
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