import React, {useEffect, useState} from "react";
import {getData} from "@/manage/function/api";
import Modal from "antd/lib/modal/Modal";
import Input from "antd/lib/input/Input";
import Button from "antd/lib/button";
import {AgGridReact} from "ag-grid-react";
import {searchCustomerColumn} from "@/utils/columnList";
import {tableTheme} from "@/utils/common";

export default function SearchCustomerModal({customerData, info, setInfo, isModalOpen, setIsModalOpen}){

    const [data, setData] = useState(customerData)
    const [customer, setCustomer] = useState(info);


    useEffect(() => {
        searchFunc();
    }, [])

    useEffect(() => {
        setData(customerData);
    }, [customerData])


    async function searchFunc() {
        // console.log(modalInfo, 'modalInfo:')
        const result = await getData.post('customer/getCustomerListForEstimate', {
            "searchText": customer,       // 상호명
            "page": 1,
            "limit": -1
        });
        setData(result?.data?.entity?.customerList)
    }

    function handleKeyPress(e){
        if (e.key === 'Enter') {
            searchFunc();
        }
    }


    return <Modal
        // @ts-ignored
        id={'event2'}
        title={'거래처 상호명 조회'}
        onCancel={() => setIsModalOpen({event1: false, event2: false, event3: false})}
        open={isModalOpen?.event2}
        width={'60vw'}
        onOk={() => setIsModalOpen({event1: false, event2: false, event3: false})}
    >
        <div style={{height: '50vh'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', gap: 15, marginBottom: 20}}>
                <Input onKeyDown={handleKeyPress} id={'customerName'} value={customer}
                       onChange={(e) => setCustomer(e.target.value)}></Input>
                <Button onClick={searchFunc}>조회</Button>
            </div>

            <AgGridReact containerStyle={{height:'93%', width:'100%' }} theme={tableTheme}
                         onCellClicked={(e)=>{
                             setInfo(v=>{
                                 return {
                                     ...v,phoneNumber: e?.data?.directTel, ... e.data
                                 }})
                             setIsModalOpen({event1: false, event2: false, event3: false})
                         }}
                         rowData={data}
                         columnDefs={searchCustomerColumn}
                         pagination={true}
            />
        </div>
    </Modal>
}