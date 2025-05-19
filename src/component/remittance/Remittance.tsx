import React, {memo} from "react";
import {DRInfo, ORInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import _ from "lodash";

function Remittance({
                        tableRef = null,
                        tableData = [],
                        setInfo = null,
                        type = '' }) {

    function partialRemittance (sumSupplyAmount) {
        const partialRemittance = Number(sumSupplyAmount);
        if (isNaN(partialRemittance)) {
            return;
        }
        setInfo(prev => {
            let totalAmount = Number(String(prev.totalAmount || '0').replace(/,/g, ''));
            const balance = totalAmount - partialRemittance;
            return {
                ...prev,
                partialRemittance: partialRemittance.toLocaleString(),
                balance : balance.toLocaleString()
            }
        });
    }

    return (
        type == ''
            ? <Table data={tableData} column={DRInfo['write']} funcButtons={['print']} ref={tableRef}
                    type={'domestic_remittance_write_column'} customFunc={partialRemittance} />
            : <Table data={tableData} column={ORInfo['write']} funcButtons={['print']} ref={tableRef}
                     type={'overseas_remittance_write_column'} customFunc={partialRemittance} />
    );
}

export default memo(Remittance, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});