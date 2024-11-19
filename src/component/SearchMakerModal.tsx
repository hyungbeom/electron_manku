import Modal from "antd/lib/modal/Modal";
import Input from "antd/lib/input/Input";
import Button from "antd/lib/button";
import {AgGridReact} from "ag-grid-react";
import {searchAgencyCodeColumn, searchMakerColumn} from "@/utils/columnList";
import React, {useEffect, useState} from "react";
import {getData} from "@/manage/function/api";
import {tableTheme} from "@/utils/common";

export default function SearchAgendaModal({makerData, info, setInfo, isModalOpen, setIsModalOpen}){
    const [data, setData] = useState(makerData)
    const [maker, setMaker] = useState(info['maker']);

    useEffect(() => {
        searchFunc();
    }, [])

    useEffect(() => {
        setData(makerData);
    }, [makerData])

    async function searchFunc() {
        const result = await getData.post('maker/getMakerList', {
            "searchType": "1",
            "searchText": maker,
            "page": 1,
            "limit": -1
        });

        // console.log(result, 'result~~~~')
        setData(result?.data?.entity?.makerList)
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
                <Input style={{width:'100%'}} onKeyDown={handleKeyPress} id={'maker'} value={maker} onChange={(e)=>setMaker(e.target.value)}></Input>
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
                         columnDefs={searchMakerColumn}
                         pagination={true}

            />
        </div>
    </Modal>
    </>
}