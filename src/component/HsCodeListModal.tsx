import TableGrid from "@/component/tableGrid";
import {
    subTableCodeReadColumns,
    tableCodeReadColumns,
    tableEstimateReadColumns,
    tableOrderReadColumns
} from "@/utils/columnList";
import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useRef, useState} from "react";
import {searchEstimate, searchOrder} from "@/utils/api/mainApi";
import moment from "moment";
import Button from "antd/lib/button";
import {getData} from "@/manage/function/api";
import {gridManage} from "@/utils/commonManage";

export default function HsCodeListModal({isModalOpen, setIsModalOpen, getRows}) {
    const gridRef = useRef(null);

    /**
     *
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        gridRef.current = params.api;

        const data = await getData.post('hsCode/getHsCodeList', {
            searchText: '',
            page: 1,
            limit: -1
        });

        gridRef.current.applyTransaction({add: data.data.entity.hsCodeList});
    };


    const handleOk = () => {
        setIsModalOpen(v=>{return {...v, hsCode : false} });
    };

    const handleCancel = () => {
        setIsModalOpen(v=>{return {...v, hsCode : false} });
    };


    function onRowClicked(e){
        getRows(e.data);
        handleCancel();
    }

    return <Modal title={'HS-CODE 조회'} width={1000} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

        <div style={{display : 'grid', gridTemplateRows : '450px auto'}}>
            <TableGrid
                gridRef={gridRef}
                onGridReady={onGridReady}
                columns={subTableCodeReadColumns}
                onRowClicked={onRowClicked}
                type={'read'}
                funcButtons={null}
            />
            <div style={{textAlign: 'right', marginTop: 60}}>
            </div>
        </div>
    </Modal>
}