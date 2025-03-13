import TableGrid from "@/component/tableGrid";
import {tableEstimateReadColumns, tableOrderReadColumns} from "@/utils/columnList";
import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useRef, useState} from "react";
import {searchEstimate, searchOrder} from "@/utils/api/mainApi";
import moment from "moment";
import Button from "antd/lib/button";
import {rangePickerForm} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";

export default function EstimateListModal({isModalOpen, setIsModalOpen, getRows}) {
    const gridRef = useRef(null);

    const [info, setInfo] = useState({searchDate: [moment().subtract(6, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]})
    /**
     *
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        gridRef.current = params.api;
        const data = await searchEstimate({
            data: {
                searchStartDate: info['searchDate'][0],
                searchEndDate: info['searchDate'][1]
            }
        });
        gridRef.current.applyTransaction({add: data.data});
    };


    const handleOk = () => {
        setIsModalOpen(v => {
            return {...v, estimate: false}
        });
    };

    const handleCancel = () => {
        setIsModalOpen(v => {
            return {...v, estimate: false}
        });
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function search() {
        await searchEstimate({
            data: {
                searchStartDate: info['searchStartDate'],
                searchEndDate: info['searchEndDate']
            }
        }).then(v => {
            gridRef.current.applyTransaction({add: v.data});

        })

    }

    return <Modal title="견적서 조회" width={1000} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div style={{display: 'flex', alignItems: 'end'}}>
            {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info})}
            <Button size={'small'} style={{marginBottom: 10, marginLeft: 10, width: 80}} type={'primary'}
                    onClick={search}>조회</Button>
        </div>
        <div style={{display: 'grid', gridTemplateRows: '450px auto'}}>
            <TableGrid
                gridRef={gridRef}
                onGridReady={onGridReady}
                columns={tableEstimateReadColumns}
                type={'write'}
                funcButtons={null}
            />
            <div style={{textAlign: 'right', marginTop: 60}}>
                <Button type={'primary'} onClick={() => {
                    getRows(gridRef)
                    handleCancel();
                }}>선택하기</Button>
            </div>
        </div>
    </Modal>
}