import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";

import {makerColumn,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, radioForm} from "@/utils/commonForm";
import Button from "antd/lib/button";
import {CopyOutlined} from "@ant-design/icons";

export default function MakerRead({dataInfo=[], getPropertyId}) {
    const gridRef = useRef(null);

    const [info, setInfo] = useState(codeDomesticPurchaseInitial);
    const [mini, setMini] = useState(true);


    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await getData.post('maker/getMakerList', {
            "searchType": "",       // 구분 1: MAKER, 2: ITEM, 3: "AREA"
            "searchText": "",       // 검색어
            "page": 1,
            "limit": -1
        }).then(v=>{
            params.api.applyTransaction({add: v?.data?.entity?.makerList});
        })

    };


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }


    async function searchInfo() {
            await getData.post('maker/getMakerList',{
                "searchType": "",       // 구분 1: MAKER, 2: ITEM, 3: "AREA"
                "searchText": "",       // 검색어
                "page": 1,
                "limit": -1
            }).then(v=>{
                console.log(v,'::::')
            })
    }

    function clearAll() {

    }

    async function moveRouter() {
        window.open(`/maker_write`, '_blank', 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
    }

    function deleteList(){

    }
    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 250 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'메이커 조회'}
                      list={[{name: '조회', func: searchInfo, type: 'primary'},
                          {name: '초기화', func: clearAll, type: 'danger'},
                          {name: '신규생성', func: moveRouter}]}
                      mini={mini} setMini={setMini}>

                {mini ? <div style={{display: 'flex', alignItems: 'center', padding: 10}}>

                    {radioForm({
                        title: '',
                        id: 'searchType',
                        onChange: onChange,
                        data: info,
                        list: [{value: 1, title: '코드'},
                            {value: 2, title: '상호명'},
                            {value: 3, title: 'item'},
                            {value: 4, title: '국가'}]
                    })}


                    <div style={{width: 500, marginLeft: 20}}>
                        {inputForm({
                            title: '',
                            id: 'searchCustomerName',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                    </div>


                </div> : <></>}
            </MainCard>

            {/*@ts-ignored*/}
            <TableGrid
                gridRef={gridRef}
                columns={makerColumn}
                onGridReady={onGridReady}
                funcButtons={['print']}
            />
        </div>
    </>
}
