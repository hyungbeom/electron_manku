import React, {memo, useEffect, useRef, useState} from "react";
import {gridManage} from "@/utils/commonManage";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {formatAmount, tableOrderReadColumns, tableSelectOrderReadColumns} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import _ from "lodash";

function Order({
                                  gridRef = null,
                                  tableData = [],
                                  setTableData = null,
                                  setInfo = null,
                                  customFunc = null,
                                  type = ''}) {

    const [totalRow, setTotalRow] = useState(0);
    const isGridLoad = useRef(null);

    useEffect(() => {
        if(!isGridLoad.current) return;
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
        isGridLoad.current = true;
    };

    /**
     * @description 조회 페이지 테이블 > 선택한 발주서 탭 > 삭제 버튼
     * 송금 > 국내송금 조회
     */
    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 발주서 정보를 선택해주세요.');
        }
        const deleteList = gridManage.getFieldDeleteList(gridRef, {orderDetailId: 'orderDetailId'});
        const filterSelectList = tableData.filter(selectOrder =>
            !deleteList.some(deleteItem => deleteItem.orderDetailId === Number(selectOrder.orderDetailId))
        );
        setTableData(filterSelectList);

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

        // 발주서 총액 계산
        const total = filterSelectList.reduce((sum, row) => sum + ((Number(row.quantity) || 0) * (Number(row.unitPrice) || 0)), 0);
        let totalAmount = 0;
        if (type === 'overseas') {
            totalAmount = total;
        } else {
            totalAmount = total + (total * 0.1 * 10 / 10);
        }

        // KRW 있는지 (소수점 처리를위한 flag)
        const hasKRW = filterSelectList.some(row => !row.currency || row.currency === 'KRW');
        const currency = hasKRW ? 'KRW' : 'USD';

        setInfo(prevInfo => {
            const partialRemittance = Number(String(prevInfo.partialRemittance || '0').replace(/,/g, ''));
            const balance= totalAmount - partialRemittance;
            return {
                ...prevInfo,
                customerName: filterSelectList?.[0]?.customerName || '',
                agencyName: filterSelectList?.[0]?.agencyName || '',
                connectInquiryNo: connectInquiryNos.join(', '),
                orderDetailIds,
                totalAmount: formatAmount(totalAmount, currency),
                balance: formatAmount(balance, currency),
            }
        });
    }

    /**
     * 선택한 발주서 항목 > 더블 클릭 이벤트
     * CustomFunc로 부모에서 처리
     * (Inquiry No. 조회 > SharePoint 폴더 체크 > 없으면 폴더 생성 > folderId, fileList 받아옴)
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
                columns={tableSelectOrderReadColumns}
                onGridReady={onGridReady}
                customType={'Remittance'}
                tempFunc={returnFunc}
                funcButtons={['agPrint']}
            />
        </>
    );
}

export default memo(Order, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});