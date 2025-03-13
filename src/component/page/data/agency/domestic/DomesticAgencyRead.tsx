import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";

import Button from "antd/lib/button";
import {CopyOutlined,} from "@ant-design/icons";
import message from "antd/lib/message";

import {tableCodeDomesticPurchaseColumns,} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";
import _ from "lodash";
import {codeDomesticAgencyWriteInitial} from "@/utils/initialList";
import {inputForm, MainCard, selectBoxForm} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {searchDomesticAgency} from "@/utils/api/mainApi";


export default function DomesticAgencyUpdate({getPropertyId, getCopyPage}) {

    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(codeDomesticAgencyWriteInitial)

    const [info, setInfo] = useState(copyInit);
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchDomesticAgency({
            data: {
                "searchType": "1",      // 1: 코드, 2: 상호명, 3: Maker
                "searchText": "",
                "page": 1,
                "limit": -1
            }
        }).then(v => {
            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
        })
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            agencyId: 'agencyId',
        });

        setLoading(true)

        await getData.post('agency/deleteAgency', {deleteList: deleteList}).then(v => {
            searchInfo(v.data.code === 1)
        })
    }


    async function searchInfo(e) {

        if (e) {
            setLoading(true)


            await searchDomesticAgency({
                data: {
                    "searchType": info['searchType'],      // 1: 코드, 2: 상호명, 3: Maker
                    "searchText": info['searchText'],
                    "page": 1,
                    "limit": -1
                }
            }).then(v => {
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
        setLoading(false)
    }

    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    async function moveRouter() {
        getCopyPage('domestic_agency_write', {orderDetailList: []})
    }

    return <Spin spinning={loading} tip={'국내 매입처 조회중...'}>
        <ReceiveComponent searchInfo={searchInfo}/>
        <>

            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 250 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'국내 매입처 조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'},
                              {name: '초기화', func: clearAll, type: 'danger'},
                              {name: '신규생성', func: moveRouter}]}
                          mini={mini} setMini={setMini}>
                    {mini ?
                        <div style={{display: 'flex', alignItems: 'center'}}>

                            <div style={{marginTop: -10, width: 150}}>
                                {selectBoxForm({
                                    title: '유효기간', id: 'searchType', list: [
                                        {value: 1, label: '코드'},
                                        {value: 2, label: '상호명'},
                                        {value: 3, label: 'Maker'}
                                    ], onChange: onChange, data: info
                                })}
                            </div>
                            <div style={{width: 500, marginLeft: 10}}>
                                {inputForm({
                                    title: '검색어',
                                    id: 'searchText',
                                    onChange: onChange,
                                    data: info,
                                    size: 'small',
                                    handleKeyPress: handleKeyPress
                                })}
                            </div>
                        </div>
                        : <></>}
                </MainCard>

                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                           totalRow={totalRow}
                           getPropertyId={getPropertyId}
                           gridRef={gridRef}
                           columns={tableCodeDomesticPurchaseColumns}
                           onGridReady={onGridReady}
                           funcButtons={['agPrint']}
                />

            </div>
        </>
    </Spin>
}