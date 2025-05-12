import React from "react";
import {remittanceInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";

export default function Remittance({tableData, tableRef, setInfo}) {

    function partialRemittance (sumSupplyAmount) {
        const amount = Number(sumSupplyAmount);
        if (isNaN(amount)) {
            return;
        }
        setInfo(prev => ({
            ...prev,
            partialRemittance: amount,
            balance : prev.totalAmount - amount
        }));
    }

    return (
            <Table data={tableData} column={remittanceInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_remittance_write_column'} customFunc={partialRemittance} />
    );
}