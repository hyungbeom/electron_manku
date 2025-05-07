import React, {useEffect, useRef, useState} from "react";
import {commonManage, gridManage} from "@/utils/commonManage";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {findDocumentInfo} from "@/utils/api/commonApi";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {remittanceReadColumn} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";

export default function Order({tableRef, tableData = [], info, setInfo}) {


    const gridRef = useRef(null);
    const handleAddressComplete = (address, zipCode) => {
        setInfo(v => {
            return {...v, recipientAddress: address, recipientPostalCode: zipCode}
        })
    };

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }

    const isLoad = useRef(null);

    const [totalRow, setTotalRow] = useState(0);
    useEffect(() => {
        console.log('@!@@@@@@@@@@@@@@@@@')
        // if(!tableData) return;
        if(!isLoad.current) return;
        gridManage.resetData(gridRef, tableData);
        setTotalRow(tableData?.length ?? 0);
        isLoad.current = true;

    }, [tableData]);

    async function handleKeyPress(e) {

        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'connectInquiryNo' :
                    const result = await findDocumentInfo(e, setInfo);
                    setInfo(v => {
                        return {
                            ...result[0],
                            connectInquiryNo: info.connectInquiryNo
                        }
                    })

                    break;
            }
        }
    }

    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        // setLoading(true)
        gridRef.current = params.api;

        // await getData.post('remittance/getRemittanceList', {}).then(v=>{

        params.api.applyTransaction({add: tableData});
        // })

        // await getRemittanceList({data: getRemittanceSearchInit()}).then(v => {
        //     params.api.applyTransaction({add: v?.data});
        //     // setTotalRow(v.pageInfo.totalRow)
        // });
        // setLoading(false);
    };

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 송금 > 국내송금 조회
     */
    async function confirm() {
        // if (gridRef.current.getSelectedRows().length < 1) {
        //     return message.error('삭제할 송금 정보를 선택해주세요.')
        // }
        // setLoading(false);
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
                // getPropertyId={getPropertyId}
                gridRef={gridRef}
                columns={remittanceReadColumn}
                onGridReady={onGridReady}
                funcButtons={['agPrint']}
            />
        </>
    );
}