import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";

import {makerColumn,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial, orderReadInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, radioForm} from "@/utils/commonForm";
import {searchDomesticCustomer, searchMaker, searchOrder} from "@/utils/api/mainApi";
import {gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";

export default function MakerRead({getPropertyId, getCopyPage}) {
    const gridRef = useRef(null);

    const [info, setInfo] = useState(codeDomesticPurchaseInitial);
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);


    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchMaker({data: orderReadInitial}).then(v => {
            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
        })
    };

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }




    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }



    async function searchInfo(e) {

        if (e) {
            setLoading(true)


            await searchMaker({
                data: {
                    "searchType": info['searchType'],      // 1: 코드, 2: 상호명, 3: Maker
                    "searchText": info['searchText'],
                    "page": 1,
                    "limit": -1
                }
            }).then(v => {
                console.log(info,'v.data:')
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
        setLoading(false)
    }


    function clearAll() {

    }

    async function moveRouter() {
        getCopyPage('maker_write', {orderDetailList: []})

    }

    function deleteList() {

    }

    return  <Spin spinning={loading} tip={'메이커 조회중...'}>
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
                        list: [{value: 1, title: 'Maker'},
                            {value: 2, title: 'Item'},
                            {value: 3, title: 'AREA'}]
                    })}


                    <div style={{width: 500, marginLeft: 20}}>
                        {inputForm({
                            title: '',
                            id: 'searchText',
                            onChange: onChange,
                            handleKeyPress : handleKeyPress,
                            data: info,
                            size: 'middle'
                        })}
                    </div>


                </div> : <></>}
            </MainCard>

            {/*@ts-ignored*/}
            <TableGrid
                totalRow={totalRow}
                getPropertyId={getPropertyId}
                gridRef={gridRef}
                columns={makerColumn}
                onGridReady={onGridReady}
                funcButtons={['print']}
            />
        </div>
    </Spin>
}
