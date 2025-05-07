import {BoxCard, datePickerForm, inputForm, inputNumberForm, selectBoxForm, TopBoxCard} from "@/utils/commonForm";
import React, {useState} from "react";
import {commonManage, gridManage} from "@/utils/commonManage";
import AddressSearch from "@/component/AddressSearch";
import {DownloadOutlined} from "@ant-design/icons";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {remittanceInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";

export default function Remittance({tableRef, tableData, info, setInfo}) {

    console.log(tableData, 'tableData::::')
    const handleAddressComplete = (address, zipCode) => {
        setInfo(v => {
            return {...v, recipientAddress: address, recipientPostalCode: zipCode}
        })
    };

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }


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



    return (
        <div style={{height: '400px'}}>
            <Table data={tableData} column={remittanceInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_remittance_write_column'}/>
        </div>
    );
}