import React, {memo} from "react";
import {DRInfo, ORInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import _ from "lodash";
import {formatAmount} from "@/utils/columnList";

function Remittance({
                        tableRef = null,
                        tableData = [],
                        setInfo = null,
                        type = 'domestic' }) {

    function partialRemittance (sumSupplyAmount) {
        // 소수점 대응
        const currency = type !== 'overseas' ? 'KRW' : 'USD'

        const cleaned = String(sumSupplyAmount).replace(/,/g, '').trim();

        const partialRemittance = parseFloat(cleaned);
        if (isNaN(partialRemittance)) return;

        setInfo(prev => {
            const totalAmount = parseFloat(String(prev.totalAmount || '0').replace(/,/g, '').trim()) || 0;
            const balance = totalAmount - partialRemittance;

            return {
                ...prev,
                partialRemittance: formatAmount(partialRemittance, currency) || 0,
                balance: formatAmount(balance, currency) || 0
            };
        });
    }

    return (
        type == 'overseas'
            ? <Table data={tableData} column={ORInfo['write']} funcButtons={['print']} ref={tableRef}
                     type={'overseas_remittance_write_column'} customFunc={partialRemittance} />
            : <Table data={tableData} column={DRInfo['write']} funcButtons={['print']} ref={tableRef}
                    type={'domestic_remittance_write_column'} customFunc={partialRemittance} />
    );
}

export default memo(Remittance, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});