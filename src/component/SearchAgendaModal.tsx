import Modal from "antd/lib/modal/Modal";
import Input from "antd/lib/input/Input";
import Button from "antd/lib/button";
import {AgGridReact} from "ag-grid-react";
import {searchAgencyCodeColumn} from "@/utils/columnList";
import React, {useEffect, useState} from "react";
import {getData} from "@/manage/function/api";
import {tableTheme} from "@/utils/common";

export default function SearchAgendaModal({agencyData, info, setInfo, isModalOpen, setIsModalOpen}){
    const [data, setData] = useState(agencyData)
    const [code, setCode] = useState(info['agencyCode']);

    useEffect(() => {
        searchFunc();
    }, [])

    async function searchFunc() {
        const result = await getData.post('agency/getAgencyListForEstimate', {
            "searchText": code,       // 대리점코드 or 대리점 상호명
            "page": 1,
            "limit": -1
        });
        setData(result?.data?.entity?.agencyList)
    }

    function handleKeyPress(e){
        if (e.key === 'Enter') {
            searchFunc();
        }
    }

    return <>
         <Modal
        // @ts-ignored
        id={'event1'}
        title={'대리점 코드 조회'}
        onCancel={() => setIsModalOpen({event1: false, event2: false})}
        open={isModalOpen?.event1}
        width={'60vw'}
        onOk={() => setIsModalOpen({event1: false, event2: false})}
    >
        <div style={{height: '50vh'}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:15, marginBottom: 20}}>
                <Input style={{width:'100%'}} onKeyDown={handleKeyPress} id={'agencyCode'} value={code} onChange={(e)=>setCode(e.target.value)}></Input>
                <Button onClick={searchFunc}>조회</Button>
            </div>

            <AgGridReact containerStyle={{height:'93%', width:'100%' }} theme={tableTheme}
                         onCellClicked={(e)=>{
                             setInfo(v=>{
                                 return {
                                     ...v, ... e.data
                                 }})
                             setIsModalOpen({event1: false, event2: false})
                         }}
                         rowData={data}
                         columnDefs={searchAgencyCodeColumn}
                         pagination={true}

            />
        </div>
    </Modal>
    </>
}