import React from "react";
import {remittanceInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";

export default function Remittance({tableData, tableRef, customFunc = null}) {

    return (
            <Table data={tableData} column={remittanceInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_remittance_write_column'} customeFunc />
    );
}