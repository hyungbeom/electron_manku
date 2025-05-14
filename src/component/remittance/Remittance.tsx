import React, {memo} from "react";
import {remittanceInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import _ from "lodash";

function Remittance({tableData, tableRef, setInfo}) {

    function partialRemittance (sumSupplyAmount) {
        const amount = Number(sumSupplyAmount);
        if (isNaN(amount)) {
            return;
        }
        setInfo(prev => {
            let totalAmount = Number(String(prev.totalAmount || '0').replace(/,/g, ''));
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

export default memo(Remittance, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});