import React, {useEffect, useRef, useState} from "react";
import {gridManage} from "@/utils/commonManage";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableOrderReadColumns} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";

export default function Order({
                                  gridRef = null,
                                  tableData = [],
                                  setTableData = null,
                                  setInfo = null,
                                  customFunc = null}) {

    const isLoad = useRef(null);
    const [totalRow, setTotalRow] = useState(0);

    useEffect(() => {
        if(!isLoad.current) return;
        gridManage.resetData(gridRef, tableData);
        setTotalRow(tableData?.length ?? 0);
    }, [tableData]);

    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: tableData});

        isLoad.current = true;
    };

    /**
     * @description 조회 페이지 테이블 > 선택한 발주서 탭 > 삭제 버튼
     * 송금 > 국내송금 조회
     */
    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 발주서 정보를 선택해주세요.')
        }
        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            orderId: 'orderId',
            orderDetailId: 'orderDetailId'
        });
        const filterSelectList = tableData.filter(selectOrder =>
            !deleteList.some(deleteItem => deleteItem.orderDetailId === selectOrder.orderDetailId)
        );
        setTableData(filterSelectList);

        // 삭제 후 총액 계산
        const total = filterSelectList.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity);
            const unitPrice = parseFloat(row.unitPrice);
            const q = isNaN(quantity) ? 0 : quantity;
            const p = isNaN(unitPrice) ? 0 : unitPrice;
            return sum + q * p;
        }, 0);

        // Inquiry No. 정리
        const connectInquiryNos = [];
        for (const item of filterSelectList || []) {
            const inquiryNo = item.documentNumberFull;
            if (inquiryNo && !connectInquiryNos.includes(inquiryNo)) {
                connectInquiryNos.push(inquiryNo);
            }
        }
        // 항목 번호 정리
        const orderDetailIds = filterSelectList.map(row => row.orderDetailId).join(', ');

        setInfo(prevInfo => {
            const prevPartialRemittance = prevInfo.partialRemittance || 0;
            const partialRemittance = typeof prevPartialRemittance === "string"
                ? parseFloat(prevPartialRemittance.replace(/,/g, '')) || 0
                : prevPartialRemittance;

            const balance= total - partialRemittance;
            console.log(total.toLocaleString())
            console.log(balance.toLocaleString())
            return {
                ...prevInfo,
                customerName: filterSelectList[0].customerName,
                agencyName: filterSelectList[0].agencyName,
                connectInquiryNo: connectInquiryNos.join(', '),
                orderDetailIds,
                totalAmount: total.toLocaleString(),
                balance: balance.toLocaleString(),
            }
        });
    }

    /**
     * 선택한 발주서 항목 > 더블 클릭 이벤트
     * CustomFunc로 부모에서 처리
     * (상세 조회 > folderId, fileList 받아옴)
     * @param orderDetail
     */
    function returnFunc(orderDetail) {
        customFunc(orderDetail);
    }

    return (
        <>
            <TableGrid
                deleteComp={
                    <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={confirm}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                            <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                        </Button>
                    </Popconfirm>
                }
                totalRow={totalRow}
                gridRef={gridRef}
                columns={tableOrderReadColumns}
                onGridReady={onGridReady}
                type={'DRWrite'}
                tempFunc={returnFunc}
                funcButtons={['agPrint']}
            />
        </>
    );
}