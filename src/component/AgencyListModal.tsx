import {searchAgencyCodeColumn} from "@/utils/columnList";
import Modal from "antd/lib/modal/Modal";
import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {tableTheme} from "@/utils/common";
import {AgGridReact} from "ag-grid-react";
import Input from "antd/lib/input/Input";
import {modalList} from "@/utils/initialList";
import Button from "antd/lib/button";
import {findCodeInfo} from "@/utils/api/commonApi";
import {gridManage} from "@/utils/commonManage";

export default function AgencyListModal({isModalOpen, setIsModalOpen, getRows}) {
    const gridRef = useRef(null);


    const onGridReady = async (params) => {
        gridRef.current = params.api;


        const data = await getData.post('agency/getAgencyListForEstimate', {
            searchType: "",
            searchText: '', // 대리점코드 or 대리점 상호명
            page: 1,
            limit: -1
        });

        gridRef.current.applyTransaction({add: data?.data?.entity?.agencyList});
    };


    const handleOk = () => {
        setIsModalOpen(v => {
            return {...v, estimate: false}
        });
    };

    const handleCancel = () => {
        setIsModalOpen(v => {
            return {...v, estimate: false}
        });
    };

    const [info, setInfo] = useState('');

    async function searchFunc() {
        const data = await getData.post('agency/getAgencyListForEstimate', {
            searchType: '',
            searchText: info, // 대리점코드 or 대리점 상호명
            page: 1,
            limit: -1
        });
        gridManage.resetData(gridRef, data?.data?.entity?.agencyList)
    }

    return <Modal title="매입처 조회" width={1000} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>


        <div style={{display: 'flex', justifyContent: 'space-between', gap: 15, marginBottom: 20}}>
            <Input style={{width: '100%'}}
                   onKeyDown={e => {
                       if (e.key === 'Enter') {
                           searchFunc();
                       }
                   }}
                   placeholder={'코드 또는 상호를 입력하세요'}
                   id={'agencyCode'} value={info}
                   onChange={(e: any) => setInfo(e.target.value)}></Input>
            <Button onClick={searchFunc}>조회</Button>
        </div>
        {/*@ts-ignored*/}
        <AgGridReact containerStyle={{height: '93%', width: '100%', height: `calc(100vh - 400px)`}} theme={tableTheme}
                     ref={gridRef}
                     onCellClicked={async (e) => {
                         getRows(e.data);
                         setIsModalOpen(v => {
                             return {...v, agency: false}
                         });
                     }}
                     onGridReady={onGridReady}
                     columnDefs={searchAgencyCodeColumn}
                     pagination={true}
                     gridOptions={{suppressContextMenu: true}}

        />

    </Modal>
}