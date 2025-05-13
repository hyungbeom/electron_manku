import React from "react";
import {remittanceInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";

export default function Remittance({tableData, tableRef, setInfo}) {

    function partialRemittance (sumSupplyAmount) {
        console.log(sumSupplyAmount)
        const amount = Number(sumSupplyAmount);
        if (isNaN(amount)) {
            return;
        }
        setInfo(prev => {
            const prevTotalAmount= prev.totalAmount || 0;
            const totalAmount= typeof prevTotalAmount === "string"
                ? parseFloat(prevTotalAmount.replace(/,/g, '')) || 0
                : prevTotalAmount;

            const balance = totalAmount - amount;
            return {
                ...prev,
                partialRemittance: amount.toLocaleString(),
                balance : balance.toLocaleString()
            }
        });
    }

    return (
            <Table data={tableData} column={remittanceInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_remittance_write_column'} customFunc={partialRemittance} />
    );
}