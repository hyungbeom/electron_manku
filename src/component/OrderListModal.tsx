import TableGrid from "@/component/tableGrid";
import {tableOrderReadColumns} from "@/utils/columnList";
import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useRef, useState} from "react";
import {searchOrder} from "@/utils/api/mainApi";
import moment from "moment";
import Button from "antd/lib/button";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";

export default function OrderListModal({isModalOpen, setIsModalOpen, getRows}) {
    const gridRef = useRef(null);

    const [result , setResult] = useState([])

    /**
     *
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchOrder({data: {"searchStartDate": '', "searchEndDate": ''}}).then(v=>{
            gridRef.current.applyTransaction({add: v?.data});
        })

    };


    const handleOk = () => {
        saveTemp()
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        saveTemp()
        setIsModalOpen(false);
    };

    function tempFunc(list){
        setResult(list);
    }

    function saveTemp(){
        if(result.length){
            getData.post('/order/updateOrderQuantities', {orderQuantityItemList: result}).then(v=>{
                if(v.data.code === 1){
                    console.log('예상수량, 실입고 성공')
                }else{
                    message.error('예상수량, 실입고수량 업데이트에 실패하였습니다.')
                }
            })
        }
    }

    return <Modal title="발주서 조회" width={1000}  footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div style={{display : 'grid', height: 500,gridTemplateRows : 'auto 50px'}}>
            <TableGrid
                tempFunc={tempFunc}
                gridRef={gridRef}
                onGridReady={onGridReady}
                columns={[...tableOrderReadColumns, {
                    headerName: '실입고수량',
                    field: 'actualQuantity',
                    cellEditor: 'agNumberCellEditor',
                    minWidth: 80,
                    editable: true
                },{
                    headerName: '예상입고수량',
                    field: 'expectQuantity',
                    cellEditor: 'agNumberCellEditor',
                    minWidth: 80,
                    editable: true
                }]}
                type={'write'}
                funcButtons={null}
            />
        </div>
        <div style={{textAlign: 'right', paddingTop : 10}}>
            <Button type={'primary'} onClick={() => {
                getRows(gridRef);
                handleCancel();
            }}>선택하기</Button>
        </div>
    </Modal>
}